import { type GithubUsername, MEMBERS } from "@/github/members/inputs";

type GithubTeamRole = "maintainer" | "member";
type GithubTeamPrivacy = "closed" | "secret";

type GithubTeamMember = {
  [Username in GithubUsername]: {
    // requires that github org admins are marked
    // as maintainers on a team (otherwise the API will complain).
    role: Extract<(typeof MEMBERS)[number], { username: Username }>["role"] extends "admin"
      ? "maintainer"
      : GithubTeamRole;
    username: Username;
  };
}[GithubUsername];

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
    members: MEMBERS.map(({ username, role }) =>
      role === "admin" ? { username, role: "maintainer" as const } : { username, role },
    ),
  },
  codebloom: {
    privacy: "closed",
    description: "Active team members for the Codebloom project",
    members: [
      { username: "tahminator", role: "maintainer" },
      { username: "angelayu0530", role: "member" },
      { username: "naanci", role: "member" },
    ],
  },
  patchats: {
    privacy: "closed",
    description: "Active team members for the PatChats project",
    members: [
      { username: "arklian", role: "maintainer" },
      { username: "spiffyy99", role: "maintainer" },
      { username: "rayzhou1201", role: "member" },
      { username: "Allimonae", role: "member" },
      { username: "Arshadul-Monir", role: "member" },
      { username: "RandyJDean", role: "member" },
      { username: "rootandroo", role: "member" },
      { username: "isabellalam12", role: "member" },
      { username: "MalihaT111", role: "member" },
      { username: "luoh00", role: "member" },
      { username: "Kxlcl", role: "member" },
      { username: "14c4", role: "member" },
      { username: "brian10101", role: "member" },
      { username: "helpful-sam", role: "member" },
    ],
  },
  infra: {
    privacy: "closed",
    description: "Responsible for all infrastructures and GitOps",
    members: [
      { username: "tahminator", role: "maintainer" },
      { username: "arklian", role: "maintainer" },
      { username: "spiffyy99", role: "maintainer" },
    ],
  },
  admin: {
    privacy: "closed",
    description: "Patina-Network Administrators",
    members: [
      { username: "tahminator", role: "maintainer" },
      { username: "arklian", role: "maintainer" },
      { username: "spiffyy99", role: "maintainer" },
    ],
  },
} as const satisfies Record<TeamName, GithubTeam>;

export type GithubTeamName = keyof typeof TEAMS;
