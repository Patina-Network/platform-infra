/**
 * This directory combines enterprise apps, users, and service accounts
 * in one unified interface. This is particularly useful for RBAC as you can essentially
 * pass in the `objectId` (and matching `principalType`) for any of these in order to pull it off.
 */

import * as azure from "@pulumi/azure-native";
import { Output } from "@pulumi/pulumi";

import { platformInfraPulumiSp } from "@/azure/apps";
import { azureServiceAccountManagedIdentities } from "@/azure/serviceaccounts";
import {
  AZURE_SERVICE_ACCOUNTS,
  type AzureServiceAccountName,
} from "@/azure/serviceaccounts/inputs";
import { azureUsers } from "@/azure/users";
import { AZURE_USERS, type AzureUserName } from "@/azure/users/inputs";

enum Identity {
  USER = 0,
  SERVICE_ACCOUNT = 1,
  ENTERPRISE_APP = 2,
}

type IdentityOptions = {
  type: Identity;
  name: string;
  objectId: Output<string>;
  /** Azure RBAC principal type, ready to pass straight into a `RoleAssignment`. */
  principalType: azure.authorization.PrincipalType;
  native: object;
};

type IdentityName = AzureUserName | AzureServiceAccountName | "app";

export const AZURE_IDENTITIES = {
  ...Object.fromEntries(
    Object.entries(AZURE_USERS).map(([k, v]) => [
      k,
      {
        objectId: azureUsers[k].objectId,
        type: Identity.USER,
        name: v.mailNickname,
        principalType: azure.authorization.PrincipalType.User,
        native: azureUsers[k],
      },
    ]),
  ),
  ...Object.fromEntries(
    Object.entries(AZURE_SERVICE_ACCOUNTS).map(([k]) => [
      k,
      {
        objectId: azureServiceAccountManagedIdentities[k].principalId,
        type: Identity.SERVICE_ACCOUNT,
        name: k,
        principalType: azure.authorization.PrincipalType.ServicePrincipal,
        native: azureServiceAccountManagedIdentities[k],
      },
    ]),
  ),
  app: {
    type: Identity.ENTERPRISE_APP,
    objectId: platformInfraPulumiSp.objectId,
    name: "app",
    principalType: azure.authorization.PrincipalType.ServicePrincipal,
    native: platformInfraPulumiSp,
  },
} as const satisfies Record<IdentityName, IdentityOptions>;

export type AzureIdentityName = keyof typeof AZURE_IDENTITIES;
