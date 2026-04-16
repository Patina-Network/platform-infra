import type { AzureUserName } from "@/azure/users/inputs";

// This gives you read-only access to the AKS cluster
export const AKS_CLUSTER_READER_USERS = [
  "Arshadul Monir",
  "Ray Zhou",
] as const satisfies AzureUserName[];
