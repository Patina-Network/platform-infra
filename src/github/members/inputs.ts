import type { MembershipArgs } from "@pulumi/github";

export type GithubMemberRole = "admin" | "member";

export type GithubMember = {
  role: GithubMemberRole;
  username: MembershipArgs["username"];
};

export const MEMBERS = [
  { username: "tahminator", role: "admin" },
  { username: "arklian", role: "admin" },
  { username: "Arshadul-Monir", role: "member" },
  { username: "Allimonae", role: "member" },
  { username: "RandyJDean", role: "member" },
  { username: "rootandroo", role: "member" },
  { username: "isabellalam12", role: "member" },
  { username: "MalihaT111", role: "member" },
  { username: "rayzhou1201", role: "member" },
  { username: "sookiemonster", role: "member" },
  { username: "patinanetwork-sa", role: "member" },
  { username: "luoh00", role: "member" },
  { username: "spiffyy99", role: "member" },
  { username: "angelayu0530", role: "member" },
  { username: "naanci", role: "member" },
  { username: "Kxlcl", role: "member" },
] as const satisfies readonly GithubMember[];

export type GithubUsername = (typeof MEMBERS)[number]["username"];
