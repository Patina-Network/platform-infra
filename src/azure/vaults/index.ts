import * as azure from "@pulumi/azure-native";

import { provider } from "@/azure/provider";

export const sopsMasterVault = azure.keyvault.Vault.get(
  "sops-master-vault",
  "/subscriptions/7779681e-36d2-4f42-9289-8160bd1a407d/resourceGroups/PatinaTesting/providers/Microsoft.KeyVault/vaults/sops-master",
  { provider },
);
