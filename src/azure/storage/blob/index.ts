import * as azure from "@pulumi/azure-native";

import { provider } from "@/azure/provider";
import { k8sStorageAccount, pulumiStateStorageAccount } from "@/azure/storage";

export const pulumiStateBlobContainer = new azure.storage.BlobContainer(
  "pulumi-state-blob-container",
  {
    resourceGroupName: "platform-infra",
    accountName: pulumiStateStorageAccount.name,
    containerName: "pulumi-state",
    publicAccess: azure.storage.PublicAccess.None,
  },
  {
    provider,
  },
);

export const dbBackupBlobContainer = new azure.storage.BlobContainer(
  "db-backup-blob-container",
  {
    resourceGroupName: "platform-infra",
    accountName: k8sStorageAccount.name,
    containerName: "db-backup",
    publicAccess: azure.storage.PublicAccess.None,
  },
  {
    provider,
  },
);
