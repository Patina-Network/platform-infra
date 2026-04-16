import * as azure from "@pulumi/azure-native";

import { k8sResourceGroup } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";

export const k8sManifestsCluster = new azure.containerservice.ManagedCluster(
  "k8s-manifests-cluster",
  {
    resourceGroupName: k8sResourceGroup.name,
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
  { provider },
);

export const traefikPublicIp = new azure.network.PublicIPAddress(
  "traefik-public-ip",
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
  { provider },
);
