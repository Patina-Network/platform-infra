import * as azure from "@pulumi/azure-native";
import * as azuread from "@pulumi/azuread";
import * as pulumi from "@pulumi/pulumi";

import { OAUTH_APPS } from "@/azure/apps/inputs";
import {
  provider as azureProvider,
  azureadProvider as provider,
} from "@/azure/provider";
import { AZURE_RBAC_GLOBAL_ROLES } from "@/azure/users/rbac/const";
import { env } from "@/env";

// TODO: migrate this to `./inputs.ts` one day
export const platformInfraPulumiSp = azuread.getServicePrincipalOutput(
  {
    clientId: "66926468-2026-44a4-afe9-d10e76e7ab9a",
  },
  {
    provider,
  },
);

const getOAuthAppResourceName = (appName: string) =>
  `azure-oauth-app-${appName}`;

const getOAuthAppServicePrincipalResourceName = (appName: string) =>
  `azure-oauth-app-service-principal-${appName}`;

const getOAuthAppPasswordResourceName = (appName: string) =>
  `azure-oauth-app-password-${appName}`;

const getOAuthAppRoleAssignmentResourceName = (
  appName: string,
  roleName: string,
) => `azure-role-assignment-oauth-app-${appName}-global-${roleName}`;

const getRoleDefinitionId = (subscriptionId: string, roleId: string) =>
  `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleId}`;

export const azureOAuthApps = Object.fromEntries(
  Object.entries(OAUTH_APPS).map(
    ([appKey, app]) =>
      [
        appKey,
        new azuread.Application(
          getOAuthAppResourceName(appKey),
          {
            displayName: app.displayName,
            signInAudience: app.signInAudience,
            web: {
              redirectUris: [...app.redirectUris],
            },
          },
          { provider },
        ),
      ] as const,
  ),
);

export const azureOAuthServicePrincipals = Object.fromEntries(
  Object.entries(OAUTH_APPS).map(
    ([appKey]) =>
      [
        appKey,
        new azuread.ServicePrincipal(
          getOAuthAppServicePrincipalResourceName(appKey),
          {
            clientId: azureOAuthApps[appKey].clientId,
          },
          { provider },
        ),
      ] as const,
  ),
);

export const azureOAuthAppPasswords = Object.fromEntries(
  Object.entries(OAUTH_APPS).map(
    ([appKey]) =>
      [
        appKey,
        new azuread.ApplicationPassword(
          getOAuthAppPasswordResourceName(appKey),
          {
            applicationId: azureOAuthApps[appKey].id,
            displayName: "master",
          },
          { provider },
        ),
      ] as const,
  ),
);

export const azureOAuthAppRoleAssignments = Object.fromEntries(
  Object.entries(OAUTH_APPS).flatMap(([appKey, app]) =>
    app.azureRoles.map(
      (roleName) =>
        [
          `${appKey}-${roleName}`,
          new azure.authorization.RoleAssignment(
            getOAuthAppRoleAssignmentResourceName(appKey, roleName),
            {
              principalId: azureOAuthServicePrincipals[appKey].objectId,
              principalType: azure.authorization.PrincipalType.ServicePrincipal,
              roleDefinitionId: getRoleDefinitionId(
                env.azure.subscriptionId,
                AZURE_RBAC_GLOBAL_ROLES[roleName],
              ),
              scope: `/subscriptions/${env.azure.subscriptionId}`,
            },
            { provider: azureProvider },
          ),
        ] as const,
    ),
  ),
);

// so we can read output in pulumi state
export const azureOAuthAppSecretsPlaintext = pulumi.secret(
  Object.fromEntries(
    Object.entries(OAUTH_APPS).map(([appKey]) => [
      appKey,
      azureOAuthAppPasswords[appKey].value,
    ]),
  ),
);
