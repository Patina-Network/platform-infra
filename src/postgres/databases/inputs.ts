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
    connectionLimit: 24,
    owner: "codebloom-stg-sa",
    extensions: ["pgcrypto"],
    dmlOnly: ["codebloom-stg-app"],
  },
} as const satisfies Record<DatabaseName, PgDatabase>;
