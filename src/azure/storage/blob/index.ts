import * as azure from "@pulumi/azure-native";

import { provider } from "@/azure/provider";
import { pulumiStateStorageAccount } from "@/azure/storage";

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
    import:
      "/subscriptions/7779681e-36d2-4f42-9289-8160bd1a407d/resourceGroups/platform-infra/providers/Microsoft.Storage/storageAccounts/platform4pulumi/blobServices/default/containers/pulumi-state",
  },
);
