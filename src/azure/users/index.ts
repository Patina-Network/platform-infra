import * as azuread from "@pulumi/azuread";

import { azureadProvider as provider } from "@/azure/provider";
import { AZURE_USERS } from "@/azure/users/inputs";
import { split } from "@/utils";

const getUserImportId = (objectId: string) => `/users/${objectId}`;
const getUserResourceName = (firstName: string, lastName: string) =>
  `azure-user-${firstName.toLowerCase()}-${lastName.toLowerCase()}`;

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
