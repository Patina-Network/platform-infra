import * as azuread from "@pulumi/azuread";

import { AZURE_USERS, type AzureUserName } from "@/azure/users/inputs";
import { split } from "@/utils";

type AzureUserMap = Record<AzureUserName, azuread.User>;

const getUserImportId = (objectId: string) => `/users/${objectId}`;
const fullName = (firstName: string, lastName: string) =>
  `${firstName} ${lastName}`;

export const azureUsers: AzureUserMap = Object.fromEntries(
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
        `azure-user-${fullName(firstName, lastName)}`,
        {
          displayName: fullName(firstName, lastName),
          givenName: firstName,
          mail: user.mail,
          mailNickname: user.mailNickname,
          preferredLanguage: user.preferredLanguage,
          surname: lastName,
          userPrincipalName: user.userPrincipalName,
        },
        {
          import:
            user.bootstrapObjectId ?
              getUserImportId(user.bootstrapObjectId)
            : undefined,
        },
      ),
    ]),
) as AzureUserMap;
