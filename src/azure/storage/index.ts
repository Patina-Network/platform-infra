import * as azure from "@pulumi/azure-native";

import { patinaTestingK8sResourceGroup } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

export const k8sStorageAccount = new azure.storage.StorageAccount(
  "k8s-storage-account",
  {
    resourceGroupName: patinaTestingK8sResourceGroup.name,
    accountName: "k8sstorage",
    location: patinaTestingK8sResourceGroup.name,
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

export const pulumiStateStorageAccount = new azure.storage.StorageAccount(
  "pulumi-state-storage-account",
  {
    resourceGroupName: "platform-infra",
    accountName: "platform4pulumi",
    location: DEFAULT_REGION,
    kind: azure.storage.Kind.StorageV2,
    sku: {
      name: azure.storage.SkuName.Standard_LRS,
    },
    accessTier: azure.storage.AccessTier.Hot,
    allowBlobPublicAccess: false,
    allowCrossTenantReplication: false,
    allowSharedKeyAccess: true,
    defaultToOAuthAuthentication: false,
    enableHttpsTrafficOnly: true,
    minimumTlsVersion: azure.storage.MinimumTlsVersion.TLS1_2,
    dnsEndpointType: azure.storage.DnsEndpointType.Standard,
    encryption: {
      keySource: azure.storage.KeySource.Microsoft_Storage,
      requireInfrastructureEncryption: false,
      services: {
        blob: {
          enabled: true,
          keyType: azure.storage.KeyType.Account,
        },
        file: {
          enabled: true,
          keyType: azure.storage.KeyType.Account,
        },
      },
    },
    networkRuleSet: {
      bypass: azure.storage.Bypass.AzureServices,
      defaultAction: azure.storage.DefaultAction.Allow,
      ipRules: [],
      resourceAccessRules: [],
      virtualNetworkRules: [],
    },
    publicNetworkAccess: azure.storage.PublicNetworkAccess.Enabled,
    tags: {},
  },
  {
    provider,
    import:
      "/subscriptions/7779681e-36d2-4f42-9289-8160bd1a407d/resourceGroups/platform-infra/providers/Microsoft.Storage/storageAccounts/platform4pulumi",
  },
);
