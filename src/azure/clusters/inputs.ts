import type { ManagedClusterArgs } from "@pulumi/azure-native/containerservice";
import type { PublicIPAddressArgs } from "@pulumi/azure-native/network";
import type { Unwrap } from "@pulumi/pulumi";

import * as azure from "@pulumi/azure-native";

import type { AzureResourceGroupName } from "@/azure/groups/inputs";

import { DEFAULT_REGION } from "@/azure/inputs";

export type VmSize = "Standard_DC2as_v5";

type PoolName = string;

export type OsSku = keyof typeof azure.containerservice.OSSKU;

export type Pool = {
  name: PoolName;
  count: number;
  osDiskSizeGB: number;
  vmSize: VmSize;
  osSku: OsSku;
};

export type Cluster = {
  resourceGroup: AzureResourceGroupName;
  kubernetesVersion: string;
  bootstrap: boolean;
  azureDiskSupport: boolean;
  azureFileSupport: boolean;
  azureSnapshotSupport: boolean;
  systemPools: readonly Pool[];
  userPools: readonly Pool[];
};

type ClusterName = string;

export const CLUSTERS = {
  "k8s-manifests": {
    resourceGroup: "k8s",
    kubernetesVersion: "1.34.4",
    bootstrap: false,
    systemPools: [
      {
        name: "syspoolv3",
        count: 1,
        osDiskSizeGB: 64,
        vmSize: "Standard_DC2as_v5",
        osSku: "AzureLinux3",
      },
    ],
    userPools: [] as Pool[],
    azureDiskSupport: true,
    azureFileSupport: false,
    azureSnapshotSupport: false,
  },
} as const satisfies Record<ClusterName, Cluster>;

type SinglePool = NonNullable<
  Unwrap<ManagedClusterArgs["agentPoolProfiles"]>
>[number];

export const DEFAULT_CLUSTER_POOL_SETTINGS: Omit<
  SinglePool,
  "mode" | "name" | "osSKU"
> = {
  enableAutoScaling: false,
  enableEncryptionAtHost: false,
  enableFIPS: false,
  enableNodePublicIP: false,
  enableUltraSSD: false,
  kubeletDiskType: azure.containerservice.KubeletDiskType.OS,
  maxPods: 250,
  osDiskType: azure.containerservice.OSDiskType.Managed,
  osType: azure.containerservice.OSType.Linux,
  scaleDownMode: azure.containerservice.ScaleDownMode.Delete,
  type: azure.containerservice.AgentPoolType.VirtualMachineScaleSets,
  upgradeSettings: {
    maxSurge: "10%",
    maxUnavailable: "0",
    undrainableNodeBehavior:
      azure.containerservice.UndrainableNodeBehavior.Schedule,
  },
};

export const DEFAULT_CLUSTER_SETTINGS: Omit<
  ManagedClusterArgs,
  "resourceGroupName"
> = {
  location: DEFAULT_REGION,
  disableLocalAccounts: true,
  enableRBAC: true,
  aadProfile: {
    managed: true,
    enableAzureRBAC: true,
  },
  identity: {
    type: azure.containerservice.ResourceIdentityType.SystemAssigned,
  },
  networkProfile: {
    ipFamilies: [azure.containerservice.IpFamily.IPv4],
    loadBalancerProfile: {
      backendPoolType: "nodeIPConfiguration",
      managedOutboundIPs: {
        count: 1,
      },
    },
    loadBalancerSku: "standard",
    networkDataplane: azure.containerservice.NetworkDataplane.Azure,
    networkPlugin: azure.containerservice.NetworkPlugin.Azure,
    networkPluginMode: azure.containerservice.NetworkPluginMode.Overlay,
    networkPolicy: azure.containerservice.NetworkPolicy.None,
    outboundType: azure.containerservice.OutboundType.LoadBalancer,
  },
  oidcIssuerProfile: {
    enabled: true,
  },
  securityProfile: {
    imageCleaner: {
      enabled: true,
      intervalHours: 168,
    },
    workloadIdentity: {
      enabled: true,
    },
  },
  sku: {
    name: azure.containerservice.ManagedClusterSKUName.Base,
    tier: azure.containerservice.ManagedClusterSKUTier.Free,
  },
  supportPlan: azure.containerservice.KubernetesSupportPlan.KubernetesOfficial,
  autoUpgradeProfile: {
    nodeOSUpgradeChannel: azure.containerservice.NodeOSUpgradeChannel.NodeImage,
    upgradeChannel: azure.containerservice.UpgradeChannel.Patch,
  },
};

export const DEFAULT_CLUSTER_PUBLIC_IP_ADDRESS_SETTINGS: Omit<
  PublicIPAddressArgs,
  "resourceGroupName"
> = {
  // TODO: Rename ip resource to not just be named for traefik
  publicIpAddressName: "traefik-public-ip",
  location: DEFAULT_REGION,
  publicIPAllocationMethod: azure.network.IPAllocationMethod.Static,
  publicIPAddressVersion: azure.network.IPVersion.IPv4,
  sku: {
    name: azure.network.PublicIPAddressSkuName.Standard,
    tier: azure.network.PublicIPAddressSkuTier.Regional,
  },
};
