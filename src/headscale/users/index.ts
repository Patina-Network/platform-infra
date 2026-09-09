import * as headscale from "@pulumi/headscale";

import { AZURE_USERS } from "@/azure/users/inputs";
import { provider } from "@/headscale/provider";
import { HEADSCALE_USERS } from "@/headscale/users/inputs";

const getHeadscaleUserResourceName = (mailNickname: string) =>
  `headscale-user-${mailNickname}`;

export const headscaleUsers = Object.fromEntries(
  HEADSCALE_USERS.map((userName) => {
    const user = AZURE_USERS[userName];

    return [
      userName,
      new headscale.User(
        getHeadscaleUserResourceName(user.mailNickname),
        {
          name: user.mailNickname,
          email: user.mail,
          displayName: userName,
        },
        { provider },
      ),
    ] as const;
  }),
);
