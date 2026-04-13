import * as pg from "@pulumi/postgresql";

import { env } from "@/env";

export const provider = new pg.Provider("pg", {
  database: env.pg.database,
  host: env.pg.host,
  port: env.pg.port,
  username: env.pg.username,
  password: env.pg.password,
});
