import * as pg from "@pulumi/postgresql";

import { DATABASES } from "@/postgres/databases/inputs";
import { provider } from "@/postgres/provider";
import { pgRolesMap } from "@/postgres/roles";

export const pgDatabasesMap = Object.fromEntries(
  Object.entries(DATABASES).map(([databaseName, databaseConfig]) => [
    databaseName,
    new pg.Database(
      `pg-db-${databaseName}`,
      {
        name: databaseName,
        owner: pgRolesMap[databaseConfig.owner].name,
        connectionLimit: databaseConfig.connectionLimit,
      },
      {
        provider,
      },
    ),
  ]),
);

export const pgDatabaseDmlOnlyGrantsMap = Object.fromEntries(
  Object.entries(DATABASES).map(([databaseName, databaseConfig]) => [
    databaseName,
    Object.fromEntries(
      databaseConfig.dmlOnly.map((dmlOnlyRole) => [
        dmlOnlyRole,
        {
          schema: new pg.Grant(
            `pg-db-${databaseName}-schema-grant-${dmlOnlyRole}`,
            {
              database: pgDatabasesMap[databaseName].name,
              objectType: "schema",
              privileges: ["USAGE"],
              role: pgRolesMap[dmlOnlyRole].name,
              schema: "public",
            },
            {
              provider,
            },
          ),
          tables: new pg.Grant(
            `pg-db-${databaseName}-table-grant-${dmlOnlyRole}`,
            {
              database: pgDatabasesMap[databaseName].name,
              objectType: "table",
              privileges: ["SELECT", "INSERT", "UPDATE", "DELETE"],
              role: pgRolesMap[dmlOnlyRole].name,
              schema: "public",
            },
            {
              provider,
            },
          ),
          sequences: new pg.Grant(
            `pg-db-${databaseName}-sequence-grant-${dmlOnlyRole}`,
            {
              database: pgDatabasesMap[databaseName].name,
              objectType: "sequence",
              privileges: ["USAGE", "SELECT", "UPDATE"],
              role: pgRolesMap[dmlOnlyRole].name,
              schema: "public",
            },
            {
              provider,
            },
          ),
          futureTables: new pg.DefaultPrivileges(
            `pg-db-${databaseName}-default-table-grant-${dmlOnlyRole}`,
            {
              database: pgDatabasesMap[databaseName].name,
              objectType: "table",
              owner: pgRolesMap[databaseConfig.owner].name,
              privileges: ["SELECT", "INSERT", "UPDATE", "DELETE"],
              role: pgRolesMap[dmlOnlyRole].name,
              schema: "public",
            },
            {
              provider,
            },
          ),
          futureSequences: new pg.DefaultPrivileges(
            `pg-db-${databaseName}-default-sequence-grant-${dmlOnlyRole}`,
            {
              database: pgDatabasesMap[databaseName].name,
              objectType: "sequence",
              owner: pgRolesMap[databaseConfig.owner].name,
              privileges: ["USAGE", "SELECT", "UPDATE"],
              role: pgRolesMap[dmlOnlyRole].name,
              schema: "public",
            },
            {
              provider,
            },
          ),
        },
      ]),
    ),
  ]),
);

export const pgDatabaseExtensionsMap = Object.fromEntries(
  Object.entries(DATABASES).map(
    ([databaseName, { extensions: databaseExtensions }]) => [
      databaseName,
      Object.fromEntries(
        databaseExtensions.map((extension) => [
          extension,
          new pg.Extension(
            `pg-db-${databaseName}-ext-${extension}`,
            {
              name: extension,
              database: pgDatabasesMap[databaseName].name,
            },
            { provider },
          ),
        ]),
      ),
    ],
  ),
);
