import type { AzureGlobalRbacRoleName } from "@/azure/users/rbac/const";

/**
 * __ATTENTION__: Please follow these instructions in order to onboard a new
 * Azure app.
 *
 * 1. Add app to `OAUTH_APPS` below.
 * 2. Create & merge PR.
 * 3. After state is reconciled, you can run `just get-oauth-app-secret {appKeyName}` to get the client secret.
 *
 * __Note__: If you need a password reset, please reach out to someone on `@Patina-Network/infra`.
 */

export type OAuthApp = {
  /**
   * Display name for the Azure AD app registration.
   */
  displayName: string;
  /**
   * Redirect URIs Azure AD is allowed to send the auth token back to.
   */
  redirectUris: readonly string[];
  /**
   * Who can sign in through this app.
   *
   * Please default to `AzureADMyOrg` unless you know what you're doing.
   */
  signInAudience: "AzureADMyOrg" | "AzureADMultipleOrgs";
  /**
   * Leave empty for sign-in only apps.
   */
  azureRoles: readonly AzureGlobalRbacRoleName[];
};

export const OAUTH_APPS = {
  headscale: {
    displayName: "Headscale",
    redirectUris: ["https://headscale.patinanetwork.org/oidc/callback"],
    signInAudience: "AzureADMyOrg",
    azureRoles: [],
  },
  grafana: {
    displayName: "Grafana",
    redirectUris: ["https://grafana.vpn.patinanetwork.org/login/azuread"],
    signInAudience: "AzureADMyOrg",
    azureRoles: [],
  },
  // client-credentials identity for Grafana's Azure Monitor datasource (metrics + Log Analytics)
  grafanaAzureMonitor: {
    displayName: "Grafana (Azure Monitor)",
    redirectUris: [],
    signInAudience: "AzureADMyOrg",
    azureRoles: ["reader", "logAnalyticsReader"],
  },
  artifactkeeper: {
    displayName: "Artifact Keeper",
    redirectUris: [
      "https://pkg.vpn.patinanetwork.org/api/v1/auth/sso/oidc/callback",
    ],
    signInAudience: "AzureADMyOrg",
    azureRoles: [],
  },
  // powers middleware level oidc auth via traefik in k8s
  azureOidcStaging: {
    displayName: "Azure OIDC (Staging)",
    // all redirectUris follow `<hostname>/oauth2/callback`
    redirectUris: [],
    signInAudience: "AzureADMyOrg",
    azureRoles: [],
  },
  // powers middleware level oidc auth via traefik in k8s
  azureOidcProduction: {
    displayName: "Azure OIDC (Production)",
    // all redirectUris follow `<hostname>/oauth2/callback`
    redirectUris: ["https://docs.patinanetwork.org/oauth2/callback"],
    signInAudience: "AzureADMyOrg",
    azureRoles: [],
  },
} as const satisfies Record<string, OAuthApp>;

export type OAuthAppName = keyof typeof OAUTH_APPS;
