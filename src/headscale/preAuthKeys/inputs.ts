import type { MachineUserName } from "@/headscale/users/inputs";

type PreAuthKeyName = MachineUserName;

type PreAuthKey = {
  reusable: boolean;
  timeToExpire: string;
  // bump to re-generate key
  generation: number;
};

export const PRE_AUTH_KEYS = {
  "vpn-infra": {
    reusable: true,
    timeToExpire: "1y",
    generation: 1,
  },
} as const satisfies Record<PreAuthKeyName, PreAuthKey>;
