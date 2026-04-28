import type { AzureIdentityName } from "@/azure/identities";

// This gives you read-only access to `sops-master` vault
export const SOPS_VAULT_READONLY_USERS = [
  "Tahmid Ahmed",
  "Henry Chen",
] satisfies AzureIdentityName[];

// This gives you read-write access to `sops-master` vault
export const SOPS_VAULT_ADMIN_USERS = [] as const satisfies AzureIdentityName[];
