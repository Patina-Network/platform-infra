import * as azure from "@pulumi/azure-native";

import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

export const k8sResourceGroup = new azure.resources.ResourceGroup(
  "patina-k8s-resource-group",
  {
    resourceGroupName: "k8s",
    location: DEFAULT_REGION,
    tags: {},
  },
  {
    provider,
  },
);

export const platformInfraResourceGroup = new azure.resources.ResourceGroup(
  "platform-infra-resource-group",
  {
    resourceGroupName: "platform-infra",
    location: DEFAULT_REGION,
    tags: {},
  },
  {
    provider,
  },
);
