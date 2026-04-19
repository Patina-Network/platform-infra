import * as azure from "@pulumi/azure-native";

import { azureResourceGroupMap } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

const getStorageAccountResourceName = (
  resourceGroupName: string,
  accountName: string,
) => `azure-resource-group-${resourceGroupName}-storage-account-${accountName}`;

const getLegacyStorageAccountResourceNames = (accountName: string) => [
  `azure-storage-account-${accountName}`,
  `azure-${accountName}-storage-account`,
];

export const k8sStorageAccount = new azure.storage.StorageAccount(
  getStorageAccountResourceName("k8s", "k8sstorage0001"),
  {
    resourceGroupName: azureResourceGroupMap.k8s.name,
    accountName: "k8sstorage0001",
    location: DEFAULT_REGION,
    kind: azure.storage.Kind.StorageV2,
    sku: {
      name: azure.storage.SkuName.Standard_LRS,
    },
    allowBlobPublicAccess: false,
    minimumTlsVersion: azure.storage.MinimumTlsVersion.TLS1_2,
    enableHttpsTrafficOnly: true,
  },
  {
    provider,
    aliases: getLegacyStorageAccountResourceNames("k8sstorage0001").map(
      (name) => ({ name }),
    ),
  },
);

export const pulumiStateStorageAccount = new azure.storage.StorageAccount(
  getStorageAccountResourceName("platform-infra", "platform4pulumi"),
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
    aliases: getLegacyStorageAccountResourceNames("platform4pulumi").map(
      (name) => ({ name }),
    ),
  },
);
