import * as azure from "@pulumi/azure-native";

import {
  patinaTestingK8sResourceGroup,
  platformInfraResourceGroup,
} from "@/azure/groups";
import { provider } from "@/azure/provider";
import { k8sStorageAccount, pulumiStateStorageAccount } from "@/azure/storage";

export const pulumiStateBlobContainer = new azure.storage.BlobContainer(
  "pulumi-state-blob-container",
  {
    resourceGroupName: platformInfraResourceGroup.name,
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
    resourceGroupName: patinaTestingK8sResourceGroup.name,
    accountName: k8sStorageAccount.name,
    containerName: "db-backup",
    publicAccess: azure.storage.PublicAccess.None,
  },
  {
    provider,
  },
);
