import "@/github/repositories/secrets";

import * as github from "@pulumi/github";

import { GITHUB_OWNER } from "@/github/inputs";
import { provider } from "@/github/provider";
import {
  DEFAULT_SONARCLOUD_ANALYSIS_JOB_NAME,
  GITHUB_APP_ID,
} from "@/github/repositories/const";
import {
  DEFAULT_MAIN_BRANCH_PROTECTIONS,
  DEFAULT_REPOSITORY_SETTINGS,
  REPOSITORIES,
  type GithubRepositoryName,
  type GithubTeamReference,
  type MainBranchProtectionBypassActor,
} from "@/github/repositories/inputs";
import { githubTeams } from "@/github/teams";
import { mergeWithConcatArrays } from "@/utils";

type GithubRepositoryMap = Record<GithubRepositoryName, github.Repository>;
type GithubTeamPermission = "maintain" | "push" | "triage";

function getTeamName(teamReference: GithubTeamReference) {
  return teamReference.replace(
    `@${GITHUB_OWNER}/`,
    "",
  ) as keyof typeof githubTeams;
}

const getRepositoryResourceName = (repositoryName: string) =>
  `${GITHUB_OWNER}-repository-${repositoryName}`;

const getRepositoryTeamAccessResourceName = (
  repositoryName: string,
  teamName: string,
  permission: GithubTeamPermission,
) =>
  `${GITHUB_OWNER}-repository-${repositoryName}-team-${teamName}-${permission}`;

const getDefaultBranchRulesetResourceName = (repositoryName: string) =>
  `${GITHUB_OWNER}-repository-${repositoryName}-default-branch-ruleset`;

const getAllOtherBranchRulesetResourceName = (repositoryName: string) =>
  `${GITHUB_OWNER}-repository-${repositoryName}-all-other-branch-ruleset`;

export const githubRepositories: GithubRepositoryMap = Object.fromEntries(
  Object.entries(REPOSITORIES).map(([repositoryName, repositoryConfig]) => {
    const actualRepositoryName = repositoryConfig.oldName ?? repositoryName;

    return [
      repositoryName,
      new github.Repository(
        getRepositoryResourceName(repositoryName),
        {
          name: actualRepositoryName,
          visibility: repositoryConfig.visibility,
          description: repositoryConfig.description,
          ...mergeWithConcatArrays(
            DEFAULT_REPOSITORY_SETTINGS,
            repositoryConfig.repositorySettingOverrides,
          ),
        },
        {
          provider,
          import: repositoryConfig.bootstrap ? actualRepositoryName : undefined,
          aliases:
            repositoryConfig.oldName ?
              [
                {
                  name: getRepositoryResourceName(repositoryConfig.oldName),
                },
              ]
            : undefined,
        },
      ),
    ] as const;
  }),
) as GithubRepositoryMap;

export const githubRepositoryTeamAccess = Object.entries(REPOSITORIES).flatMap(
  ([repositoryName, repositoryConfig]) => {
    const createTeamAccess = (
      permission: GithubTeamPermission,
      teamReferences: readonly GithubTeamReference[],
    ) =>
      teamReferences.map((teamReference) => {
        const teamName = getTeamName(teamReference);

        return new github.TeamRepository(
          getRepositoryTeamAccessResourceName(
            repositoryName,
            String(teamName),
            permission,
          ),
          {
            permission,
            repository: repositoryConfig.oldName ?? repositoryName,
            teamId: githubTeams[teamName].slug,
          },
          {
            provider,
            aliases:
              repositoryConfig.oldName ?
                [
                  {
                    name: getRepositoryTeamAccessResourceName(
                      repositoryConfig.oldName,
                      String(teamName),
                      permission,
                    ),
                  },
                ]
              : undefined,
          },
        );
      });

    return [
      ...createTeamAccess("maintain", repositoryConfig.maintain),
      ...createTeamAccess("push", repositoryConfig.push),
      ...createTeamAccess("triage", repositoryConfig.triage),
    ];
  },
);

export const githubRepositoryDefaultBranchRulesets = Object.entries(
  REPOSITORIES,
).map(([repositoryName, repositoryConfig]) => {
  const repository = githubRepositories[repositoryName];

  const branchProtections = (() => {
    const protections = mergeWithConcatArrays(
      DEFAULT_MAIN_BRANCH_PROTECTIONS,
      repositoryConfig.mainBranchProtectionOverrides,
    ) as github.types.output.RepositoryRulesetRules;

    if (repositoryConfig.monorepo) {
      if (protections.requiredStatusChecks) {
        protections.requiredStatusChecks = {
          ...protections.requiredStatusChecks,
          requiredChecks:
            protections.requiredStatusChecks.requiredChecks.filter(
              ({ context }) => context !== DEFAULT_SONARCLOUD_ANALYSIS_JOB_NAME,
            ),
        };
      }
    }

    return protections;
  })();

  const requiredReviewers = repositoryConfig.mainBranchRequiredReviewers.map(
    ({ filePatterns, team, minimumApprovals }) => ({
      filePatterns: [...filePatterns],
      minimumApprovals,
      reviewer: {
        id: githubTeams[getTeamName(team)].id.apply(Number),
        type: "Team",
      },
    }),
  ) satisfies github.types.input.RepositoryRulesetRulesPullRequestRequiredReviewer[];

  return [
    new github.RepositoryRuleset(
      getDefaultBranchRulesetResourceName(repositoryName),
      {
        name: "default-branch",
        enforcement: "active",
        target: "branch",
        bypassActors:
          repositoryConfig.mainBranchProtectionBypass.length ?
            repositoryConfig.mainBranchProtectionBypass.map((actor) => {
              const a = actor as MainBranchProtectionBypassActor;
              if ("team" in a) {
                const teamName = getTeamName(a.team);
                return {
                  actorType: "Team",
                  actorId: githubTeams[teamName].id.apply(Number),
                  bypassMode: "pull_request",
                };
              }

              return {
                actorType: "Integration",
                actorId: GITHUB_APP_ID[a.app],
                bypassMode: "always",
              };
            })
          : undefined,
        repository: repository.name,
        conditions: {
          refName: {
            includes: ["~DEFAULT_BRANCH"],
            excludes: [],
          },
        },
        rules: {
          ...branchProtections,
          pullRequest: {
            ...(branchProtections.pullRequest ?? {}),
            requiredReviewers:
              requiredReviewers.length ? requiredReviewers : undefined,
          },
        },
      },
      {
        provider,
        aliases:
          repositoryConfig.oldName ?
            [
              {
                name: getDefaultBranchRulesetResourceName(
                  repositoryConfig.oldName,
                ),
              },
            ]
          : undefined,
      },
    ),
    new github.RepositoryRuleset(
      getAllOtherBranchRulesetResourceName(repositoryName),
      {
        name: "all-other-branch",
        enforcement: "active",
        target: "branch",
        repository: repository.name,
        conditions: {
          refName: {
            includes: ["~ALL"],
            excludes: ["~DEFAULT_BRANCH"],
          },
        },
        rules: {
          requiredLinearHistory: true,
        },
      },
      {
        provider,
        aliases:
          repositoryConfig.oldName ?
            [
              {
                name: getAllOtherBranchRulesetResourceName(
                  repositoryConfig.oldName,
                ),
              },
            ]
          : undefined,
      },
    ),
  ];
});
