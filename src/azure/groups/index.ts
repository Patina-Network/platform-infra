import * as azure from "@pulumi/azure-native";

import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

export const patinaTestingResourceGroup = new azure.resources.ResourceGroup(
  "patina-testing-resource-group",
  {
    resourceGroupName: "PatinaTesting",
    location: DEFAULT_REGION,
    tags: {},
  },
  {
    provider,
  },
);

export const patinaTestingK8sResourceGroup = new azure.resources.ResourceGroup(
  "patina-testing-k8s-resource-group",
  {
    resourceGroupName: "PatinaTestingK8s",
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
    import:
      "/subscriptions/7779681e-36d2-4f42-9289-8160bd1a407d/resourceGroups/platform-infra",
  },
);
