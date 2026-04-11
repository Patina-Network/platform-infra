import type { GITHUB_OWNER } from "@/github/inputs";
import type { GithubTeamName } from "@/github/teams/inputs";

/**
 * Can be `public` or `private`.
 * If your organization is associated with an enterprise account
 * using GitHub Enterprise Cloud or GitHub Enterprise Server 2.20+,
 * visibility can also be `internal`.
 * The `visibility` parameter overrides the `private` parameter.
 */
type RepositoryVisibility = "public" | "private" | "internal";
type GithubTeamReference = `@${typeof GITHUB_OWNER}/${GithubTeamName}`;

type GithubRepository = {
  /** set to `true` when repository has not been seen by Pulumi yet. Set to `false` after Pulumi has successfully reconciled state __AFTER MERGING SAID CHANGE__. */
  bootstrap: boolean;
  /** GitHub's maintain permission: manage settings, labels, and branches without admin-level destructive access. */
  maintain: readonly GithubTeamReference[];
  /** GitHub's push permission: write code and branches, but less access than maintain. */
  push: readonly GithubTeamReference[];
  statusChecks: readonly string[];
  visibility: RepositoryVisibility;
};

type RepositoryName = string;

export const REPOSITORIES = {
  "example-repository": {
    bootstrap: false,
    statusChecks: [],
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    push: ["@Patina-Network/developers"],
  },
  "k8s-universe": {
    bootstrap: false,
    statusChecks: [],
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    push: ["@Patina-Network/developers", "@Patina-Network/infra"],
  },
  "platform-infra": {
    bootstrap: false,
    statusChecks: ["Run Tests", "Preview Pulumi changes"],
    visibility: "public",
    maintain: ["@Patina-Network/admin", "@Patina-Network/infra"],
    push: ["@Patina-Network/developers"],
  },
} as const satisfies Record<RepositoryName, GithubRepository>;

export type GithubRepositoryName = keyof typeof REPOSITORIES;
export type { GithubTeamReference };
