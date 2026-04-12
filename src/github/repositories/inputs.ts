import type { RepositoryArgs } from "@pulumi/github";
import type { RepositoryRulesetRules } from "@pulumi/github/types/input";

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
  /** Can read, clone, and push to this repository. They can also manage issues, pull requests, and some repository settings. */
  maintain: readonly GithubTeamReference[];
  /** Can read, clone, and push to this repository. Can also manage issues and pull requests. */
  push: readonly GithubTeamReference[];
  /** Can read and clone this repository. Can also manage issues and pull requests. */
  triage: readonly GithubTeamReference[];
  description?: RepositoryArgs["description"];
  visibility: RepositoryVisibility;
  repositorySettingOverrides: Partial<RepositoryArgs>;
  mainBranchProtectionOverrides: Partial<RepositoryRulesetRules>;
};

type RepositoryName = string;

export const DEFAULT_REPOSITORY_SETTINGS: RepositoryArgs = {
  allowMergeCommit: false,
  allowRebaseMerge: true,
  allowSquashMerge: false,
  deleteBranchOnMerge: true,
  allowAutoMerge: true,
} as const;

export const DEFAULT_MAIN_BRANCH_PROTECTIONS: RepositoryRulesetRules = {
  requiredLinearHistory: true,
  nonFastForward: true,
  deletion: false,
  update: false,
  pullRequest: {
    requiredApprovingReviewCount: 1,
    dismissStaleReviewsOnPush: true,
    requireCodeOwnerReview: true,
    requiredReviewThreadResolution: true,
  },
};

export const REPOSITORIES = {
  "example-repository": {
    description: undefined,
    bootstrap: false,
    oldName: undefined,
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    triage: [],
    push: ["@Patina-Network/developers"],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "k8s-manifests": {
    description:
      "Kubernetes manifests for Patina Network services and infrastructure.",
    bootstrap: false,
    oldName: undefined,
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    push: ["@Patina-Network/developers", "@Patina-Network/infra"],
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {
      pullRequest: {
        ...DEFAULT_MAIN_BRANCH_PROTECTIONS.pullRequest,
        requiredApprovingReviewCount: 0,
      },
    },
  },
  "platform-infra": {
    description:
      "Managed infrastructure for Patina Network, powered by Pulumi.",
    bootstrap: false,
    visibility: "public",
    oldName: undefined,
    maintain: ["@Patina-Network/admin"],
    push: ["@Patina-Network/developers", "@Patina-Network/infra"],
    triage: [],
    repositorySettingOverrides: {
      allowAutoMerge: false,
    },
    mainBranchProtectionOverrides: {
      ...DEFAULT_MAIN_BRANCH_PROTECTIONS.requiredStatusChecks,
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "Run Tests",
          },
          {
            context: "Preview Pulumi changes",
          },
        ],
        strictRequiredStatusChecksPolicy: true,
      },
      pullRequest: {
        ...DEFAULT_MAIN_BRANCH_PROTECTIONS.pullRequest,
        requiredApprovingReviewCount: 0,
      },
    },
  },
} as const satisfies Record<RepositoryName, GithubRepository>;

export type GithubRepositoryName = keyof typeof REPOSITORIES;
export type { GithubTeamReference };
