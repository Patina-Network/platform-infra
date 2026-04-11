import type { MembershipArgs } from "@pulumi/github";

export type GithubMemberRole = "admin" | "member";

export type GithubMember = {
  role: MembershipArgs["role"];
  username: MembershipArgs["username"];
};

export const MEMBERS = [
  { username: "tahminator", role: "admin" },
  { username: "arklian", role: "admin" },
  { username: "Arshadul-Monir", role: "member" },
  { username: "SelinaZhu26", role: "member" },
  { username: "Allimonae", role: "member" },
  { username: "RandyJDean", role: "member" },
  { username: "rootandroo", role: "member" },
  { username: "isabellalam12", role: "member" },
  { username: "MalihaT111", role: "member" },
] as const satisfies readonly GithubMember[];

export type GithubUsername = (typeof MEMBERS)[number]["username"];
