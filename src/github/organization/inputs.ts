import type { OrganizationSettingsArgs } from "@pulumi/github";

export const ORGANIZATION_SETTINGS = {
  name: "Patina Network",
  billingEmail: "henry@patinanetwork.org",
  membersCanCreateRepositories: false,
  membersCanCreatePublicRepositories: false,
  membersCanCreatePages: false,
  membersCanCreatePublicPages: false,
  membersCanCreatePrivatePages: false,
  membersCanCreatePrivateRepositories: false,
  email: "tech@patinanetwork.org",
  blog: "www.patinanetwork.org",
  location: "United States of America",
} as const satisfies OrganizationSettingsArgs;
