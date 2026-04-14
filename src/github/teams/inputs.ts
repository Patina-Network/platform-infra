import { MEMBERS, type GithubUsername } from "@/github/members/inputs";

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
      { username: "arklian", role: "maintainer" },
      { username: "Arshadul-Monir", role: "member" },
      { username: "SelinaZhu26", role: "member" },
      { username: "Allimonae", role: "member" },
      { username: "RandyJDean", role: "member" },
      { username: "rootandroo", role: "member" },
      { username: "isabellalam12", role: "member" },
      { username: "MalihaT111", role: "member" },
    ],
  },
  "pat-chats": {
    privacy: "closed",
    description: "Active team members for the PatChats project",
    members: [
      { username: "arklian", role: "maintainer" },
      { username: "rayzhou1201", role: "member" },
      { username: "Allimonae", role: "member" },
    ],
  },
  infra: {
    privacy: "closed",
    description: "Responsible for all infrastructures and GitOps",
    members: [
      { username: "tahminator", role: "maintainer" },
      { username: "arklian", role: "maintainer" },
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
