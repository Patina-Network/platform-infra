import * as azure from "@pulumi/azure-native";
import * as azuread from "@pulumi/azuread";

import { AZURE_IDENTITIES, type AzureIdentityName } from "@/azure/identities";
import { azureadProvider, provider } from "@/azure/provider";
import { sopsMasterVault } from "@/azure/vaults";
import { AZURE_KEY_VAULT_ROLES } from "@/azure/vaults/rbac/const";
import {
  SOPS_VAULT_ADMIN_USERS,
  SOPS_VAULT_READONLY_USERS,
} from "@/azure/vaults/rbac/inputs";
import { env } from "@/env";

// TODO: refactor RBAC outputs to group by role ID & generate resource names with less manual work instead

const getRoleDefinitionId = (subscriptionId: string, roleId: string) =>
  `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleId}`;

const getGroupResourceName = (groupName: string) => `azure-group-${groupName}`;

const getGroupMemberResourceName = (groupName: string, memberName: string) =>
  `azure-group-${groupName}-member-${memberName}`;

const getVaultRoleAssignmentResourceName = (
  principalName: string,
  roleName: string,
) => `azure-role-assignment-${principalName}-key-vault-sops-master-${roleName}`;

export const sopsMasterReadersGroup = new azuread.Group(
  getGroupResourceName("sops-master-readers"),
  {
    displayName: "sops-master-readers",
    mailEnabled: false,
    securityEnabled: true,
  },
  { provider: azureadProvider },
);

export const sopsMasterReaderGroupMembers = Object.fromEntries(
  SOPS_VAULT_READONLY_USERS.map((userName) => [
    userName,
    new azuread.GroupMember(
      getGroupMemberResourceName(
        "sops-master-readers",
        AZURE_IDENTITIES[userName].name,
      ),
      {
        groupObjectId: sopsMasterReadersGroup.objectId,
        memberObjectId: AZURE_IDENTITIES[userName].objectId,
      },
      { provider: azureadProvider },
    ),
  ]),
);

export const sopsMasterReaderRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName("sops-master-readers", "reader"),
    {
      principalId: sopsMasterReadersGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultReader,
      ),
      scope: sopsMasterVault.id,
    },
    { provider },
  );

export const sopsMasterReaderSecretsUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName("sops-master-readers", "secrets-user"),
    {
      principalId: sopsMasterReadersGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultSecretsUser,
      ),
      scope: sopsMasterVault.id,
    },
    { provider },
  );

export const sopsMasterReaderCryptoUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName("sops-master-readers", "crypto-user"),
    {
      principalId: sopsMasterReadersGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultCryptoUser,
      ),
      scope: sopsMasterVault.id,
    },
    { provider },
  );

export const sopsMasterAdminsGroup = new azuread.Group(
  getGroupResourceName("sops-master-admins"),
  {
    displayName: "sops-master-admins",
    mailEnabled: false,
    securityEnabled: true,
  },
  { provider: azureadProvider },
);

export const sopsMasterAdminGroupMembers = Object.fromEntries(
  (SOPS_VAULT_ADMIN_USERS as AzureIdentityName[]).map((userName) => [
    userName,
    new azuread.GroupMember(
      getGroupMemberResourceName(
        "sops-master-admins",
        AZURE_IDENTITIES[userName].name,
      ),
      {
        groupObjectId: sopsMasterAdminsGroup.objectId,
        memberObjectId: AZURE_IDENTITIES[userName].objectId,
      },
      { provider: azureadProvider },
    ),
  ]),
);

export const sopsMasterAdminSecretsOfficerRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName("sops-master-admins", "secrets-officer"),
    {
      principalId: sopsMasterAdminsGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultSecretsOfficer,
      ),
      scope: sopsMasterVault.id,
    },
    { provider },
  );

export const sopsMasterAdminRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName("sops-master-admins", "administrator"),
    {
      principalId: sopsMasterAdminsGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultAdministrator,
      ),
      scope: sopsMasterVault.id,
    },
    { provider },
  );

export const fluxKustomizeSopsMasterCryptoUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName("flux-kustomize", "crypto-user"),
    {
      principalId: AZURE_IDENTITIES["kustomize-controller"].objectId,
      principalType: azure.authorization.PrincipalType.ServicePrincipal,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultCryptoUser,
      ),
      scope: sopsMasterVault.id,
    },
    { provider },
  );
