import type { AzureUserName } from "@/azure/users/inputs";

import { ALL_AZURE_USERS } from "@/azure/rbac";

// block access here
const BLOCKED_USERS: ReadonlySet<AzureUserName> = new Set([]);

// users must be part of Azure tenant first
export const HEADSCALE_USERS: readonly AzureUserName[] = ALL_AZURE_USERS.filter(
  (u) => !BLOCKED_USERS.has(u),
);
