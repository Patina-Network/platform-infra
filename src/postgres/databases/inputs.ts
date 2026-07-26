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
  dml: PgRole[];
  ro: PgRole[];
};

// applied in index.ts and merged into all databases
export const RO_ALL = [
  "db-backup-ro-sa",
  "grafana-all-ro-sa",
] as const satisfies PgRole[];

export const DATABASES = {
  "codebloom-stg": {
    connectionLimit: 18,
    owner: "codebloom-sa",
    extensions: ["pgcrypto"],
    dml: ["codebloom-stg-app"],
    ro: ["codebloom-stg-ro"],
  },
  "codebloom-prod": {
    connectionLimit: 18,
    owner: "codebloom-sa",
    extensions: ["pgcrypto"],
    dml: ["codebloom-prod-app"],
    ro: ["codebloom-prod-ro"],
  },
  grafana: {
    connectionLimit: 14,
    owner: "grafana-sa",
    extensions: [],
    dml: [],
    ro: [],
  },
  "patchats-stg": {
    connectionLimit: 18,
    owner: "patchats-stg-sa",
    extensions: ["pgcrypto"],
    dml: ["patchats-stg-app"],
    ro: ["patchats-stg-ro"],
  },
  "patchats-prod": {
    connectionLimit: 18,
    owner: "patchats-prod-sa",
    extensions: ["pgcrypto"],
    dml: ["patchats-prod-app"],
    ro: ["patchats-prod-ro"],
  },
} as const satisfies Record<DatabaseName, PgDatabase>;
