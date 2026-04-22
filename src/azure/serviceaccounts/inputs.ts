import { CLUSTERS } from "@/azure/clusters/inputs";

type AzureClusterName = keyof typeof CLUSTERS;

type AzureServiceAccount = {
  clusterName: AzureClusterName;
  namespace: string;
};

// this must match the name of the k8s ServiceAccount object you will create.
type AzureServiceAccountName = string;

// TODO: This only supports k8s service accounts at this time
export const AZURE_SERVICE_ACCOUNTS = {
  "kustomize-controller": {
    clusterName: "k8s-manifests",
    namespace: "flux-system",
  },
  "production-sa": {
    clusterName: "k8s-manifests",
    namespace: "production",
  },
  "staging-sa": {
    clusterName: "k8s-manifests",
    namespace: "staging",
  },
  "infrastructure-sa": {
    clusterName: "k8s-manifests",
    namespace: "infrastructure",
  },
} as const satisfies Record<AzureServiceAccountName, AzureServiceAccount>;
