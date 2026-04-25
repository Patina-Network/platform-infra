import * as azure from "@pulumi/azure-native";

import { azureResourceGroups } from "@/azure/groups";
import { provider } from "@/azure/provider";
import {
  DEFAULT_BLOB_CONTAINER_SETTINGS,
  DEFAULT_STORAGE_ACCOUNT_SETTINGS,
  STORAGE_ACCOUNTS,
  type AzureStorageAccountNameWithTtl,
} from "@/azure/storage/inputs";

const getStorageAccountResourceName = (
  resourceGroupName: string,
  accountName: string,
) => `azure-resource-group-${resourceGroupName}-storage-account-${accountName}`;

const getBlobContainerResourceName = (
  resourceGroupName: string,
  accountName: string,
  containerName: string,
) =>
  `azure-resource-group-${resourceGroupName}-storage-account-${accountName}-blob-container-${containerName}`;

const getManagementPolicyResourceName = (
  resourceGroupName: string,
  accountName: string,
) =>
  `azure-resource-group-${resourceGroupName}-storage-account-${accountName}-management-policy-default`;

export const azureStorageAccounts = Object.fromEntries(
  Object.entries(STORAGE_ACCOUNTS).map(
    ([storageAccountName, storageAccountProperties]) => [
      storageAccountName,
      new azure.storage.StorageAccount(
        getStorageAccountResourceName(
          storageAccountProperties.resourceGroupName,
          storageAccountName,
        ),
        {
          resourceGroupName:
            azureResourceGroups[storageAccountProperties.resourceGroupName]
              .name,
          accountName: storageAccountName,
          ...DEFAULT_STORAGE_ACCOUNT_SETTINGS,
        },
        {
          provider,
        },
      ),
    ],
  ),
);

export const azureBlobContainers = Object.fromEntries(
  Object.entries(STORAGE_ACCOUNTS).map(
    ([storageAccountName, storageAccountProperties]) =>
      storageAccountProperties.blobs.map((blobContainer) => [
        blobContainer.name,
        new azure.storage.BlobContainer(
          getBlobContainerResourceName(
            storageAccountProperties.resourceGroupName,
            storageAccountName,
            blobContainer.name,
          ),
          {
            accountName: storageAccountName,
            containerName: blobContainer.name,
            resourceGroupName:
              azureResourceGroups[storageAccountProperties.resourceGroupName]
                .name,
            ...DEFAULT_BLOB_CONTAINER_SETTINGS,
          },
          { provider },
        ),
      ]),
  ),
);

export const azureStorageManagementPolicies: Record<
  AzureStorageAccountNameWithTtl,
  azure.storage.ManagementPolicy
> = Object.fromEntries(
  Object.entries(STORAGE_ACCOUNTS).flatMap(
    ([storageAccountName, storageAccountProperties]) => {
      const ttlContainers = storageAccountProperties.blobs.filter(
        (blobContainer) => blobContainer.ttl !== undefined,
      );

      if (!ttlContainers.length) {
        return [];
      }

      return [
        [
          storageAccountName,
          new azure.storage.ManagementPolicy(
            getManagementPolicyResourceName(
              storageAccountProperties.resourceGroupName,
              storageAccountName,
            ),
            {
              accountName: storageAccountName,
              managementPolicyName: "default",
              policy: {
                rules: ttlContainers.map((blobContainer) => ({
                  definition: {
                    actions: {
                      baseBlob: {
                        delete: {
                          daysAfterModificationGreaterThan:
                            blobContainer.ttl.total({
                              unit: "days",
                            }),
                        },
                      },
                    },
                    filters: {
                      blobTypes: ["blockBlob"],
                      prefixMatch: [`${blobContainer.name}/`],
                    },
                  },
                  enabled: true,
                  name: `ttl-${blobContainer.name}`,
                  type: azure.storage.RuleType.Lifecycle,
                })),
              },
              resourceGroupName:
                azureResourceGroups[storageAccountProperties.resourceGroupName]
                  .name,
            },
            { provider },
          ),
        ],
      ];
    },
  ),
);
