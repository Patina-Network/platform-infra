import * as azure from "@pulumi/azure-native";

import { azureResourceGroups } from "@/azure/groups";
import { provider } from "@/azure/provider";
import {
  DEFAULT_STORAGE_ACCOUNT_SETTINGS,
  DEFAULT_BLOB_CONTAINER_SETTINGS,
  STORAGE_ACCOUNTS,
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
      storageAccountProperties.blobs.map((blobContainerName) => [
        blobContainerName,
        new azure.storage.BlobContainer(
          getBlobContainerResourceName(
            storageAccountProperties.resourceGroupName,
            storageAccountName,
            blobContainerName,
          ),
          {
            accountName: storageAccountName,
            containerName: blobContainerName,
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
