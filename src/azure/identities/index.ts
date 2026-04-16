import * as azure from "@pulumi/azure-native";

import { patinaTestingK8sResourceGroup } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

export const fluxKustomizeIdentity =
  new azure.managedidentity.UserAssignedIdentity(
    "flux-kustomize-identity",
    {
      location: DEFAULT_REGION,
      resourceGroupName: patinaTestingK8sResourceGroup.name,
      resourceName: "flux-kustomize",
    },
    { provider },
  );
