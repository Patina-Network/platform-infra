import * as azuread from "@pulumi/azuread";

import { azureadProvider as provider } from "@/azure/provider";
import { azureUsers } from "@/azure/users";
import {
  AZURE_GLOBAL_ENTRA_ROLES,
  type AzureGlobalEntraRoleName,
} from "@/azure/users/entra/const";
import { AZURE_USERS } from "@/azure/users/inputs";

/**
 * Manages permissions handled by Microsoft Entra ID.
 *
 * Context:
 * There's two parallel permissioning systems in Microsoft, Azure Resource Manager (ARM) for Azure perms, and Entra ID
 * for everything outside of Azure. Entra ID was formerly known as Azure Active Directory (AAD or AzureAD)
 *
 * This file is for setting up roles in Entra ID.
 */

const getDirectoryRoleResourceName = (roleName: AzureGlobalEntraRoleName) =>
  `azure-directory-role-${roleName}`;

const getDirectoryRoleAssignmentResourceName = (
  mailNickname: string,
  globalRole: AzureGlobalEntraRoleName,
) => `azure-directory-role-assignment-${mailNickname}-${globalRole}`;

/**
 * Creates a Directory Role within Azure Active Directory. Directory Roles are also known as Administrator Roles.
 * Directory Roles are built-in to Azure Active Directory and are immutable.
 * However, by default they are not activated in a tenant (except for the Global Administrator role).
 * This resource ensures a directory role is activated from its associated role template, and exports the object ID of the role, so that role assignments can be made for it.
 */
export const azureEntraRoles: Record<
  AzureGlobalEntraRoleName,
  azuread.DirectoryRole
> = Object.fromEntries(
  (Object.keys(AZURE_GLOBAL_ENTRA_ROLES) as AzureGlobalEntraRoleName[]).map(
    (roleName) => [
      roleName,
      new azuread.DirectoryRole(
        getDirectoryRoleResourceName(roleName),
        {
          templateId: AZURE_GLOBAL_ENTRA_ROLES[roleName],
        },
        {
          provider,
        },
      ),
    ],
  ),
);

/**
 * Assigns Entra roles to Users through Azure Active Directory (azuread)
 */
export const azureUserGlobalRoleAssignments = Object.entries(
  AZURE_USERS,
).flatMap(([userFullName, user]) =>
  user.entraRoles.map((globalRole) => {
    return new azuread.DirectoryRoleAssignment(
      getDirectoryRoleAssignmentResourceName(user.mailNickname, globalRole),
      {
        directoryScopeId: "/",
        principalObjectId: azureUsers[userFullName].objectId,
        roleId: azureEntraRoles[globalRole].templateId,
      },
      { provider },
    );
  }),
);
