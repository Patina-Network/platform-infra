import * as azuread from "@pulumi/azuread";

import { azureadProvider as provider } from "@/azure/provider";
import {
  AZURE_GLOBAL_ENTRA_ROLES,
  type AzureGlobalEntraRoleName,
} from "@/azure/users/const";
import { AZURE_USERS } from "@/azure/users/inputs";
import { split } from "@/utils";

const getUserImportId = (objectId: string) => `/users/${objectId}`;
const getUserResourceName = (firstName: string, lastName: string) =>
  `azure-user-${firstName.toLowerCase()}-${lastName.toLowerCase()}`;

const getDirectoryRoleResourceName = (roleName: AzureGlobalEntraRoleName) =>
  `azure-directory-role-${roleName}`;

const getDirectoryRoleAssignmentResourceName = (
  mailNickname: string,
  globalRole: AzureGlobalEntraRoleName,
) => `azure-directory-role-assignment-${mailNickname}-${globalRole}`;

const fullName = <FS extends string, LS extends string>(
  firstName: FS,
  lastName: LS,
): `${FS} ${LS}` => `${firstName} ${lastName}`;

export const azureUsers = Object.fromEntries(
  Object.entries(AZURE_USERS)
    .map(
      ([fullName, _]) =>
        [
          {
            firstName: split(fullName, " ")[0],
            lastName: split(fullName, " ")[1],
          },
          _,
        ] as const,
    )
    .map(([{ firstName, lastName }, user]) => [
      fullName(firstName, lastName),
      new azuread.User(
        getUserResourceName(firstName, lastName),
        {
          displayName: fullName(firstName, lastName),
          givenName: firstName,
          mail: user.mail,
          mailNickname: user.mailNickname,
          surname: lastName,
          userPrincipalName: user.userPrincipalName,
        },
        {
          provider,
          ignoreChanges: [
            "forcePasswordChange",
            "otherMails",
            "usageLocation",
            "preferredLanguage",
          ],
          import:
            user.bootstrapObjectId ?
              getUserImportId(user.bootstrapObjectId)
            : undefined,
        },
      ),
    ]),
);

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
