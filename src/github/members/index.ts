import * as github from "@pulumi/github";

import { GITHUB_OWNER } from "@/github/const";
import { members } from "@/github/members/inputs";
import { provider } from "@/github/provider";

export const githubMemberships = members.map(
  (m) =>
    new github.Membership(
      `${GITHUB_OWNER}-member-${m.username}`,
      {
        role: m.role,
        username: m.username,
      },
      { provider },
    ),
);
