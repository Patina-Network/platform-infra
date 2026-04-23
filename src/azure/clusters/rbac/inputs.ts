import type { AzureIdentityName } from "@/azure/identities";

// This gives you read-only access to the AKS cluster
export const AKS_CLUSTER_READONLY_USERS = [
  "Arshadul Monir",
  "Ray Zhou",
  "Tahmid Ahmed",
] as const satisfies AzureIdentityName[];

// This gives you read-write access to the AKS cluster
export const AKS_CLUSTER_ADMIN_USERS = [
  "Tahmid Ahmed",
] as const satisfies AzureIdentityName[];
