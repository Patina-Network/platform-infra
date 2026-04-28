import type { AzureIdentityName } from "@/azure/identities";

import { ALL_AZURE_USERS } from "@/azure/rbac";

// This gives you read-only access to the AKS cluster
export const AKS_CLUSTER_READONLY_USERS =
  ALL_AZURE_USERS satisfies AzureIdentityName[];

// This gives you read-write access to the AKS cluster
export const AKS_CLUSTER_ADMIN_USERS = [
  "Tahmid Ahmed",
] as const satisfies AzureIdentityName[];
