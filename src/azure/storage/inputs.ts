import type {
  BlobContainerArgs,
  StorageAccountArgs,
} from "@pulumi/azure-native/storage";

import * as azure from "@pulumi/azure-native";

import type { AzureResourceGroupName } from "@/azure/groups/inputs";

import { DEFAULT_REGION } from "@/azure/inputs";

export type StorageAccount = {
  resourceGroupName: AzureResourceGroupName;
  blobs: {
    name: StorageBlobName;
    /** ONLY SUPPORTS DAYS */
    ttl?: Temporal.Duration;
  }[];
};
type StorageAccountName = string;
type StorageBlobName = string;

export const STORAGE_ACCOUNTS = {
  infrastructure4k8s: {
    resourceGroupName: "k8s",
    blobs: [
      {
        name: "db-backup",
        ttl: Temporal.Duration.from({ days: 30 }),
      },
    ],
  },
  platform4pulumi: {
    resourceGroupName: "platform-infra",
    blobs: [
      {
        name: "pulumi-state",
        ttl: undefined,
      },
    ],
  },
} as const satisfies Record<StorageAccountName, StorageAccount>;

export type AzureStorageAccountName = keyof typeof STORAGE_ACCOUNTS;

// TODO: Find a better solution
export type AzureStorageAccountNameWithTtl = {
  [K in keyof typeof STORAGE_ACCOUNTS]: Exclude<
    (typeof STORAGE_ACCOUNTS)[K]["blobs"][number]["ttl"],
    undefined
  > extends never ?
    never
  : K;
}[keyof typeof STORAGE_ACCOUNTS];

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
  allowSharedKeyAccess: false,
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
