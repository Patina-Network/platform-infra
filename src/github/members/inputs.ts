type GithubMemberRole = "admin" | "member";

type GithubMember = {
  role: GithubMemberRole;
  username: string;
};

export const members: GithubMember[] = [
  { username: "tahminator", role: "admin" },
  { username: "arklian", role: "admin" },
  { username: "Arshadul-Monir", role: "member" },
  { username: "SelinaZhu26", role: "member" },
  { username: "Allimonae", role: "member" },
  { username: "RandyJDean", role: "member" },
  // { username: "rootandroo", role: "member" },
  { username: "isabellalam12", role: "member" },
  { username: "MalihaT111", role: "member" },
];
