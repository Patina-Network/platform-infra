import * as pg from "@pulumi/postgresql";

import { DATABASES, RO_ALL } from "@/postgres/databases/inputs";
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
      databaseConfig.dml.map((dmlOnlyRole) => [
        dmlOnlyRole,
        {
          schema: new pg.Grant(
            `pg-db-${databaseName}-schema-dml-grant-${dmlOnlyRole}`,
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
            `pg-db-${databaseName}-table-dml-grant-${dmlOnlyRole}`,
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
            `pg-db-${databaseName}-sequence-dml-grant-${dmlOnlyRole}`,
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
            `pg-db-${databaseName}-default-table-dml-grant-${dmlOnlyRole}`,
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
            `pg-db-${databaseName}-default-sequence-dml-grant-${dmlOnlyRole}`,
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

export const pgDatabaseRoGrantsMap = Object.fromEntries(
  Object.entries(DATABASES).map(([databaseName, databaseConfig]) => [
    databaseName,
    Object.fromEntries(
      [...databaseConfig.ro, ...RO_ALL].map((readOnlyRole) => [
        readOnlyRole,
        {
          schema: new pg.Grant(
            `pg-db-${databaseName}-schema-ro-grant-${readOnlyRole}`,
            {
              database: pgDatabasesMap[databaseName].name,
              objectType: "schema",
              privileges: ["USAGE"],
              role: pgRolesMap[readOnlyRole].name,
              schema: "public",
            },
            {
              provider,
            },
          ),
          tables: new pg.Grant(
            `pg-db-${databaseName}-table-ro-grant-${readOnlyRole}`,
            {
              database: pgDatabasesMap[databaseName].name,
              objectType: "table",
              privileges: ["SELECT"],
              role: pgRolesMap[readOnlyRole].name,
              schema: "public",
            },
            {
              provider,
            },
          ),
          sequences: new pg.Grant(
            `pg-db-${databaseName}-sequence-ro-grant-${readOnlyRole}`,
            {
              database: pgDatabasesMap[databaseName].name,
              objectType: "sequence",
              privileges: ["SELECT"],
              role: pgRolesMap[readOnlyRole].name,
              schema: "public",
            },
            {
              provider,
            },
          ),
          futureTables: new pg.DefaultPrivileges(
            `pg-db-${databaseName}-default-table-ro-grant-${readOnlyRole}`,
            {
              database: pgDatabasesMap[databaseName].name,
              objectType: "table",
              owner: pgRolesMap[databaseConfig.owner].name,
              privileges: ["SELECT"],
              role: pgRolesMap[readOnlyRole].name,
              schema: "public",
            },
            {
              provider,
            },
          ),
          futureSequences: new pg.DefaultPrivileges(
            `pg-db-${databaseName}-default-sequence-ro-grant-${readOnlyRole}`,
            {
              database: pgDatabasesMap[databaseName].name,
              objectType: "sequence",
              owner: pgRolesMap[databaseConfig.owner].name,
              privileges: ["SELECT"],
              role: pgRolesMap[readOnlyRole].name,
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
