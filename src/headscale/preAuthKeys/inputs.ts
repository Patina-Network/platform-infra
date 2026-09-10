import type { MachineUserName } from "@/headscale/users/inputs";

type PreAuthKeyName = string;

type PreAuthKey = {
  user: MachineUserName;
  reusable: boolean;
  timeToExpire: string;
  // bump to re-generate key
  generation: number;
};

export const PRE_AUTH_KEYS = {
  "proxy-infra": {
    user: "proxy-infra",
    reusable: true,
    timeToExpire: "1y",
    generation: 1,
  },
} as const satisfies Record<PreAuthKeyName, PreAuthKey>;
