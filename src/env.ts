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
} as const;
