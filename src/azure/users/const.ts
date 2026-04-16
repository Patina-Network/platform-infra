export const AZURE_GLOBAL_ROLE_IDS = {
  globalAdministrator: "62e90394-69f5-4237-9190-012177145e10",
  globalReader: "f2ef992c-3afb-46b9-b7cf-a126ee74c451",
  userAdministrator: "fe930be7-5e62-47db-91af-98c3a49a38b1",
} as const;

export type AzureGlobalRoleName = keyof typeof AZURE_GLOBAL_ROLE_IDS;
