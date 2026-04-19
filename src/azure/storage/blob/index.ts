import * as azure from "@pulumi/azure-native";

import { azureResourceGroupMap } from "@/azure/groups";
import { provider } from "@/azure/provider";
import { k8sStorageAccount, pulumiStateStorageAccount } from "@/azure/storage";

const getBlobContainerResourceName = (
  resourceGroupName: string,
  accountName: string,
  containerName: string,
) =>
  `azure-resource-group-${resourceGroupName}-storage-account-${accountName}-blob-container-${containerName}`;

export const pulumiStateBlobContainer = new azure.storage.BlobContainer(
  getBlobContainerResourceName(
    "platform-infra",
    "platform4pulumi",
    "pulumi-state",
  ),
  {
    resourceGroupName: azureResourceGroupMap["platform-infra"].name,
    accountName: pulumiStateStorageAccount.name,
    containerName: "pulumi-state",
    publicAccess: azure.storage.PublicAccess.None,
  },
  {
    provider,
    aliases: [{ name: "pulumi-state-blob-container" }],
  },
);

export const dbBackupBlobContainer = new azure.storage.BlobContainer(
  getBlobContainerResourceName("k8s", "k8sstorage0001", "db-backup"),
  {
    resourceGroupName: azureResourceGroupMap.k8s.name,
    accountName: k8sStorageAccount.name,
    containerName: "db-backup",
    publicAccess: azure.storage.PublicAccess.None,
  },
  {
    provider,
    aliases: [{ name: "db-backup-blob-container" }],
  },
);
