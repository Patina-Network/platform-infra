import * as headscale from "@pulumi/headscale";

import { AZURE_USERS } from "@/azure/users/inputs";
import { provider } from "@/headscale/provider";
import { HEADSCALE_USERS, MACHINE_USERS } from "@/headscale/users/inputs";

const getHeadscaleUserResourceName = (mailNickname: string) =>
  `headscale-user-${mailNickname}`;

const getHeadscaleMachineUserResourceName = (name: string) =>
  `headscale-machine-user-${name}`;

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

export const headscaleMachineUsers = Object.fromEntries(
  Object.entries(MACHINE_USERS).map(
    ([userName, machineUser]) =>
      [
        userName,
        new headscale.User(
          getHeadscaleMachineUserResourceName(machineUser.name),
          {
            name: machineUser.name,
            forceDelete: true,
          },
          { provider },
        ),
      ] as const,
  ),
);
