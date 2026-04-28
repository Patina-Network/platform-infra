export const AZURE_KEY_VAULT_ROLES = {
  /**
   * Key Vault Reader
   *
   * Read metadata of key vaults and certificates, keys, and secrets.
   */
  keyVaultReader: "21090545-7ca7-4776-b22c-e363652d74d2",

  /**
   * Key Vault Secrets User
   *
   * Read secret contents from a key vault that uses Azure RBAC.
   */
  keyVaultSecretsUser: "4633458b-17de-408a-b874-0445c86b69e6",

  /**
   * Key Vault Secrets Officer
   *
   * Perform any action on secrets, except managing permissions.
   */
  keyVaultSecretsOfficer: "b86a8fe4-44ce-4948-aee5-eccb2c155cd7",

  /**
   * Key Vault Administrator
   *
   * Perform all data plane operations on a key vault and all objects in it,
   * including certificates, keys, and secrets.
   */
  keyVaultAdministrator: "00482a5a-887f-4fb3-b363-3b7fe8e74483",

  /**
   * Key Vault Crypto User
   *
   * Perform cryptographic operations using keys. Only works for key vaults that use the 'Azure role-based access control' permission model.
   */
  keyVaultCryptoUser: "12338af0-0e69-4776-bea7-57ae8d297424",
} as const;
