import type { RepositoryArgs } from "@pulumi/github";
import type { RepositoryRulesetRules } from "@pulumi/github/types/input";

import type { GITHUB_OWNER } from "@/github/inputs";

import {
  DEFAULT_SONARCLOUD_ANALYSIS_JOB_NAME,
  GITHUB_APP_ID,
  type GithubAppIdName,
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

export type MainBranchProtectionBypassActor =
  | {
      team: GithubTeamReference;
    }
  | {
      app: GithubAppIdName;
    };

type MainBranchRequiredReviewer = {
  team: GithubTeamReference;
  filePatterns: readonly string[];
  minimumApprovals: number;
};

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
  // teams/humans can only bypass via `PR` (aka cannot directly pass via Git).
  // apps however can fully bypass (as they are automated).
  mainBranchProtectionBypass: readonly MainBranchProtectionBypassActor[];
  mainBranchRequiredReviewers: readonly MainBranchRequiredReviewer[];
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
    // CODEOWNERS is retired in favor of `mainBranchRequiredReviewers`.
    requireCodeOwnerReview: false,
    requiredReviewThreadResolution: true,
  },
  requiredStatusChecks: {
    requiredChecks: [
      // this check will be excluded if `monorepo: true` in repository config
      {
        context: DEFAULT_SONARCLOUD_ANALYSIS_JOB_NAME,
        integrationId: GITHUB_APP_ID.sonarCloud,
      },
    ],
    strictRequiredStatusChecksPolicy: true,
  },
};

const ALL_GITHUB_TEAMS = Object.entries(TEAMS).map(
  ([k]) => `@Patina-Network/${k}` as const,
);

const CICD_REVIEWER = {
  team: "@Patina-Network/cicd",
  filePatterns: [".github/**"],
  minimumApprovals: 1,
} as const satisfies MainBranchRequiredReviewer;

const k8sAppManifests = (app: string, negate = false): string[] => {
  const files = [
    `base/production/${app}/kustomization.yaml`,
    `base/production/${app}/application-prod.yaml`,
    `base/staging/${app}/kustomization.yaml`,
    `base/staging/${app}/application-stg.yaml`,
  ];
  return negate ? files.map((file) => `!${file}`) : files;
};

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
    mainBranchProtectionBypass: [
      {
        team: "@Patina-Network/infra",
      },
      {
        app: "patAgent",
      },
    ],
    mainBranchRequiredReviewers: [
      {
        // infra owns everything except specific app manifests.
        team: "@Patina-Network/infra",
        filePatterns: [
          "**/*",
          "!.github/**",
          ...k8sAppManifests("codebloom", true),
          ...k8sAppManifests("codebloom-standup-bot", true),
          ...k8sAppManifests("patchats", true),
        ],
        minimumApprovals: 1,
      },
      {
        team: "@Patina-Network/codebloom",
        filePatterns: [
          ...k8sAppManifests("codebloom"),
          ...k8sAppManifests("codebloom-standup-bot"),
        ],
        minimumApprovals: 1,
      },
      {
        team: "@Patina-Network/patchats",
        filePatterns: [...k8sAppManifests("patchats")],
        minimumApprovals: 1,
      },
      CICD_REVIEWER,
    ],
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
    mainBranchRequiredReviewers: [
      {
        team: "@Patina-Network/infra",
        filePatterns: ["**/*", "!.github/**"],
        minimumApprovals: 1,
      },
      CICD_REVIEWER,
    ],
    mainBranchProtectionBypass: [
      {
        team: "@Patina-Network/infra",
      },
    ],
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
    mainBranchProtectionBypass: [],
    mainBranchRequiredReviewers: [
      {
        team: "@Patina-Network/admin",
        filePatterns: ["**/*", "!.github/**"],
        minimumApprovals: 1,
      },
      CICD_REVIEWER,
    ],
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
    mainBranchProtectionBypass: [],
    mainBranchRequiredReviewers: [
      {
        team: "@Patina-Network/patchats",
        filePatterns: ["**/*", "!.github/**"],
        minimumApprovals: 1,
      },
      CICD_REVIEWER,
    ],
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
    mainBranchRequiredReviewers: [
      {
        team: "@Patina-Network/codebloom",
        filePatterns: ["**/*", "!.github/**"],
        minimumApprovals: 2,
      },
      CICD_REVIEWER,
    ],
    mainBranchProtectionBypass: [],
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
    mainBranchProtectionBypass: [],
    mainBranchRequiredReviewers: [
      {
        team: "@Patina-Network/infra",
        filePatterns: ["**/*", "!.github/**"],
        minimumApprovals: 1,
      },
      CICD_REVIEWER,
    ],
  },
} as const satisfies Record<RepositoryName, GithubRepository>;

export type GithubRepositoryName = keyof typeof REPOSITORIES;
export type { GithubTeamReference };
