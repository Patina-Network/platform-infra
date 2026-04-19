import * as azure from "@pulumi/azure-native";

import { azureResourceGroupMap } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

const getManagedClusterResourceName = (
  resourceGroupName: string,
  clusterName: string,
) => `azure-resource-group-${resourceGroupName}-managed-cluster-${clusterName}`;

const getManagedClusterPublicIpResourceName = (
  clusterName: string,
  publicIpName: string,
) => `azure-managed-cluster-${clusterName}-public-ip-${publicIpName}`;

export const k8sManifestsCluster = new azure.containerservice.ManagedCluster(
  getManagedClusterResourceName("k8s", "k8s-manifests"),
  {
    resourceGroupName: azureResourceGroupMap.k8s.name,
    resourceName: "k8s-manifests",
    location: DEFAULT_REGION,
    dnsPrefix: "k8s-manifests-dns",
    disableLocalAccounts: true,
    enableRBAC: true,
    aadProfile: {
      managed: true,
      enableAzureRBAC: true,
    },
    identity: {
      type: azure.containerservice.ResourceIdentityType.SystemAssigned,
    },
    kubernetesVersion: "1.34.4",
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
    storageProfile: {
      diskCSIDriver: {
        enabled: true,
      },
      fileCSIDriver: {
        enabled: false,
      },
      snapshotController: {
        enabled: false,
      },
    },
    supportPlan:
      azure.containerservice.KubernetesSupportPlan.KubernetesOfficial,
    autoUpgradeProfile: {
      nodeOSUpgradeChannel:
        azure.containerservice.NodeOSUpgradeChannel.NodeImage,
      upgradeChannel: azure.containerservice.UpgradeChannel.Patch,
    },
    agentPoolProfiles: [
      {
        count: 1,
        enableAutoScaling: false,
        enableEncryptionAtHost: false,
        enableFIPS: false,
        enableNodePublicIP: false,
        enableUltraSSD: false,
        kubeletDiskType: azure.containerservice.KubeletDiskType.OS,
        maxPods: 250,
        mode: azure.containerservice.AgentPoolMode.System,
        name: "syspool",
        osDiskSizeGB: 128,
        osDiskType: azure.containerservice.OSDiskType.Managed,
        osSKU: azure.containerservice.OSSKU.Ubuntu,
        osType: azure.containerservice.OSType.Linux,
        scaleDownMode: azure.containerservice.ScaleDownMode.Delete,
        type: azure.containerservice.AgentPoolType.VirtualMachineScaleSets,
        upgradeSettings: {
          maxSurge: "10%",
          maxUnavailable: "0",
          undrainableNodeBehavior:
            azure.containerservice.UndrainableNodeBehavior.Schedule,
        },
        vmSize: "Standard_DC2as_v5",
      },
    ],
  },
  {
    provider,
    aliases: [{ name: "k8s-manifests-cluster" }],
  },
);

export const traefikPublicIp = new azure.network.PublicIPAddress(
  getManagedClusterPublicIpResourceName("k8s-manifests", "traefik"),
  {
    publicIpAddressName: "traefik-public-ip",
    resourceGroupName: k8sManifestsCluster.nodeResourceGroup.apply(
      (nodeResourceGroup) => nodeResourceGroup ?? "",
    ),
    location: DEFAULT_REGION,
    publicIPAllocationMethod: azure.network.IPAllocationMethod.Static,
    publicIPAddressVersion: azure.network.IPVersion.IPv4,
    sku: {
      name: azure.network.PublicIPAddressSkuName.Standard,
      tier: azure.network.PublicIPAddressSkuTier.Regional,
    },
  },
  {
    provider,
    aliases: [{ name: "traefik-public-ip" }],
  },
);
