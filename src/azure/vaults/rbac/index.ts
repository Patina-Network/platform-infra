import * as azure from "@pulumi/azure-native";
import * as azuread from "@pulumi/azuread";

import { AZURE_IDENTITIES } from "@/azure/identities";
import { azureadProvider, provider } from "@/azure/provider";
import { azureVaults } from "@/azure/vaults";
import { VAULTS } from "@/azure/vaults/inputs";
import { AZURE_KEY_VAULT_ROLES } from "@/azure/vaults/rbac/const";
import { VAULT_ACCESS } from "@/azure/vaults/rbac/inputs";
import { env } from "@/env";

const getRoleDefinitionId = (subscriptionId: string, roleId: string) =>
  `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleId}`;

const getGroupResourceName = (groupName: string) => `azure-group-${groupName}`;

const getGroupMemberResourceName = (groupName: string, memberName: string) =>
  `azure-group-${groupName}-member-${memberName}`;

const getVaultRoleAssignmentResourceName = (
  principalName: string,
  roleName: string,
  vaultName: string,
) =>
  `azure-role-assignment-${principalName}-key-vault-${vaultName}-${roleName}`;

// TODO: Remove after fixing Pulumi naming structre
const KEY_VAULT_ROLE_RESOURCE_NAMES = {
  [AZURE_KEY_VAULT_ROLES.keyVaultReader]: "reader",
  [AZURE_KEY_VAULT_ROLES.keyVaultSecretsUser]: "secrets-user",
  [AZURE_KEY_VAULT_ROLES.keyVaultSecretsOfficer]: "secrets-officer",
  [AZURE_KEY_VAULT_ROLES.keyVaultAdministrator]: "administrator",
  [AZURE_KEY_VAULT_ROLES.keyVaultCryptoUser]: "crypto-user",
} as const satisfies Record<string, string>;

const getVaultRoleResourceName = (roleId: string) => {
  const roleName =
    KEY_VAULT_ROLE_RESOURCE_NAMES[
      roleId as keyof typeof KEY_VAULT_ROLE_RESOURCE_NAMES
    ];
  if (!roleName) {
    throw new Error(`Unknown Key Vault role ID for resource naming: ${roleId}`);
  }
  return roleName;
};

const groupAccesses = Object.values(VAULT_ACCESS).flatMap((accessList) =>
  accessList.flatMap((access) => (access.kind === "group" ? [access] : [])),
);

export const vaultGroups = Object.fromEntries(
  groupAccesses.map(
    (access) =>
      [
        access.name,
        new azuread.Group(
          getGroupResourceName(access.name),
          {
            displayName: access.name,
            mailEnabled: false,
            securityEnabled: true,
          },
          { provider: azureadProvider },
        ),
      ] as const,
  ),
);

export const vaultGroupMembers = Object.fromEntries(
  groupAccesses.map(
    (access) =>
      [
        access.name,
        Object.fromEntries(
          access.members.map(
            (userName) =>
              [
                userName,
                new azuread.GroupMember(
                  getGroupMemberResourceName(
                    access.name,
                    AZURE_IDENTITIES[userName].name,
                  ),
                  {
                    groupObjectId: vaultGroups[access.name].objectId,
                    memberObjectId: AZURE_IDENTITIES[userName].objectId,
                  },
                  { provider: azureadProvider },
                ),
              ] as const,
          ),
        ),
      ] as const,
  ),
);

export const vaultRoleAssignments = Object.fromEntries(
  Object.entries(VAULT_ACCESS).flatMap(([vaultKey, accessList]) => {
    const vaultScopeId = azureVaults[vaultKey].id;
    const { vaultName } = VAULTS[vaultKey];

    return accessList.flatMap((access) => {
      const principal =
        access.kind === "group" ?
          {
            name: access.name,
            id: vaultGroups[access.name].objectId,
            type: azure.authorization.PrincipalType.Group,
          }
        : {
            name: access.label,
            id: AZURE_IDENTITIES[access.identity].objectId,
            type: AZURE_IDENTITIES[access.identity].principalType,
          };

      return access.roles.map((roleId) => {
        const resourceName = getVaultRoleAssignmentResourceName(
          principal.name,
          getVaultRoleResourceName(roleId),
          vaultName,
        );

        return [
          resourceName,
          new azure.authorization.RoleAssignment(
            resourceName,
            {
              principalId: principal.id,
              principalType: principal.type,
              roleDefinitionId: getRoleDefinitionId(
                env.azure.subscriptionId,
                roleId,
              ),
              scope: vaultScopeId,
            },
            { provider },
          ),
        ] as const;
      });
    });
  }),
);
