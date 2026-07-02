import * as azure from "@pulumi/azure-native";
import * as azuread from "@pulumi/azuread";

import { AZURE_IDENTITIES, type AzureIdentityName } from "@/azure/identities";
import { azureadProvider, provider } from "@/azure/provider";
import {
  sopsAdministratorsVault,
  sopsMasterVault,
  sopsRoVault,
} from "@/azure/vaults";
import { AZURE_KEY_VAULT_ROLES } from "@/azure/vaults/rbac/const";
import {
  SOPS_ADMINISTRATORS_VAULT_USERS,
  SOPS_MASTER_VAULT_ADMIN_USERS,
  SOPS_MASTER_VAULT_READONLY_USERS,
  SOPS_RO_VAULT_READONLY_USERS,
  SOPS_RO_VAULT_ADMIN_USERS,
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
  vaultName: string,
) =>
  `azure-role-assignment-${principalName}-key-vault-${vaultName}-${roleName}`;

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
  SOPS_MASTER_VAULT_READONLY_USERS.map((userName) => [
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
    getVaultRoleAssignmentResourceName(
      "sops-master-readers",
      "reader",
      "sops-master",
    ),
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
    getVaultRoleAssignmentResourceName(
      "sops-master-readers",
      "secrets-user",
      "sops-master",
    ),
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
    getVaultRoleAssignmentResourceName(
      "sops-master-readers",
      "crypto-user",
      "sops-master",
    ),
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
  (SOPS_MASTER_VAULT_ADMIN_USERS as AzureIdentityName[]).map((userName) => [
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
    getVaultRoleAssignmentResourceName(
      "sops-master-admins",
      "secrets-officer",
      "sops-master",
    ),
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
    getVaultRoleAssignmentResourceName(
      "sops-master-admins",
      "administrator",
      "sops-master",
    ),
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
    getVaultRoleAssignmentResourceName(
      "flux-kustomize",
      "crypto-user",
      "sops-master",
    ),
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

export const sopsRoReadersGroup = new azuread.Group(
  getGroupResourceName("sops-ro-readers"),
  {
    displayName: "sops-ro-readers",
    mailEnabled: false,
    securityEnabled: true,
  },
  { provider: azureadProvider },
);

export const sopsRoReaderGroupMembers = Object.fromEntries(
  SOPS_RO_VAULT_READONLY_USERS.map((userName) => [
    userName,
    new azuread.GroupMember(
      getGroupMemberResourceName(
        "sops-ro-readers",
        AZURE_IDENTITIES[userName].name,
      ),
      {
        groupObjectId: sopsRoReadersGroup.objectId,
        memberObjectId: AZURE_IDENTITIES[userName].objectId,
      },
      { provider: azureadProvider },
    ),
  ]),
);

export const sopsRoReaderRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName("sops-ro-readers", "reader", "sops-ro"),
    {
      principalId: sopsRoReadersGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultReader,
      ),
      scope: sopsRoVault.id,
    },
    { provider },
  );

export const sopsRoReaderSecretsUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName(
      "sops-ro-readers",
      "secrets-user",
      "sops-ro",
    ),
    {
      principalId: sopsRoReadersGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultSecretsUser,
      ),
      scope: sopsRoVault.id,
    },
    { provider },
  );

export const sopsRoReaderCryptoUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName(
      "sops-ro-readers",
      "crypto-user",
      "sops-ro",
    ),
    {
      principalId: sopsRoReadersGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultCryptoUser,
      ),
      scope: sopsRoVault.id,
    },
    { provider },
  );

export const sopsRoAdminsGroup = new azuread.Group(
  getGroupResourceName("sops-ro-admins"),
  {
    displayName: "sops-ro-admins",
    mailEnabled: false,
    securityEnabled: true,
  },
  { provider: azureadProvider },
);

export const sopsRoAdminGroupMembers = Object.fromEntries(
  (SOPS_RO_VAULT_ADMIN_USERS as AzureIdentityName[]).map((userName) => [
    userName,
    new azuread.GroupMember(
      getGroupMemberResourceName(
        "sops-ro-admins",
        AZURE_IDENTITIES[userName].name,
      ),
      {
        groupObjectId: sopsRoAdminsGroup.objectId,
        memberObjectId: AZURE_IDENTITIES[userName].objectId,
      },
      { provider: azureadProvider },
    ),
  ]),
);

export const sopsRoAdminSecretsOfficerRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName(
      "sops-ro-admins",
      "secrets-officer",
      "sops-ro",
    ),
    {
      principalId: sopsRoAdminsGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultSecretsOfficer,
      ),
      scope: sopsRoVault.id,
    },
    { provider },
  );

export const sopsRoAdminRoleAssignment = new azure.authorization.RoleAssignment(
  getVaultRoleAssignmentResourceName(
    "sops-ro-admins",
    "administrator",
    "sops-ro",
  ),
  {
    principalId: sopsRoAdminsGroup.objectId,
    principalType: azure.authorization.PrincipalType.Group,
    roleDefinitionId: getRoleDefinitionId(
      env.azure.subscriptionId,
      AZURE_KEY_VAULT_ROLES.keyVaultAdministrator,
    ),
    scope: sopsRoVault.id,
  },
  { provider },
);

export const sopsAdministratorsGroup = new azuread.Group(
  getGroupResourceName("sops-administrators"),
  {
    displayName: "sops-administrators",
    mailEnabled: false,
    securityEnabled: true,
  },
  { provider: azureadProvider },
);

export const sopsAdministratorsGroupMembers = Object.fromEntries(
  SOPS_ADMINISTRATORS_VAULT_USERS.map((userName) => [
    userName,
    new azuread.GroupMember(
      getGroupMemberResourceName(
        "sops-administrators",
        AZURE_IDENTITIES[userName].name,
      ),
      {
        groupObjectId: sopsAdministratorsGroup.objectId,
        memberObjectId: AZURE_IDENTITIES[userName].objectId,
      },
      { provider: azureadProvider },
    ),
  ]),
);

export const sopsAdministratorsReaderRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName(
      "sops-administrators",
      "reader",
      "sops-administrators",
    ),
    {
      principalId: sopsAdministratorsGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultReader,
      ),
      scope: sopsAdministratorsVault.id,
    },
    { provider },
  );

export const sopsAdministratorsSecretsUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName(
      "sops-administrators",
      "secrets-user",
      "sops-administrators",
    ),
    {
      principalId: sopsAdministratorsGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultSecretsUser,
      ),
      scope: sopsAdministratorsVault.id,
    },
    { provider },
  );

export const sopsAdministratorsCryptoUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName(
      "sops-administrators",
      "crypto-user",
      "sops-administrators",
    ),
    {
      principalId: sopsAdministratorsGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultCryptoUser,
      ),
      scope: sopsAdministratorsVault.id,
    },
    { provider },
  );

export const pulumiAppSopsAdministratorsCryptoUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    getVaultRoleAssignmentResourceName(
      "app",
      "crypto-user",
      "sops-administrators",
    ),
    {
      principalId: AZURE_IDENTITIES["app"].objectId,
      principalType: azure.authorization.PrincipalType.ServicePrincipal,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultCryptoUser,
      ),
      scope: sopsAdministratorsVault.id,
    },
    { provider },
  );
