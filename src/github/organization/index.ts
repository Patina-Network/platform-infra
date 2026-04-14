import * as github from "@pulumi/github";

import { GITHUB_OWNER } from "@/github/inputs";
import { ORGANIZATION_SETTINGS } from "@/github/organization/inputs";
import { provider } from "@/github/provider";

export const githubOrganization = await github.getOrganization(
  {
    name: GITHUB_OWNER,
  },
  {
    provider,
  },
);

export const githubOrganizationSettings = new github.OrganizationSettings(
  `${GITHUB_OWNER}-organization-settings`,
  ORGANIZATION_SETTINGS,
  {
    provider,
  },
);
