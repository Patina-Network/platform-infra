import { type GithubUsername, MEMBERS } from "@/github/members/inputs";

type GithubTeamRole = "maintainer" | "member";
type GithubTeamPrivacy = "closed" | "secret";

type GithubTeamMember = {
  role: GithubTeamRole;
  username: GithubUsername;
};

type GithubTeam = {
  members: readonly GithubTeamMember[];
  privacy: GithubTeamPrivacy;
  description?: string;
};

type TeamName = string;

export const TEAMS = {
  // ALL MEMBERS SHOULD GO HERE
  developers: {
    privacy: "closed",
    description: "All active developers",
    members: MEMBERS.map(({ username, role }) => ({
      username,
      role: role === "admin" ? "maintainer" : role,
    })),
  },
  codebloom: {
    privacy: "closed",
    description: "Active team members for the Codebloom project",
    members: [
      { username: "tahminator", role: "member" },
      { username: "angelayu0530", role: "member" },
      { username: "naanci", role: "member" },
    ],
  },
  patchats: {
    privacy: "closed",
    description: "Active team members for the PatChats project",
    members: [
      { username: "arklian", role: "maintainer" },
      { username: "rayzhou1201", role: "member" },
      { username: "Allimonae", role: "member" },
      { username: "Arshadul-Monir", role: "member" },
      { username: "RandyJDean", role: "member" },
      { username: "rootandroo", role: "member" },
      { username: "isabellalam12", role: "member" },
      { username: "MalihaT111", role: "member" },
      { username: "luoh00", role: "member" },
      { username: "spiffyy99", role: "member" },
    ],
  },
  infra: {
    privacy: "closed",
    description: "Responsible for all infrastructures and GitOps",
    members: [
      { username: "tahminator", role: "maintainer" },
      { username: "arklian", role: "maintainer" },
      { username: "spiffyy99", role: "member" },
    ],
  },
  cicd: {
    privacy: "closed",
    description: "Responsible for all projects' CICD",
    members: [
      { username: "tahminator", role: "maintainer" },
      { username: "arklian", role: "maintainer" },
      { username: "spiffyy99", role: "member" },
    ],
  },
  admin: {
    privacy: "closed",
    description: "Patina-Network Administrators",
    members: [
      { username: "tahminator", role: "maintainer" },
      { username: "arklian", role: "maintainer" },
    ],
  },
} as const satisfies Record<TeamName, GithubTeam>;

export type GithubTeamName = keyof typeof TEAMS;
