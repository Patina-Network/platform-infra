import * as github from "@pulumi/github";

import { GITHUB_OWNER } from "@/github/inputs";
import { githubMembershipMap } from "@/github/members";
import { provider } from "@/github/provider";
import { TEAMS, type GithubTeamName } from "@/github/teams/inputs";

type GithubTeamMap = Record<GithubTeamName, github.Team>;

export const githubTeams: GithubTeamMap = Object.fromEntries(
  Object.entries(TEAMS).map(
    ([teamName, teamConfig]) =>
      [
        teamName,
        new github.Team(
          `${GITHUB_OWNER}-team-${teamName}`,
          {
            name: teamName,
            privacy: teamConfig.privacy,
            description: teamConfig.description,
          },
          { provider },
        ),
      ] as const,
  ),
);

export const githubTeamMemberships = Object.entries(TEAMS).flatMap(
  ([teamName, teamConfig]) =>
    teamConfig.members.map(
      (member) =>
        new github.TeamMembership(
          `${GITHUB_OWNER}-team-${teamName}-member-${member.username}`,
          {
            role: member.role,
            teamId: githubTeams[teamName].id,
            username: member.username,
          },
          {
            dependsOn: [githubMembershipMap[member.username]],
            provider,
          },
        ),
    ),
);
