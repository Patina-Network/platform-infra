import type { PgRole } from "@/postgres/roles/inputs";

type PgExtensions = "pgcrypto";

type DatabaseName = string;

type PgDatabase = {
  connectionLimit: number;
  /**
   * If owner is `undefined`, then the `postgres` account
   * will own the table.
   */
  owner: PgRole;
  extensions: PgExtensions[];
  dmlOnly: PgRole[];
};

export const DATABASES = {
  "codebloom-stg": {
    connectionLimit: 18,
    owner: "codebloom-sa",
    extensions: ["pgcrypto"],
    dmlOnly: ["codebloom-stg-app"],
  },
  "codebloom-prod": {
    connectionLimit: 18,
    owner: "codebloom-sa",
    extensions: ["pgcrypto"],
    dmlOnly: ["codebloom-prod-app"],
  },
} as const satisfies Record<DatabaseName, PgDatabase>;
