import * as azure from "@pulumi/azure-native";

import { azureResourceGroups } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";
import { env } from "@/env";

const getKeyVaultResourceName = (
  resourceGroupName: string,
  vaultName: string,
) => `azure-resource-group-${resourceGroupName}-key-vault-${vaultName}`;

export const sopsRoVault = new azure.keyvault.Vault(
  getKeyVaultResourceName("platform-infra", "sops-ro"),
  {
    vaultName: "sops-ro",
    resourceGroupName: azureResourceGroups["platform-infra"].name,
    location: DEFAULT_REGION,
    properties: {
      tenantId: env.azure.tenantId,
      sku: {
        family: azure.keyvault.SkuFamily.A,
        name: azure.keyvault.SkuName.Standard,
      },
      enableRbacAuthorization: true,
      enableSoftDelete: true,
      enabledForDeployment: false,
      enabledForDiskEncryption: false,
      enabledForTemplateDeployment: false,
      softDeleteRetentionInDays: 90,
      publicNetworkAccess: "Enabled",
      networkAcls: {
        bypass: azure.keyvault.NetworkRuleBypassOptions.None,
        defaultAction: azure.keyvault.NetworkRuleAction.Allow,
        ipRules: [],
        virtualNetworkRules: [],
      },
      accessPolicies: [],
    },
    tags: {},
  },
  { provider },
);

export const sopsMasterVault = new azure.keyvault.Vault(
  getKeyVaultResourceName("platform-infra", "sops-master"),
  {
    vaultName: "sops-master",
    resourceGroupName: azureResourceGroups["platform-infra"].name,
    location: DEFAULT_REGION,
    properties: {
      tenantId: env.azure.tenantId,
      sku: {
        family: azure.keyvault.SkuFamily.A,
        name: azure.keyvault.SkuName.Standard,
      },
      enableRbacAuthorization: true,
      enableSoftDelete: true,
      enabledForDeployment: false,
      enabledForDiskEncryption: false,
      enabledForTemplateDeployment: false,
      softDeleteRetentionInDays: 90,
      publicNetworkAccess: "Enabled",
      networkAcls: {
        bypass: azure.keyvault.NetworkRuleBypassOptions.None,
        defaultAction: azure.keyvault.NetworkRuleAction.Allow,
        ipRules: [],
        virtualNetworkRules: [],
      },
      accessPolicies: [],
    },
    tags: {},
  },
  { provider },
);

export const sopsAdministratorsVault = new azure.keyvault.Vault(
  getKeyVaultResourceName("platform-infra", "sops-administrators"),
  {
    vaultName: "sops-administrators",
    resourceGroupName: azureResourceGroups["platform-infra"].name,
    location: DEFAULT_REGION,
    properties: {
      tenantId: env.azure.tenantId,
      sku: {
        family: azure.keyvault.SkuFamily.A,
        name: azure.keyvault.SkuName.Standard,
      },
      enableRbacAuthorization: true,
      enableSoftDelete: true,
      enabledForDeployment: false,
      enabledForDiskEncryption: false,
      enabledForTemplateDeployment: false,
      softDeleteRetentionInDays: 90,
      publicNetworkAccess: "Enabled",
      networkAcls: {
        bypass: azure.keyvault.NetworkRuleBypassOptions.None,
        defaultAction: azure.keyvault.NetworkRuleAction.Allow,
        ipRules: [],
        virtualNetworkRules: [],
      },
      accessPolicies: [],
    },
    tags: {},
  },
  { provider },
);

export const sopsRoKey = new azure.keyvault.Key(
  "azure-keyvault-sops-ro-key",
  {
    resourceGroupName: azureResourceGroups["platform-infra"].name,
    vaultName: sopsRoVault.name,
    keyName: "sops-ro-key",
    properties: {
      kty: azure.keyvault.JsonWebKeyType.RSA,
      keySize: 4096,
      keyOps: ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
    },
  },
  { provider },
);

export const sopsAdministratorsKey = new azure.keyvault.Key(
  "azure-keyvault-sops-administrators-key",
  {
    resourceGroupName: azureResourceGroups["platform-infra"].name,
    vaultName: sopsAdministratorsVault.name,
    keyName: "sops-administrators-key",
    properties: {
      kty: azure.keyvault.JsonWebKeyType.RSA,
      keySize: 4096,
      keyOps: ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
    },
  },
  { provider },
);
