import * as azure from "@pulumi/azure-native";

import { azureResourceGroups } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";
import { VAULTS } from "@/azure/vaults/inputs";
import { env } from "@/env";

const getKeyVaultResourceName = (
  resourceGroupName: string,
  vaultName: string,
) => `azure-resource-group-${resourceGroupName}-key-vault-${vaultName}`;

const getKeyVaultKeyResourceName = (keyName: string) =>
  `azure-keyvault-${keyName}`;

export const azureVaults = Object.fromEntries(
  Object.entries(VAULTS).map(
    ([vaultKey, vault]) =>
      [
        vaultKey,
        new azure.keyvault.Vault(
          getKeyVaultResourceName(vault.resourceGroup, vault.vaultName),
          {
            vaultName: vault.vaultName,
            resourceGroupName: azureResourceGroups[vault.resourceGroup].name,
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
        ),
      ] as const,
  ),
);

export const azureVaultKeys = Object.fromEntries(
  Object.entries(VAULTS).flatMap(([vaultKey, vault]) => {
    const { key } = vault;
    if (key === null) return [];

    return [
      [
        vaultKey,
        new azure.keyvault.Key(
          getKeyVaultKeyResourceName(key.keyName),
          {
            resourceGroupName: azureResourceGroups[vault.resourceGroup].name,
            vaultName: azureVaults[vaultKey].name,
            keyName: key.keyName,
            properties: {
              kty: azure.keyvault.JsonWebKeyType.RSA,
              keySize: key.keySize,
              keyOps: ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
            },
          },
          { provider },
        ),
      ] as const,
    ];
  }),
);
