import { env } from "@/env";

type PgRoleArgs = {
  name: string;
  password: string;
  /**
   * Defines whether role is allowed to log in.  Roles without
   * this attribute are useful for managing database privileges, but are not users
   * in the usual sense of the word.  Default value is `false`.
   */
  login: boolean;
  connectionLimit: number;
};

export const ROLES = [
  {
    name: "codebloom-stg-sa",
    password: env.pg.role["codebloom-stg-sa"],
    login: true,
    connectionLimit: 4,
  },
  {
    name: "codebloom-stg-app",
    password: env.pg.role["codebloom-stg-app"],
    login: true,
    connectionLimit: 24,
  },
] as const satisfies PgRoleArgs[];

export type PgRole = (typeof ROLES)[number]["name"];
