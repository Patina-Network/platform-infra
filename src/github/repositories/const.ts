/**
 * `gh api /orgs/Patina-Network/installations --jq '.installations[] | {app: .app_slug, appId: .app_id}'`
 * `gh api repos/Patina-Network/<repo>/commits/main/check-runs --jq '.check_runs[] | {name, app: .app.name, integrationId: .app.id}'
`
 */
export const GITHUB_APP_ID = {
  githubActions: 15368,
  sonarCloud: 12526,
} as const;

export type GithubAppIdName = keyof typeof GITHUB_APP_ID;
