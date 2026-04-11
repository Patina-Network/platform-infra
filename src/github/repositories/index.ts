import * as github from "@pulumi/github";

import { GITHUB_OWNER } from "@/github/inputs";
import { provider } from "@/github/provider";
import {
  DEFAULT_REPOSITORY_SETTINGS,
  REPOSITORIES,
  type GithubRepositoryName,
  type GithubTeamReference,
} from "@/github/repositories/inputs";
import { githubTeams } from "@/github/teams";

type GithubRepositoryMap = Record<GithubRepositoryName, github.Repository>;

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
        new github.Repository(
          `${GITHUB_OWNER}-repository-${repositoryName}`,
          {
            name: repositoryName,
            visibility: repositoryConfig.visibility,
            ...DEFAULT_REPOSITORY_SETTINGS,
            ...repositoryConfig.repositorySettingOverrides,
          },
          {
            provider,
            import: repositoryConfig.bootstrap ? repositoryName : undefined,
          },
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
  REPOSITORIES,
).map(([repositoryName, repositoryConfig]) => {
  const repository = githubRepositories[repositoryName];

  return [
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
          deletion: false,
          update: false,
          pullRequest: {
            // requiredApprovingReviewCount: 1,
            dismissStaleReviewsOnPush: true,
            requireCodeOwnerReview: true,
            requiredReviewThreadResolution: true,
          },
          requiredStatusChecks:
            repositoryConfig.statusChecks.length > 0 ?
              {
                requiredChecks: repositoryConfig.statusChecks.map(
                  (context) => ({
                    context,
                  }),
                ),
                strictRequiredStatusChecksPolicy: true,
              }
            : undefined,
        },
      },
      { provider },
    ),
    new github.RepositoryRuleset(
      `${GITHUB_OWNER}-repository-${repositoryName}-all-other-branch-ruleset`,
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
      { provider },
    ),
  ];
});
