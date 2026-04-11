import type { RepositoryArgs } from "@pulumi/github";

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
  /** The actual GitHub repository name. Defaults to the config key when omitted. You should only use this when renaming a repository without having it being deleted. */
  oldName?: string;
  /** GitHub's maintain permission: manage settings, labels, and branches without admin-level destructive access. */
  maintain: readonly GithubTeamReference[];
  /** GitHub's push permission: write code and branches, but less access than maintain. */
  push: readonly GithubTeamReference[];
  statusChecks: readonly string[];
  visibility: RepositoryVisibility;
  repositorySettingOverrides: Partial<RepositoryArgs>;
};

type RepositoryName = string;

export const DEFAULT_REPOSITORY_SETTINGS: RepositoryArgs = {
  allowMergeCommit: false,
  allowRebaseMerge: true,
  allowSquashMerge: false,
  deleteBranchOnMerge: true,
  allowAutoMerge: true,
} as const;

export const REPOSITORIES = {
  "example-repository": {
    bootstrap: false,
    statusChecks: [],
    oldName: undefined,
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    push: ["@Patina-Network/developers"],
    repositorySettingOverrides: {},
  },
  "k8s-manifests": {
    bootstrap: false,
    oldName: "k8s-universe",
    statusChecks: [],
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    push: ["@Patina-Network/developers"],
    repositorySettingOverrides: {},
  },
  "platform-infra": {
    bootstrap: false,
    statusChecks: ["Run Tests", "Preview Pulumi changes"],
    visibility: "public",
    oldName: undefined,
    maintain: ["@Patina-Network/admin"],
    push: ["@Patina-Network/developers"],
    repositorySettingOverrides: {
      allowAutoMerge: false,
    },
  },
} as const satisfies Record<RepositoryName, GithubRepository>;

export type GithubRepositoryName = keyof typeof REPOSITORIES;
export type { GithubTeamReference };
