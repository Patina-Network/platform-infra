import * as azure from "@pulumi/azure-native";

import { DEFAULT_REGION } from "@/azure/inputs";

export const provider = new azure.Provider("azure", {
  location: DEFAULT_REGION,
});
