import * as azure from "@pulumi/azure-native";

import { platformInfraResourceGroup } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";
import { env } from "@/env";

export const sopsMasterVault = new azure.keyvault.Vault(
  "sops-master-vault",
  {
    vaultName: "sops-master",
    resourceGroupName: platformInfraResourceGroup.name,
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
  {
    provider,
    import:
      "/subscriptions/7779681e-36d2-4f42-9289-8160bd1a407d/resourceGroups/platform-infra/providers/Microsoft.KeyVault/vaults/sops-master",
  },
);
