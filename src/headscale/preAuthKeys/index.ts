import * as headscale from "@pulumi/headscale";
import * as pulumi from "@pulumi/pulumi";

import { PRE_AUTH_KEYS } from "@/headscale/preAuthKeys/inputs";
import { provider } from "@/headscale/provider";
import { headscaleMachineUsers } from "@/headscale/users";

const getHeadscalePreAuthKeyResourceName = (
  keyName: string,
  generation: number,
) => `headscale-preauth-key-${keyName}-v${generation}`;

export const headscalePreAuthKeys = Object.fromEntries(
  Object.entries(PRE_AUTH_KEYS).map(
    ([keyName, keyProps]) =>
      [
        keyName,
        new headscale.PreAuthKey(
          getHeadscalePreAuthKeyResourceName(keyName, keyProps.generation),
          {
            user: headscaleMachineUsers[keyName].id,
            reusable: keyProps.reusable,
            timeToExpire: keyProps.timeToExpire,
          },
          { provider },
        ),
      ] as const,
  ),
);

// so we can read output in pulumi state
export const headscalePreAuthKeysPlaintext = pulumi.secret(
  Object.fromEntries(
    Object.entries(PRE_AUTH_KEYS).map(([keyName]) => [
      keyName,
      headscalePreAuthKeys[keyName].key,
    ]),
  ),
);
