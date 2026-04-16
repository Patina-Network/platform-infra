import type { AzureUserName } from "@/azure/users/inputs";

// This gives you read-only access to the AKS cluster
export const AKS_CLUSTER_READER_USERS = [
  "Arshadul Monir",
  "Ray Zhou",
  "Tahmid Ahmed",
] as const satisfies AzureUserName[];

// This gives you read-write access to the AKS cluster
// __NOTE: You must be a reader if you are a writer.__
export const AKS_CLUSTER_WRITER_USERS = [
  "Tahmid Ahmed",
] as const satisfies AzureUserName[];

if (
  AKS_CLUSTER_WRITER_USERS.filter((u) => !AKS_CLUSTER_READER_USERS.includes(u))
    .length !== 0
) {
  throw new Error("All writers must also be readers.");
}
