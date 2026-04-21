import * as azure from "@pulumi/azure-native";

import { azureResourceGroups } from "@/azure/groups";
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
      resourceGroupName: azureResourceGroups.k8s.name,
      resourceName: "flux-kustomize",
    },
    { provider },
  );
