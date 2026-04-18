import * as azure from "@pulumi/azure-native";

import { azureResourceGroupMap } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

export const fluxKustomizeIdentity =
  new azure.managedidentity.UserAssignedIdentity(
    "flux-kustomize-identity",
    {
      location: DEFAULT_REGION,
      resourceGroupName: azureResourceGroupMap.k8s.name,
      resourceName: "flux-kustomize",
    },
    { provider },
  );
