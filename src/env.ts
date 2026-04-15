export function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`$${key} not found in environment but is required.`);
  }
  return value;
}

export function optional(key: string): string | undefined {
  return process.env[key];
}

export const env = {
  azure: {
    clientId: required("ARM_CLIENT_ID"),
    clientSecret: required("ARM_CLIENT_SECRET"),
    subscriptionId: required("ARM_SUBSCRIPTION_ID"),
    tenantId: required("ARM_TENANT_ID"),
  },
  github: {
    appId: required("GITHUB_APP_APP_ID"),
    installationId: required("GITHUB_APP_INSTALLATION_ID"),
    pemContent: required("GITHUB_APP_PEM_CONTENT"),
  },
  pg: {
    database: required("PG_DATABASE"),
    host: required("PG_HOST"),
    port: Number(required("PG_PORT")),
    username: required("PG_USERNAME"),
    password: required("PG_PASSWORD"),
    role: {
      "codebloom-sa": required("PG_ROLE_codebloom-sa"),
      "codebloom-stg-app": required("PG_ROLE_codebloom-stg-app"),
      "codebloom-prod-app": required("PG_ROLE_codebloom-prod-app"),
      "codebloom-stg-ro": required("PG_ROLE_codebloom-stg-ro"),
      "codebloom-prod-ro": required("PG_ROLE_codebloom-prod-ro"),
      "grafana-sa": required("PG_ROLE_grafana-sa"),
    },
  },
} as const;
