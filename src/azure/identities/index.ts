import * as azure from "@pulumi/azure-native";

import { azureResourceGroupMap } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

const getUserAssignedIdentityResourceName = (
  resourceGroupName: string,
  identityName: string,
) =>
  `azure-resource-group-${resourceGroupName}-user-assigned-identity-${identityName}`;

export const fluxKustomizeIdentity =
  new azure.managedidentity.UserAssignedIdentity(
    getUserAssignedIdentityResourceName("k8s", "flux-kustomize"),
    {
      location: DEFAULT_REGION,
      resourceGroupName: azureResourceGroupMap.k8s.name,
      resourceName: "flux-kustomize",
    },
    { provider },
  );
