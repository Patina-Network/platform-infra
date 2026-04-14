import * as pg from "@pulumi/postgresql";

import { provider } from "@/postgres/provider";
import { ROLES } from "@/postgres/roles/inputs";

export const pgRolesMap = Object.fromEntries(
  ROLES.map((role) => [
    role.name,
    new pg.Role(
      `pg-role-${role.name}`,
      {
        name: role.name,
        password: role.password,
        login: role.login,
        connectionLimit: role.connectionLimit,
      },
      {
        provider,
      },
    ),
  ]),
);
