import * as azure from "@pulumi/azure-native";

import { RESOURCE_GROUPS } from "@/azure/groups/inputs";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

const getResourceGroupName = (resourceGroupName: string) =>
  `azure-resource-group-${resourceGroupName}`;

const getLegacyResourceGroupName = (resourceGroupName: string) =>
  `${resourceGroupName}-resource-group`;

export const azureResourceGroupMap = Object.fromEntries(
  Object.entries(RESOURCE_GROUPS).map(
    ([resourceGroupName, resourceGroupProperties]) => [
      resourceGroupName,
      new azure.resources.ResourceGroup(
        getResourceGroupName(resourceGroupName),
        {
          resourceGroupName,
          location: DEFAULT_REGION,
          tags: resourceGroupProperties.tags,
        },
        {
          aliases: [{ name: getLegacyResourceGroupName(resourceGroupName) }],
          provider,
        },
      ),
    ],
  ),
);
