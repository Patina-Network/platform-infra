import * as azure from "@pulumi/azure-native";

import {
  CLUSTERS,
  DEFAULT_CLUSTER_POOL_SETTINGS,
  DEFAULT_CLUSTER_PUBLIC_IP_ADDRESS_SETTINGS,
  DEFAULT_CLUSTER_SETTINGS,
  type Pool,
} from "@/azure/clusters/inputs";
import { azureResourceGroups } from "@/azure/groups";
import { provider } from "@/azure/provider";

const getManagedClusterResourceName = (resourceGroupName: string, clusterName: string) =>
  `azure-resource-group-${resourceGroupName}-managed-cluster-${clusterName}`;

const getManagedClusterPublicIpResourceName = (clusterName: string, publicIpName: string) =>
  `azure-managed-cluster-${clusterName}-public-ip-${publicIpName}`;

const getAgentPoolResourceName = (clusterName: string, poolName: string) =>
  `azure-managed-cluster-${clusterName}-agent-pool-${poolName}`;

export const azureClusters = Object.fromEntries(
  Object.entries(CLUSTERS).map(([clusterName, clusterProps]) => {
    return [
      clusterName,
      new azure.containerservice.ManagedCluster(
        getManagedClusterResourceName(clusterProps.resourceGroup, clusterName),
        {
          ...DEFAULT_CLUSTER_SETTINGS,
          resourceName: clusterName,
          dnsPrefix: `${clusterName}-dns`,
          resourceGroupName: azureResourceGroups[clusterProps.resourceGroup].name,
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
          agentPoolProfiles:
            // azure terraform + API interaction sucks butt
            // this angent pool array is required for init,
            // but after init, its literally ignored.
            // hence the bootstrapping.
            clusterProps.bootstrap
              ? [
                  {
                    ...DEFAULT_CLUSTER_POOL_SETTINGS,
                    name: clusterProps.systemPools[0].name,
                    mode: azure.containerservice.AgentPoolMode.System,
                    count: clusterProps.systemPools[0].count,
                    osDiskSizeGB: clusterProps.systemPools[0].osDiskSizeGB,
                    osDiskType: clusterProps.systemPools[0].osDiskType,
                    vmSize: clusterProps.systemPools[0].vmSize,
                  },
                ]
              : [],
        },
        { provider },
      ),
    ];
  }),
);

export const azureClusterAgentPools = Object.fromEntries(
  Object.entries(CLUSTERS).flatMap(([clusterName, clusterProps]) => {
    const systemPools = clusterProps.bootstrap
      ? (clusterProps.systemPools as readonly Pool[]).slice(1)
      : clusterProps.systemPools;

    const pools = [
      ...systemPools.map((pool) => ({
        ...pool,
        mode: azure.containerservice.AgentPoolMode.System,
      })),
      ...clusterProps.userPools.map((pool) => ({
        ...pool,
        mode: azure.containerservice.AgentPoolMode.User,
      })),
    ];

    return pools.map(
      (pool) =>
        [
          `${clusterName}-${pool.name}`,
          new azure.containerservice.AgentPool(
            getAgentPoolResourceName(clusterName, pool.name),
            {
              ...DEFAULT_CLUSTER_POOL_SETTINGS,
              resourceGroupName: azureResourceGroups[clusterProps.resourceGroup].name,
              resourceName: azureClusters[clusterName].name,
              agentPoolName: pool.name,
              mode: pool.mode,
              count: pool.count,
              osDiskSizeGB: pool.osDiskSizeGB,
              osDiskType: pool.osDiskType,
              osSKU: pool.osSku,
              vmSize: pool.vmSize,
              nodeTaints: pool.nodeTaints.length > 0 ? [...pool.nodeTaints] : undefined,
              ...(pool.spot
                ? {
                    scaleSetPriority: azure.containerservice.ScaleSetPriority.Spot,
                    scaleSetEvictionPolicy: azure.containerservice.ScaleSetEvictionPolicy.Delete,
                    spotMaxPrice: pool.spot.maxPrice,
                    // AKS rejects maxSurge on spot pools.
                    upgradeSettings: undefined,
                    // Evicted nodes are deleted; the autoscaler recreates them back up to `count`.
                    enableAutoScaling: true,
                    minCount: pool.count,
                    maxCount: pool.count,
                  }
                : {}),
            },
            {
              provider,
              dependsOn: [azureClusters[clusterName]],
            },
          ),
        ] as const,
    );
  }),
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
