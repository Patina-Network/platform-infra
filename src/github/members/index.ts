import * as github from "@pulumi/github";

import { GITHUB_OWNER } from "@/github/inputs";
import { type GithubUsername, MEMBERS } from "@/github/members/inputs";
import { provider } from "@/github/provider";

type GithubMembershipMap = Record<GithubUsername, github.Membership>;

export const githubMembershipMap: GithubMembershipMap = Object.fromEntries(
  MEMBERS.map(
    (member) =>
      [
        member.username,
        new github.Membership(
          `${GITHUB_OWNER}-member-${member.username}`,
          {
            role: member.role,
            username: member.username,
          },
          { provider },
        ),
      ] as const,
  ),
);
