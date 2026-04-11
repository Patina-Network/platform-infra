import * as azure from "@pulumi/azure-native";

import { platformInfraResourceGroup } from "@/azure/groups";
import { provider } from "@/azure/provider";

const subscription = azure.authorization.getClientConfigOutput({
  provider,
});

function makeStorageAccountName(subscriptionId: string) {
  return `patinainfra${subscriptionId.replace(/-/g, "").slice(0, 12)}`;
}

export const platformInfraStorageAccount = new azure.storage.StorageAccount(
  "platform-infra-storage-account",
  {
    resourceGroupName: platformInfraResourceGroup.name,
    accountName: subscription.subscriptionId.apply(makeStorageAccountName),
    location: platformInfraResourceGroup.location,
    kind: azure.storage.Kind.StorageV2,
    sku: {
      name: azure.storage.SkuName.Standard_LRS,
    },
    allowBlobPublicAccess: false,
    minimumTlsVersion: azure.storage.MinimumTlsVersion.TLS1_2,
    enableHttpsTrafficOnly: true,
  },
  { provider },
);
