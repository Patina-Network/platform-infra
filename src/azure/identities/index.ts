import * as azure from "@pulumi/azure-native";

import { patinaTestingK8sResourceGroup } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

// TODO: Replace these constants with azuread lookups once the CI principal has
// Microsoft Graph permissions to read directory users.

export const tahmidUserObjectId = "e7b4476c-c01a-4ada-84ae-26b2d0fd3046";
export const henryUserObjectId = "26e110ee-e4ec-4e59-87b4-ffe18222e6c6";

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
