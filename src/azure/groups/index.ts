import * as azure from "@pulumi/azure-native";

import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

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
  },
);
