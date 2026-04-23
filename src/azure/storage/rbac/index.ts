import * as azure from "@pulumi/azure-native";
import * as azuread from "@pulumi/azuread";

import { platformInfraPulumiSp } from "@/azure/apps";
import { azureadProvider, provider } from "@/azure/provider";
import { azureServiceAccountManagedIdentities } from "@/azure/serviceaccounts";
import {
  AZURE_SERVICE_ACCOUNTS,
  type AzureServiceAccountName,
} from "@/azure/serviceaccounts/inputs";
import { azureStorageAccounts } from "@/azure/storage";
import { AZURE_STORAGE_RBAC_ROLE_IDS } from "@/azure/storage/rbac/const";
import {
  STORAGE_ACCOUNT_READERS,
  STORAGE_ACCOUNT_WRITERS,
  type StorageRbacPrincipal,
} from "@/azure/storage/rbac/inputs";
import { azureUsers } from "@/azure/users";
import { AZURE_USERS, type AzureUserName } from "@/azure/users/inputs";
import { env } from "@/env";

type StorageAccessLevel = "readers" | "writers";

const getRoleDefinitionId = (subscriptionId: string, roleId: string) =>
  `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleId}`;

const getStorageAccessGroupName = (
  storageAccountName: string,
  accessLevel: StorageAccessLevel,
) => `${storageAccountName}-${accessLevel}`;

const getStorageAccessGroupResourceName = (
  storageAccountName: string,
  accessLevel: StorageAccessLevel,
) =>
  `azure-group-${getStorageAccessGroupName(storageAccountName, accessLevel)}`;

const getStorageAccessGroupMemberResourceName = (
  storageAccountName: string,
  accessLevel: StorageAccessLevel,
  memberName: string,
) =>
  `azure-group-${getStorageAccessGroupName(storageAccountName, accessLevel)}-member-${memberName}`;

const getStorageBlobRoleAssignmentResourceName = (
  storageAccountName: string,
  roleName: "blob-data-reader" | "blob-data-contributor",
) => `azure-role-assignment-${storageAccountName}-storage-account-${roleName}`;

const isAzureUserName = (
  principal: StorageRbacPrincipal,
): principal is AzureUserName => principal in AZURE_USERS;

const isAzureServiceAccountName = (
  principal: StorageRbacPrincipal,
): principal is AzureServiceAccountName => principal in AZURE_SERVICE_ACCOUNTS;

const getPrincipalMemberName = (principal: StorageRbacPrincipal) => {
  if (principal === "app") {
    return "app";
  }

  if (isAzureUserName(principal)) {
    return AZURE_USERS[principal].mailNickname;
  }

  if (isAzureServiceAccountName(principal)) {
    return principal;
  }

  throw new Error(`Unknown storage RBAC principal: ${principal}`);
};

const getPrincipalObjectId = (principal: StorageRbacPrincipal) => {
  if (principal === "app") {
    return platformInfraPulumiSp.objectId;
  }

  if (isAzureUserName(principal)) {
    return azureUsers[principal].objectId;
  }

  if (isAzureServiceAccountName(principal)) {
    return azureServiceAccountManagedIdentities[principal].principalId;
  }

  throw new Error(`Unknown storage RBAC principal: ${principal}`);
};

export const azureStorageReaderGroups = Object.fromEntries(
  Object.keys(STORAGE_ACCOUNT_READERS).map((storageAccountName) => {
    return [
      storageAccountName,
      new azuread.Group(
        getStorageAccessGroupResourceName(storageAccountName, "readers"),
        {
          displayName: getStorageAccessGroupName(storageAccountName, "readers"),
          mailEnabled: false,
          securityEnabled: true,
        },
        { provider: azureadProvider },
      ),
    ];
  }),
);

export const azureStorageReaderGroupMembers = Object.fromEntries(
  Object.entries(STORAGE_ACCOUNT_READERS).flatMap(
    ([storageAccountName, principals]) =>
      principals.map((principal) => {
        return [
          `${storageAccountName}-${getPrincipalMemberName(principal)}`,
          new azuread.GroupMember(
            getStorageAccessGroupMemberResourceName(
              storageAccountName,
              "readers",
              getPrincipalMemberName(principal),
            ),
            {
              groupObjectId:
                azureStorageReaderGroups[storageAccountName].objectId,
              memberObjectId: getPrincipalObjectId(principal),
            },
            { provider: azureadProvider },
          ),
        ];
      }),
  ),
);

export const azureStorageReaderRoleAssignments = Object.fromEntries(
  Object.keys(STORAGE_ACCOUNT_READERS).map((storageAccountName) => [
    storageAccountName,
    new azure.authorization.RoleAssignment(
      getStorageBlobRoleAssignmentResourceName(
        storageAccountName,
        "blob-data-reader",
      ),
      {
        principalId: azureStorageReaderGroups[storageAccountName].objectId,
        principalType: azure.authorization.PrincipalType.Group,
        roleDefinitionId: getRoleDefinitionId(
          env.azure.subscriptionId,
          AZURE_STORAGE_RBAC_ROLE_IDS.reader,
        ),
        scope: azureStorageAccounts[storageAccountName].id,
      },
      { provider },
    ),
  ]),
);

export const azureStorageWriterGroups = Object.fromEntries(
  Object.keys(STORAGE_ACCOUNT_WRITERS).map((storageAccountName) => {
    return [
      storageAccountName,
      new azuread.Group(
        getStorageAccessGroupResourceName(storageAccountName, "writers"),
        {
          displayName: getStorageAccessGroupName(storageAccountName, "writers"),
          mailEnabled: false,
          securityEnabled: true,
        },
        { provider: azureadProvider },
      ),
    ];
  }),
);

export const azureStorageWriterGroupMembers = Object.fromEntries(
  Object.entries(STORAGE_ACCOUNT_WRITERS).flatMap(
    ([storageAccountName, principals]) =>
      principals.map((principal) => {
        return [
          `${storageAccountName}-${getPrincipalMemberName(principal)}`,
          new azuread.GroupMember(
            getStorageAccessGroupMemberResourceName(
              storageAccountName,
              "writers",
              getPrincipalMemberName(principal),
            ),
            {
              groupObjectId:
                azureStorageWriterGroups[storageAccountName].objectId,
              memberObjectId: getPrincipalObjectId(principal),
            },
            { provider: azureadProvider },
          ),
        ];
      }),
  ),
);

export const azureStorageWriterRoleAssignments = Object.fromEntries(
  Object.keys(STORAGE_ACCOUNT_WRITERS).map((storageAccountName) => [
    storageAccountName,
    new azure.authorization.RoleAssignment(
      getStorageBlobRoleAssignmentResourceName(
        storageAccountName,
        "blob-data-contributor",
      ),
      {
        principalId: azureStorageWriterGroups[storageAccountName].objectId,
        principalType: azure.authorization.PrincipalType.Group,
        roleDefinitionId: getRoleDefinitionId(
          env.azure.subscriptionId,
          AZURE_STORAGE_RBAC_ROLE_IDS.writer,
        ),
        scope: azureStorageAccounts[storageAccountName].id,
      },
      { provider },
    ),
  ]),
);
