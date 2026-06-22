import type { AzureIdentityName } from "@/azure/identities";

import { ALL_AZURE_USERS } from "@/azure/rbac";

// This gives you read-only access to `sops-master` vault
export const SOPS_MASTER_VAULT_READONLY_USERS = [
  "Tahmid Ahmed",
  "Henry Chen",
  "Andrew Yu",
  "Arshadul Monir",
] satisfies AzureIdentityName[];

// This gives you read-write access to `sops-master` vault
export const SOPS_MASTER_VAULT_ADMIN_USERS =
  [] as const satisfies AzureIdentityName[];

// This gives read-only access to `sops-ro` vault
export const SOPS_RO_VAULT_READONLY_USERS =
  ALL_AZURE_USERS satisfies AzureIdentityName[];

// This gives read-write access to `sops-ro` vault
export const SOPS_RO_VAULT_ADMIN_USERS =
  [] as const satisfies AzureIdentityName[];
