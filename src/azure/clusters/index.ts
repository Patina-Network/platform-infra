import * as azure from "@pulumi/azure-native";

import {
  CLUSTERS,
  DEFAULT_CLUSTER_PUBLIC_IP_ADDRESS_SETTINGS,
  DEFAULT_CLUSTER_SETTINGS,
  DEFAULT_CLUSTER_SYSPOOL_SETTINGS,
} from "@/azure/clusters/inputs";
import { azureResourceGroupMap } from "@/azure/groups";
import { provider } from "@/azure/provider";

const getManagedClusterResourceName = (
  resourceGroupName: string,
  clusterName: string,
) => `azure-resource-group-${resourceGroupName}-managed-cluster-${clusterName}`;

const getManagedClusterPublicIpResourceName = (
  clusterName: string,
  publicIpName: string,
) => `azure-managed-cluster-${clusterName}-public-ip-${publicIpName}`;

export const azureClusters = Object.fromEntries(
  Object.entries(CLUSTERS).map(([clusterName, clusterProps]) => [
    clusterName,
    new azure.containerservice.ManagedCluster(
      getManagedClusterResourceName(clusterProps.resourceGroup, clusterName),
      {
        ...DEFAULT_CLUSTER_SETTINGS,
        resourceName: clusterName,
        dnsPrefix: `${clusterName}-dns`,
        resourceGroupName:
          azureResourceGroupMap[clusterProps.resourceGroup].name,
        kubernetesVersion: clusterProps.kubernetesVersion,
        storageProfile: {
          diskCSIDriver: {
            enabled: clusterProps.azureDiskSupport,
          },
          fileCSIDriver: {
            enabled: clusterProps.azureFileSupport,
          },
          snapshotController: {
            enabled: clusterProps.azureSnapshotSupport,
          },
        },
        agentPoolProfiles: [
          {
            ...DEFAULT_CLUSTER_SYSPOOL_SETTINGS,
            count: clusterProps.systemPool.count,
            osDiskSizeGB: clusterProps.systemPool.osDiskSizeGB,
            vmSize: clusterProps.systemPool.vmSize,
          },
        ],
      },
      { provider },
    ),
  ]),
);

export const azureClusterPublicIpAddresses = Object.fromEntries(
  Object.entries(CLUSTERS).map(([clusterName, _]) => [
    clusterName,
    new azure.network.PublicIPAddress(
      getManagedClusterPublicIpResourceName(clusterName, "traefik"),
      {
        // TODO: Rename ip resource to not just be named for traefik
        ...DEFAULT_CLUSTER_PUBLIC_IP_ADDRESS_SETTINGS,
        resourceGroupName: azureClusters[clusterName].nodeResourceGroup.apply(
          (nodeResourceGroup) => nodeResourceGroup ?? "",
        ),
      },
      { provider },
    ),
  ]),
);
