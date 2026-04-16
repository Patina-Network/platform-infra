import * as azure from "@pulumi/azure-native";
import * as azuread from "@pulumi/azuread";

import { DEFAULT_REGION } from "@/azure/inputs";
import { env } from "@/env";

export const provider = new azure.Provider("azure", {
  clientId: env.azure.clientId,
  clientSecret: env.azure.clientSecret,
  location: DEFAULT_REGION,
  subscriptionId: env.azure.subscriptionId,
  tenantId: env.azure.tenantId,
});

export const azureadProvider = new azuread.Provider("azuread", {
  clientId: env.azure.clientId,
  clientSecret: env.azure.clientSecret,
  tenantId: env.azure.tenantId,
});
