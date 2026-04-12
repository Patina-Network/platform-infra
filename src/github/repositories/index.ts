import * as github from "@pulumi/github";

import { GITHUB_OWNER } from "@/github/inputs";
import { provider } from "@/github/provider";
import {
  DEFAULT_MAIN_BRANCH_PROTECTIONS,
  DEFAULT_REPOSITORY_SETTINGS,
  REPOSITORIES,
  type GithubRepositoryName,
  type GithubTeamReference,
} from "@/github/repositories/inputs";
import { githubTeams } from "@/github/teams";

type GithubRepositoryMap = Record<GithubRepositoryName, github.Repository>;
type GithubTeamPermission = "maintain" | "push";

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
          ...DEFAULT_REPOSITORY_SETTINGS,
          ...repositoryConfig.repositorySettingOverrides,
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
    ];
  },
);

export const githubRepositoryDefaultBranchRulesets = Object.entries(
  REPOSITORIES,
).map(([repositoryName, repositoryConfig]) => {
  const repository = githubRepositories[repositoryName];

  return [
    new github.RepositoryRuleset(
      getDefaultBranchRulesetResourceName(repositoryName),
      {
        name: "default-branch",
        enforcement: "active",
        target: "branch",
        repository: repository.name,
        conditions: {
          refName: {
            includes: ["~DEFAULT_BRANCH"],
            excludes: [],
          },
        },
        rules: {
          ...DEFAULT_MAIN_BRANCH_PROTECTIONS,
          ...repositoryConfig.mainBranchProtectionOverrides,
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
