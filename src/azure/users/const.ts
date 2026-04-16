/**
 * Go-to source to see descriptions of each role.
 */
export const AZURE_GLOBAL_ENTRA_ROLES = {
  /**
   * Can manage all aspects of Microsoft Entra ID and Microsoft services that use Microsoft Entra identities.
   */
  globalAdministrator: "62e90394-69f5-4237-9190-012177145e10",
  /**
   * Can read everything that a Global Administrator can, but not update anything.
   */
  globalReader: "f2ef992c-3afb-46b9-b7cf-a126ee74c451",
  /**
   * Can manage all aspects of users and groups, including resetting passwords for limited admins.
   */
  userAdministrator: "fe930be7-5e62-47db-91af-98c3a49a38b1",
} as const;

export type AzureGlobalEntraRoleName = keyof typeof AZURE_GLOBAL_ENTRA_ROLES;
