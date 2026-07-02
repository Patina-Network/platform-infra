import type { AzureIdentityName } from "@/azure/identities";
import type { VaultName } from "@/azure/vaults/inputs";

import { ALL_AZURE_USERS } from "@/azure/rbac";
import { AZURE_KEY_VAULT_ROLES } from "@/azure/vaults/rbac/const";

export type KeyVaultRole = string;

const KEY_VAULT_READER_ROLES = [
  AZURE_KEY_VAULT_ROLES.keyVaultReader,
  AZURE_KEY_VAULT_ROLES.keyVaultSecretsUser,
  AZURE_KEY_VAULT_ROLES.keyVaultCryptoUser,
] as const satisfies readonly KeyVaultRole[];

const KEY_VAULT_ADMIN_ROLES = [
  AZURE_KEY_VAULT_ROLES.keyVaultSecretsOfficer,
  AZURE_KEY_VAULT_ROLES.keyVaultAdministrator,
] as const satisfies readonly KeyVaultRole[];

// give to machine-only readers
const KEY_VAULT_CRYPTO_USER_ROLE = [
  AZURE_KEY_VAULT_ROLES.keyVaultCryptoUser,
] as const satisfies readonly KeyVaultRole[];

export type VaultGroupAccess = {
  kind: "group";
  /**
   * Group display name. Must be globally unique across all.
   */
  name: string;
  members: readonly AzureIdentityName[];
  roles: readonly KeyVaultRole[];
};

/**
 * Grant a set of roles directly to a single identity (typically a service
 * principal such as a workload identity), bypassing group membership.
 */
export type VaultDirectAccess = {
  kind: "direct";
  label: string;
  identity: AzureIdentityName;
  roles: readonly KeyVaultRole[];
};

export type VaultAccess = VaultGroupAccess | VaultDirectAccess;

export const VAULT_ACCESS = {
  "sops-ro": [
    {
      kind: "group",
      name: "sops-ro-readers",
      members: ALL_AZURE_USERS,
      roles: KEY_VAULT_READER_ROLES,
    },
    {
      kind: "group",
      name: "sops-ro-admins",
      members: [],
      roles: KEY_VAULT_ADMIN_ROLES,
    },
  ],
  "sops-master": [
    {
      kind: "group",
      name: "sops-master-readers",
      members: ["Tahmid Ahmed", "Henry Chen", "Andrew Yu", "Arshadul Monir"],
      roles: KEY_VAULT_READER_ROLES,
    },
    {
      kind: "group",
      name: "sops-master-admins",
      members: [],
      roles: KEY_VAULT_ADMIN_ROLES,
    },
    {
      kind: "direct",
      label: "flux-kustomize",
      identity: "kustomize-controller",
      roles: KEY_VAULT_CRYPTO_USER_ROLE,
    },
  ],
  "sops-administrators": [
    {
      kind: "group",
      name: "sops-administrators",
      members: ["Tahmid Ahmed", "Henry Chen"],
      roles: KEY_VAULT_READER_ROLES,
    },
    {
      kind: "direct",
      label: "app",
      identity: "app",
      roles: KEY_VAULT_CRYPTO_USER_ROLE,
    },
  ],
} as const satisfies Record<VaultName, readonly VaultAccess[]>;
