import type { AzureStorageAccountName } from "@/azure/storage/inputs";
import type { AzureUserName } from "@/azure/users/inputs";

export type StorageRbacPrincipal = AzureUserName | "app";

// This gives you read-only access to the storage accounts' blob data.
export const STORAGE_ACCOUNT_READERS = {
  k8sstorage0001: ["Tahmid Ahmed"],
  platform4pulumi: ["Tahmid Ahmed", "app"],
} as const satisfies Record<
  AzureStorageAccountName,
  readonly StorageRbacPrincipal[]
>;

// This gives you read-write access to the storage accounts' blob data.
export const STORAGE_ACCOUNT_WRITERS = {
  k8sstorage0001: ["Tahmid Ahmed"],
  platform4pulumi: ["Tahmid Ahmed", "app"],
} as const satisfies Record<
  AzureStorageAccountName,
  readonly StorageRbacPrincipal[]
>;
