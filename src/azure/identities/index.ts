/**
 * This directory combines enterprise apps, users, and service accounts
 * in one unified interface. This is particularly useful for RBAC as you can essentially
 * pass in the `objectId` for any of these in order to pull it off.
 */

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
        native: azureServiceAccountManagedIdentities[k],
      },
    ]),
  ),
  app: {
    type: Identity.ENTERPRISE_APP,
    objectId: platformInfraPulumiSp.objectId,
    name: "app",
    native: platformInfraPulumiSp,
  },
} as const satisfies Record<IdentityName, IdentityOptions>;

export type AzureIdentityName = keyof typeof AZURE_IDENTITIES;
