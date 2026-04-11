import * as github from "@pulumi/github";

import { GITHUB_OWNER } from "@/github/inputs";
import { provider } from "@/github/provider";
import {
  REPOSITORIES,
  type GithubRepositoryName,
  type GithubTeamReference,
} from "@/github/repositories/inputs";
import { githubTeams } from "@/github/teams";

type GithubRepositoryMap = Record<GithubRepositoryName, github.Repository>;

const defaultRepositorySettings = {
  allowMergeCommit: false,
  allowRebaseMerge: true,
  allowSquashMerge: false,
  deleteBranchOnMerge: true,
} as const;

function getTeamName(teamReference: GithubTeamReference) {
  return teamReference.replace(
    `@${GITHUB_OWNER}/`,
    "",
  ) as keyof typeof githubTeams;
}

export const githubRepositories: GithubRepositoryMap = Object.fromEntries(
  Object.entries(REPOSITORIES).map(
    ([repositoryName, repositoryConfig]) =>
      [
        repositoryName,
        repositoryConfig.existing ?
          github.Repository.get(
            `${GITHUB_OWNER}-repository-${repositoryName}`,
            repositoryName,
            undefined,
            { provider },
          )
        : new github.Repository(
            `${GITHUB_OWNER}-repository-${repositoryName}`,
            {
              name: repositoryName,
              visibility: repositoryConfig.visibility,
              ...defaultRepositorySettings,
            },
            { provider },
          ),
      ] as const,
  ),
) as GithubRepositoryMap;

export const githubRepositoryTeamAccess = Object.entries(REPOSITORIES).flatMap(
  ([repositoryName, repositoryConfig]) => {
    const createTeamAccess = (
      permission: "maintain" | "push",
      teamReferences: readonly GithubTeamReference[],
    ) =>
      teamReferences.map((teamReference) => {
        const teamName = getTeamName(teamReference);

        return new github.TeamRepository(
          `${GITHUB_OWNER}-repository-${repositoryName}-team-${teamName}-${permission}`,
          {
            permission,
            repository: repositoryName,
            teamId: githubTeams[teamName].slug,
          },
          { provider },
        );
      });

    return [
      ...createTeamAccess("maintain", repositoryConfig.maintain),
      ...createTeamAccess("push", repositoryConfig.push),
    ];
  },
);

export const githubRepositoryDefaultBranchRulesets = Object.entries(
  githubRepositories,
).map(
  ([repositoryName, repository]) =>
    new github.RepositoryRuleset(
      `${GITHUB_OWNER}-repository-${repositoryName}-default-branch-ruleset`,
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
          requiredLinearHistory: true,
          nonFastForward: true,
          pullRequest: {
            // requiredApprovingReviewCount: 1,
            dismissStaleReviewsOnPush: true,
            requireCodeOwnerReview: true,
            requiredReviewThreadResolution: true,
          },
        },
      },
      { provider },
    ),
);
