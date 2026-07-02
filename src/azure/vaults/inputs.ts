import type { AzureResourceGroupName } from "@/azure/groups/inputs";

export type VaultKey = {
  keyName: string;
  /** RSA key size in bits. Set to `4096` as a default. */
  keySize: number;
};

export type Vault = {
  /** Azure vault name, also used verbatim in the vault's resource name. */
  vaultName: string;
  /** Resource group the vault lives in. */
  resourceGroup: AzureResourceGroupName;
  /** Crypto key to create in the vault, or `null` for a secrets-only vault. */
  key: VaultKey | null;
};

export const VAULTS = {
  "sops-ro": {
    vaultName: "sops-ro",
    resourceGroup: "platform-infra",
    key: { keyName: "sops-ro-key", keySize: 4096 },
  },
  "sops-master": {
    vaultName: "sops-master",
    resourceGroup: "platform-infra",
    // TODO: import key
    key: null,
  },
  "sops-administrators": {
    vaultName: "sops-administrators",
    resourceGroup: "platform-infra",
    key: { keyName: "sops-administrators-key", keySize: 4096 },
  },
} as const satisfies Record<string, Vault>;

export type VaultName = keyof typeof VAULTS;
