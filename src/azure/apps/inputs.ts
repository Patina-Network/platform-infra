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
};

export const OAUTH_APPS = {
  headscale: {
    displayName: "Headscale",
    redirectUris: ["https://headscale.patinanetwork.org/oidc/callback"],
    signInAudience: "AzureADMyOrg",
  },
} as const satisfies Record<string, OAuthApp>;

export type OAuthAppName = keyof typeof OAUTH_APPS;
