import type { GithubUsername } from "@/github/members/inputs";

type GithubTeamRole = "maintainer" | "member";
type GithubTeamPrivacy = "closed" | "secret";

type GithubTeamMember = {
  role: GithubTeamRole;
  username: GithubUsername;
};

type GithubTeam = {
  members: readonly GithubTeamMember[];
  privacy: GithubTeamPrivacy;
};

type TeamName = string;

export const TEAMS = {
  // ALL MEMBERS SHOULD GO HERE
  developers: {
    privacy: "closed",
    members: [
      { username: "tahminator", role: "member" },
      { username: "arklian", role: "member" },
      { username: "Arshadul-Monir", role: "member" },
      { username: "SelinaZhu26", role: "member" },
      { username: "Allimonae", role: "member" },
      { username: "RandyJDean", role: "member" },
      { username: "rootandroo", role: "member" },
      { username: "isabellalam12", role: "member" },
      { username: "MalihaT111", role: "member" },
    ],
  },
  codebloom: {
    privacy: "closed",
    members: [
      { username: "arklian", role: "member" },
      { username: "Arshadul-Monir", role: "member" },
      { username: "SelinaZhu26", role: "member" },
      { username: "Allimonae", role: "member" },
      { username: "RandyJDean", role: "member" },
      { username: "rootandroo", role: "member" },
      { username: "isabellalam12", role: "member" },
      { username: "MalihaT111", role: "member" },
    ],
  },
  infra: {
    privacy: "closed",
    members: [
      { username: "tahminator", role: "member" },
      { username: "arklian", role: "member" },
    ],
  },
  admin: {
    privacy: "closed",
    members: [
      { username: "tahminator", role: "maintainer" },
      { username: "arklian", role: "maintainer" },
    ],
  },
} as const satisfies Record<TeamName, GithubTeam>;

export type GithubTeamName = keyof typeof TEAMS;
