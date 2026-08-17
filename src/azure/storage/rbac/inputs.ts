import type { AzureIdentityName } from "@/azure/identities";
import type { AzureStorageAccountName } from "@/azure/storage/inputs";

// This gives you read-only access to the storage accounts' blob data.
export const STORAGE_ACCOUNT_READERS = {
  infrastructure4k8s: ["Tahmid Ahmed"],
  platform4pulumi: ["Tahmid Ahmed", "Henry Chen", "Arshadul Monir", "app"],
} as const satisfies Record<
  AzureStorageAccountName,
  readonly AzureIdentityName[]
>;

// This gives you read-write access to the storage accounts' blob data.
export const STORAGE_ACCOUNT_WRITERS = {
  infrastructure4k8s: ["infrastructure-sa"],
  platform4pulumi: ["Tahmid Ahmed", "app"],
} as const satisfies Record<
  AzureStorageAccountName,
  readonly AzureIdentityName[]
>;
