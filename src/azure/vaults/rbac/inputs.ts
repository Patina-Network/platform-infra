import type { AzureIdentityName } from "@/azure/identities";

// This gives you read-only access to `sops-master` vault
export const SOPS_MASTER_VAULT_READONLY_USERS = [
  "Tahmid Ahmed",
  "Henry Chen",
  "Haoking Luo",
] satisfies AzureIdentityName[];

// This gives you read-write access to `sops-master` vault
export const SOPS_MASTER_VAULT_ADMIN_USERS =
  [] as const satisfies AzureIdentityName[];

// This gives read-only access to `sops-ro` vault
export const SOPS_RO_VAULT_READONLY_USERS = [
  "Tahmid Ahmed",
  "Henry Chen",
  "Haoking Luo", // add more after onboarding to azure
] satisfies AzureIdentityName[];

// This gives read-write access to `sops-ro` vault
export const SOPS_RO_VAULT_ADMIN_USERS =
  [] as const satisfies AzureIdentityName[];
