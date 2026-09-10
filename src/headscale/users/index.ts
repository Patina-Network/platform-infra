import * as headscale from "@pulumi/headscale";

import { provider } from "@/headscale/provider";
import { MACHINE_USERS } from "@/headscale/users/inputs";

const getHeadscaleMachineUserResourceName = (name: string) =>
  `headscale-machine-user-${name}`;

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
