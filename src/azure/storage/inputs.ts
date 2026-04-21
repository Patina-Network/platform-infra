import type {
  BlobContainerArgs,
  StorageAccountArgs,
} from "@pulumi/azure-native/storage";

import * as azure from "@pulumi/azure-native";

import type { AzureResourceGroupName } from "@/azure/groups/inputs";

import { DEFAULT_REGION } from "@/azure/inputs";

type StorageAccount = {
  resourceGroupName: AzureResourceGroupName;
  blobs: StorageBlobName[];
};
type StorageAccountName = string;
type StorageBlobName = string;

export const STORAGE_ACCOUNTS = {
  k8sstorage0001: {
    resourceGroupName: "k8s",
    blobs: ["db-backup"],
  },
  platform4pulumi: {
    resourceGroupName: "platform-infra",
    blobs: ["pulumi-state"],
  },
} as const satisfies Record<StorageAccountName, StorageAccount>;

export const DEFAULT_STORAGE_ACCOUNT_SETTINGS: Omit<
  StorageAccountArgs,
  "resourceGroupName"
> = {
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
};

export const DEFAULT_BLOB_CONTAINER_SETTINGS: Omit<
  BlobContainerArgs,
  "accountName" | "resourceGroupName"
> = {
  publicAccess: azure.storage.PublicAccess.None,
};
