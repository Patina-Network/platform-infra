import type { AzureUserName } from "@/azure/users/inputs";

import { ALL_AZURE_USERS } from "@/azure/rbac";

// block access here
const BLOCKED_USERS: ReadonlySet<AzureUserName> = new Set([]);

// users must be part of Azure tenant first
export const HEADSCALE_USERS: readonly AzureUserName[] = ALL_AZURE_USERS.filter(
  (u) => !BLOCKED_USERS.has(u),
);

type MachineUserFullName = string;

type MachineUser = {
  name: string;
};

// non-human headscale users, e.g. for automated usages
export const MACHINE_USERS = {
  "vpn-infra": {
    name: "vpn-infra",
  },
  "global-cicd": {
    name: "global-cicd",
  },
} as const satisfies Record<MachineUserFullName, MachineUser>;

export type MachineUserName = keyof typeof MACHINE_USERS;
