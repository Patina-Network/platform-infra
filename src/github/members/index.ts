import * as github from "@pulumi/github";

import { GITHUB_OWNER } from "../inputs.ts";
import { provider } from "../provider.ts";
import { MEMBERS, type GithubUsername } from "./inputs.ts";

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
