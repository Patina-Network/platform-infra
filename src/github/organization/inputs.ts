import type { OrganizationSettingsArgs } from "@pulumi/github";

export const ORGANIZATION_SETTINGS = {
  name: "Patina Network",
  billingEmail: "henry@patinanetwork.org",
  membersCanCreateRepositories: false,
  membersCanCreatePublicRepositories: false,
  membersCanCreatePages: false,
  membersCanCreatePrivatePages: false,
  membersCanCreatePrivateRepositories: false,
  email: "tech@patinanetwork.org",
} as const satisfies OrganizationSettingsArgs;
