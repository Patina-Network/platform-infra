/**
 * Global roles to control access to resources in Azure, using Azure Resource Manager (ARM).
 * https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles
 */
export const AZURE_RBAC_GLOBAL_ROLES = {
  /**
   * Grants full access to manage all resources, including the ability to assign roles in Azure RBAC.
   */
  owner: "8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
  /**
   * Grants full access to manage all resources, but does not allow you to assign roles in Azure RBAC.
   */
  contributor: "b24988ac-6180-42a0-ab88-20f7382dd24c",
  /**
   * Read access to all Azure Resources.
   */
  reader: "acdd72a7-3385-48ef-bd42-f606fba81ae7",
} as const;

export type AzureGlobalRbacRoleName = keyof typeof AZURE_RBAC_GLOBAL_ROLES;
