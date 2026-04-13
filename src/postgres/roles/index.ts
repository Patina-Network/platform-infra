import * as pg from "@pulumi/postgresql";

import { env } from "@/env";
import { provider } from "@/postgres/provider";

export const pgCodebloomStgSaRole = new pg.Role(
  "codebloom-stg-sa",
  {
    name: "codebloom-stg-sa",
    password: env.pg.role["codebloom-stg-sa"],
    login: true,
    connectionLimit: 24,
  },
  { provider },
);
