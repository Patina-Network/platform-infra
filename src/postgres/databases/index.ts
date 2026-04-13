import * as pg from "@pulumi/postgresql";

import { provider } from "@/postgres/provider";
import { pgCodebloomStgSaRole } from "@/postgres/roles";

export const pgStgDb = new pg.Database(
  "codebloom-stg",
  {
    connectionLimit: 24,
    name: "codebloom-stg",
    owner: pgCodebloomStgSaRole.name,
  },
  { provider },
);

export const pgStgDbPgCrypto = new pg.Extension(
  "pgcrypto",
  {
    database: pgStgDb.name,
    name: "pgcrypto",
  },
  {
    provider,
    dependsOn: [pgStgDb],
  },
);
