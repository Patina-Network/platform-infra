import * as azuread from "@pulumi/azuread";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";

import { azureadProvider as provider } from "@/azure/provider";
import { AZURE_USERS } from "@/azure/users/inputs";
import { split } from "@/utils";

const getUserResourceName = (firstName: string, lastName: string) =>
  `azure-user-${firstName.toLowerCase()}-${lastName.toLowerCase()}`;

const fullName = <FS extends string, LS extends string>(
  firstName: FS,
  lastName: LS,
): `${FS} ${LS}` => `${firstName} ${lastName}`;

export const azureInitPws = Object.fromEntries(
  Object.entries(AZURE_USERS)
    .map(
      ([fullName, u]) =>
        [
          {
            firstName: split(fullName, " ")[0],
            lastName: split(fullName, " ")[1],
          },
          u,
        ] as const,
    )
    .map(([{ firstName, lastName }, user]) => {
      const pw = (() => {
        if (user.newUser) {
          return new random.RandomPassword(
            `azure-user-init-pw-${firstName}-${lastName}`,
            {
              length: 20,
              special: true,
            },
          );
        }

        return null;
      })();

      return [user.mail, pw];
    }),
);

// so we can read output in pulumi state
export const azureInitPwsPlaintext = pulumi.secret(
  Object.fromEntries(
    Object.entries(AZURE_USERS).map(([_, user]) => [
      user.mail,
      azureInitPws[user.mail]?.result,
    ]),
  ),
);

export const azureUsers = Object.fromEntries(
  Object.entries(AZURE_USERS)
    .map(
      ([fullName, u]) =>
        [
          {
            firstName: split(fullName, " ")[0],
            lastName: split(fullName, " ")[1],
          },
          u,
        ] as const,
    )
    .map(([{ firstName, lastName }, user]) => {
      const _fullName = fullName(firstName, lastName);

      const pw = azureInitPws[user.mail];

      return [
        _fullName,
        new azuread.User(
          getUserResourceName(firstName, lastName),
          {
            displayName: _fullName,
            givenName: firstName,
            mail: user.mail,
            mailNickname: user.mailNickname,
            surname: lastName,
            userPrincipalName: user.userPrincipalName,
            password: pw?.result ?? undefined,
            forcePasswordChange: user.newUser ? true : undefined,
          },
          {
            provider,
            ignoreChanges: [
              "password",
              "forcePasswordChange",
              "otherMails",
              "usageLocation",
              "preferredLanguage",
            ],
          },
        ),
      ];
    }),
);
