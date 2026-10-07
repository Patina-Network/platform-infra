import type { RepositoryArgs } from "@pulumi/github";
import type { RepositoryRulesetRules } from "@pulumi/github/types/input";
import type { LiteralUnion } from "type-fest";

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

/**
 * `owner/repository`
 * Repositories managed in this file are suggested via intellisense but any plain old `owner/repository` passes typecheck.
 */
export type GithubRepositorySource<TRepositoryName extends string = string> =
  LiteralUnion<
    `${typeof GITHUB_OWNER}/${TRepositoryName}`,
    `${string}/${string}`
  >;
const defineRepositories = <
  const T extends Record<
    RepositoryName,
    GithubRepository<Extract<keyof T, string>>
  >,
>(
  repositories: T,
) => repositories;

// TRepositoryName is a clever trick to get our types back recursively, used for intellisense.
type GithubRepository<TRepositoryName extends string = string> = {
  /** set to `true` when repository has not been seen by Pulumi yet. Set to `false` after Pulumi has successfully reconciled state __AFTER MERGING SAID CHANGE__. */
  bootstrap: boolean;
  /** The actual GitHub repository name. Defaults to the config key when omitted. You should only use this when renaming a repository without having it being deleted. */
  oldName?: string;
  /** Upstream repository (`owner/repository`) to fork from when the repository is created. Leave `undefined` for a regular (non-fork) repository. */
  fork?: GithubRepositorySource<TRepositoryName>;
  /** Can read, clone, and push to this repository. They can also manage issues, pull requests, and some repository settings. */
  maintain: readonly GithubTeamReference[];
  /** Can read, clone, and push to this repository. Can also manage issues and pull requests. */
  push: readonly GithubTeamReference[];
  /** Can read and clone this repository. Can also manage issues and pull requests. */
  triage: readonly GithubTeamReference[];
  description?: RepositoryArgs["description"];
  url?: RepositoryArgs["homepageUrl"];
  visibility: RepositoryVisibility;
  repositorySettingOverrides: Partial<RepositoryArgs>;
  mainBranchProtectionOverrides: Partial<RepositoryRulesetRules>;
  // teams/humans can only bypass via `PR` (aka cannot directly pass via Git).
  // apps however can fully bypass (as they are automated).
  mainBranchProtectionBypass: readonly MainBranchProtectionBypassActor[];
  mainBranchRequiredReviewers: readonly MainBranchRequiredReviewer[];
  /** if set to `true`, will exclude default `SonarCloud Code Analysis` status check. You are expected to register your own multi-scanner status checks instead. */
  monorepo: boolean;
  /** Specifies if the repository should be archived. **NOTE** the GitHub API does not support unarchiving via this provider. */
  archived: boolean;
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

const k8sAppManifests = (app: string, negate = false): string[] => {
  const files = [
    `base/production/${app}/kustomization.yaml`,
    `base/production/${app}/application-prod.yaml`,
    `base/staging/${app}/kustomization.yaml`,
    `base/staging/${app}/application-stg.yaml`,
  ];
  return negate ? files.map((file) => `!${file}`) : files;
};

const docsProjectPages = (project: string, negate = false): string[] => {
  const files = [`docs/${project}/**`];
  return negate ? files.map((file) => `!${file}`) : files;
};

export const REPOSITORIES = defineRepositories({
  "hello-world-clients": {
    description:
      "Hello World clients that call hello-world-grpc-service for an end-to-end Patina Network example",
    url: undefined,
    bootstrap: false,
    oldName: "hello-world-dashboard",
    fork: undefined,
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    monorepo: false,
    archived: true,
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
    mainBranchProtectionBypass: [],
    mainBranchRequiredReviewers: [
      {
        team: "@Patina-Network/codebloom",
        filePatterns: ["**/*"],
        minimumApprovals: 1,
      },
    ],
  },
  "hello-world-grpc-service": {
    description: "Hello World gRPC service for Patina Network",
    url: undefined,
    bootstrap: false,
    oldName: undefined,
    fork: undefined,
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    monorepo: false,
    archived: false,
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "Run Tests",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Build and upload beta gRPC clients",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Build and upload staging gRPC server (amd64)",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Build and upload staging gRPC server (arm64)",
            integrationId: GITHUB_APP_ID.githubActions,
          },
        ],
      },
    },
    mainBranchProtectionBypass: [],
    mainBranchRequiredReviewers: [
      {
        team: "@Patina-Network/codebloom",
        filePatterns: ["**/*"],
        minimumApprovals: 1,
      },
    ],
  },
  ...Object.fromEntries(
    (["Java", "Rust", "Go"] as const).map((lang) => [
      `hello-world-grpc-client-${lang.toLowerCase()}` as const,
      {
        description: `Hello World gRPC ${lang} client for Patina Network`,
        url: undefined,
        bootstrap: false,
        oldName: undefined,
        fork: undefined,
        visibility: "public",
        maintain: ["@Patina-Network/admin"],
        monorepo: false,
        archived: false,
        push: ALL_GITHUB_TEAMS,
        triage: [],
        repositorySettingOverrides: {},
        mainBranchProtectionOverrides: {
          requiredStatusChecks: {
            requiredChecks: [
              {
                context: "Backend tests",
                integrationId: GITHUB_APP_ID.githubActions,
              },
              {
                context: "Build staging image (amd64)",
                integrationId: GITHUB_APP_ID.githubActions,
              },
              {
                context: "Build staging image (arm64)",
                integrationId: GITHUB_APP_ID.githubActions,
              },
              {
                context: "Deploy to staging",
                integrationId: GITHUB_APP_ID.githubActions,
              },
            ],
          },
        },
        mainBranchProtectionBypass: [
          {
            team: "@Patina-Network/codebloom",
          },
        ],
        mainBranchRequiredReviewers: [
          {
            team: "@Patina-Network/codebloom",
            filePatterns: ["**/*"],
            minimumApprovals: 1,
          },
        ],
      } satisfies GithubRepository,
    ]),
  ),
  "k8s-manifests": {
    description:
      "Kubernetes manifests for Patina Network services and infrastructure.",
    url: undefined,
    bootstrap: false,
    oldName: undefined,
    fork: undefined,
    visibility: "public",
    monorepo: false,
    archived: false,
    maintain: ["@Patina-Network/admin"],
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "Lint & validate Kubernetes manifests",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context:
              "Check if PR is only bumping a staging version & prompt for /merge if it is",
            integrationId: GITHUB_APP_ID.githubActions,
          },
        ],
      },
    },
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
    ],
  },
  "platform-infra": {
    description:
      "Managed infrastructure for Patina Network, powered by Pulumi.",
    url: undefined,
    bootstrap: false,
    visibility: "public",
    oldName: undefined,
    fork: undefined,
    maintain: ["@Patina-Network/admin"],
    monorepo: false,
    archived: false,
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
        filePatterns: ["**/*"],
        minimumApprovals: 1,
      },
    ],
    mainBranchProtectionBypass: [
      {
        team: "@Patina-Network/infra",
      },
    ],
  },
  ".github": {
    description: undefined,
    url: undefined,
    bootstrap: false,
    visibility: "public",
    oldName: undefined,
    fork: undefined,
    maintain: ["@Patina-Network/admin"],
    monorepo: false,
    archived: false,
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
    mainBranchProtectionBypass: [],
    mainBranchRequiredReviewers: [
      {
        team: "@Patina-Network/admin",
        filePatterns: ["**/*"],
        minimumApprovals: 1,
      },
    ],
  },
  patchats: {
    description:
      "Repository for Patina Network's PatChats pairing app to algorithmically connect members for 1 on 1 chats",
    url: "https://patchats.patinanetwork.org",
    bootstrap: false,
    oldName: undefined,
    fork: undefined,
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    monorepo: false,
    archived: false,
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
    mainBranchProtectionBypass: [],
    mainBranchRequiredReviewers: [
      {
        team: "@Patina-Network/patchats",
        filePatterns: ["**/*"],
        minimumApprovals: 1,
      },
    ],
  },
  codebloom: {
    description: "Codebloom - LeetCode Leaderboard for Patina Network",
    url: "https://codebloom.patinanetwork.org",
    bootstrap: false,
    oldName: undefined,
    fork: undefined,
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    monorepo: true,
    archived: false,
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
            context: "Build staging image (amd64)",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Build staging image (arm64)",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Build staging image for codebloom-standup-bot (amd64)",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Build staging image for codebloom-standup-bot (arm64)",
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
        filePatterns: ["**/*"],
        minimumApprovals: 1,
      },
    ],
    mainBranchProtectionBypass: [],
  },
  dockerfiles: {
    description: "Toolsets and software baked into static Docker images",
    url: undefined,
    bootstrap: false,
    oldName: undefined,
    fork: undefined,
    visibility: "public",
    maintain: ["@Patina-Network/admin"],
    monorepo: false,
    archived: false,
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
        filePatterns: ["**/*"],
        minimumApprovals: 1,
      },
    ],
  },
  docs: {
    description: "Documentation site for all things Patina Network",
    url: "https://docs.patinanetwork.org",
    bootstrap: false,
    oldName: undefined,
    fork: undefined,
    visibility: "private",
    maintain: ["@Patina-Network/admin"],
    // private repo, can't run sonar in here.
    monorepo: true,
    archived: false,
    push: ALL_GITHUB_TEAMS,
    triage: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "Build & validate docs site",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context:
              "Check if PR only touches docs/ & prompt for /merge if it is",
            integrationId: GITHUB_APP_ID.githubActions,
          },
        ],
      },
    },
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
        // infra owns everything except specific docs for team(s)/project(s).
        team: "@Patina-Network/infra",
        filePatterns: ["**/*", ...docsProjectPages("codebloom", true)],
        minimumApprovals: 1,
      },
      {
        team: "@Patina-Network/codebloom",
        filePatterns: docsProjectPages("codebloom"),
        minimumApprovals: 1,
      },
    ],
  },
});

export type GithubRepositoryName = keyof typeof REPOSITORIES;
export type { GithubTeamReference };
