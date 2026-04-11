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
  github: {
    appId: required("GITHUB_APP_APP_ID"),
    installationId: required("GITHUB_APP_INSTALLATION_ID"),
    pemContent: required("GITHUB_APP_PEM_CONTENT"),
  },
} as const;
