import type { RepositoryArgs } from "@pulumi/github";
import type { RepositoryRulesetRules } from "@pulumi/github/types/input";

import type { GITHUB_OWNER } from "@/github/inputs";

import {
  // DEFAULT_SONARCLOUD_ANALYSIS_JOB_NAME,
  GITHUB_APP_ID,
} from "@/github/repositories/const";
import { TEAMS, type GithubTeamName } from "@/github/teams/inputs";

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
  mainBranchProtectionBypassTeams: readonly GithubTeamReference[];
  /** if set to `true`, will exclude default `SonarCloud Code Analysis` status check. You are expected to register your own multi-scanner status checks instead. */
  monorepo: boolean;
};

type RepositoryName = string;

export const DEFAULT_REPOSITORY_SETTINGS: RepositoryArgs = {
  allowMergeCommit: false,
  allowRebaseMerge: false,
  allowSquashMerge: true,
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
    dismissStaleReviewsOnPush: false,
    requireLastPushApproval: true,
    requireCodeOwnerReview: true,
    requiredReviewThreadResolution: true,
  },
  // requiredStatusChecks: {
    // requiredChecks: [
      // this check will be excluded if `monorepo: true` in repository config
      // {
      //   context: DEFAULT_SONARCLOUD_ANALYSIS_JOB_NAME,
      //   integrationId: GITHUB_APP_ID.sonarCloud,
      // },
    // ],
  //   strictRequiredStatusChecksPolicy: true,
  // },
};

const ALL_GITHUB_TEAMS = Object.entries(TEAMS).map(
  ([k]) => `@Patina-Network/${k}` as const,
);

export const REPOSITORIES = {
  "k8s-manifests": {
    description:
      "Kubernetes manifests for Patina Network services and infrastructure.",
    bootstrap: false,
    oldName: undefined,
    visibility: "public",
    monorepo: false,
    maintain: ["@Patina-Network/admin"],
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
    // TODO: remove when initial bootstrapping & prototyping is complete
    mainBranchProtectionBypassTeams: ["@Patina-Network/infra"],
  },
  "platform-infra": {
    description:
      "Managed infrastructure for Patina Network, powered by Pulumi.",
    bootstrap: false,
    visibility: "public",
    oldName: undefined,
    maintain: ["@Patina-Network/admin"],
    monorepo: false,
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {
      allowAutoMerge: false,
    },
    mainBranchProtectionOverrides: {
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "Run Tests",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Preview Pulumi changes",
            integrationId: GITHUB_APP_ID.githubActions,
          },
        ],
      },
    },
    // TODO: remove when initial bootstrapping & prototyping is complete
    mainBranchProtectionBypassTeams: ["@Patina-Network/infra"],
  },
  ".github": {
    description: undefined,
    bootstrap: false,
    visibility: "public",
    oldName: undefined,
    maintain: ["@Patina-Network/admin"],
    monorepo: false,
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
    mainBranchProtectionBypassTeams: [],
  },
  patchats: {
    description:
      "Repository for Patina Network's PatChats pairing app to algorithmically connect members for 1 on 1 chats",
    bootstrap: false,
    oldName: undefined,
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    monorepo: false,
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
    mainBranchProtectionBypassTeams: [],
  },
  codebloom: {
    description: "Codebloom - LeetCode Leaderboard for Patina Network",
    bootstrap: false,
    oldName: undefined,
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    monorepo: true,
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "Frontend Tests",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Backend Tests",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Validate DB Schema on Prod DB",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Build Test Docker Image",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Backend Pre Test",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Run verification checks on the PR",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "[codebloom_backend] SonarCloud Code Analysis",
            integrationId: GITHUB_APP_ID.sonarCloud,
          },
          {
            context: "[codebloom_frontend] SonarCloud Code Analysis",
            integrationId: GITHUB_APP_ID.sonarCloud,
          },
        ],
      },
    },
    mainBranchProtectionBypassTeams: [],
  },
  dockerfiles: {
    description: "Toolsets and software baked into static Docker images",
    bootstrap: false,
    oldName: undefined,
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    monorepo: false,
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "Test Build All Docker images",
            integrationId: GITHUB_APP_ID.githubActions,
          },
        ],
      },
    },
    mainBranchProtectionBypassTeams: [],
  },
} as const satisfies Record<RepositoryName, GithubRepository>;

export type GithubRepositoryName = keyof typeof REPOSITORIES;
export type { GithubTeamReference };
