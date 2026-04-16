import type { UserArgs } from "@pulumi/azuread";

import type { AzureGlobalRoleName } from "@/azure/users/const";

type AzureUser = {
  /** Set this to existing directory role assignment ids while bootstrapping admin roles. Then delete it. */
  bootstrapGlobalRoleAssignmentIds?: Partial<
    Record<AzureGlobalRoleName, string>
  >;
  /** Set this to objectId if you are importing a user into Pulumi. Then once state is reonciled, delete it. */
  bootstrapObjectId?: string;
  globalRoles?: readonly AzureGlobalRoleName[];
  mail: UserArgs["mail"];
  mailNickname: UserArgs["mailNickname"];
  preferredLanguage?: UserArgs["preferredLanguage"];
  userPrincipalName: UserArgs["userPrincipalName"];
};

type AzureUserFullName = string;

// New users should be created in Azure, then bootstrapped to this repository.
// Then, we can use Pulumi to wire up resources & permissions.
export const AZURE_USERS = {
  "Arshadul Monir": {
    bootstrapGlobalRoleAssignmentIds: {},
    bootstrapObjectId: undefined,
    globalRoles: ["globalReader"],
    mail: "arshadul@patinanetwork.onmicrosoft.com",
    mailNickname: "arshadul",
    userPrincipalName: "arshadul@patinanetwork.onmicrosoft.com",
  },
  "Kevin Ma": {
    bootstrapGlobalRoleAssignmentIds: {},
    bootstrapObjectId: undefined,
    globalRoles: ["globalAdministrator", "userAdministrator", "globalReader"],
    mail: "kevin.ma@patinanetwork.onmicrosoft.com",
    mailNickname: "kevin.ma",
    userPrincipalName: "kevin.ma@patinanetwork.onmicrosoft.com",
  },
  "Ray Zhou": {
    bootstrapGlobalRoleAssignmentIds: {},
    bootstrapObjectId: undefined,
    globalRoles: ["userAdministrator", "globalReader"],
    mail: "ray@patinanetwork.onmicrosoft.com",
    mailNickname: "ray",
    userPrincipalName: "ray@patinanetwork.onmicrosoft.com",
  },
  // TODO: Uncomment these if it doesn't break anything by doing this.
  // "Tahmid Ahmed": {
  //   bootstrapObjectId: "e7b4476c-c01a-4ada-84ae-26b2d0fd3046",
  //   mail: "tahmid@patinanetwork.onmicrosoft.com",
  //   mailNickname: "tahmid",
  //   preferredLanguage: "en",
  //   userPrincipalName: "tahmid@patinanetwork.onmicrosoft.com",
  // },
  // "Henry Chen": {
  //   bootstrapObjectId: "26e110ee-e4ec-4e59-87b4-ffe18222e6c6",
  //   mail: "henry@patinanetwork.onmicrosoft.com",
  //   mailNickname: "henry",
  //   preferredLanguage: "en",
  //   userPrincipalName: "henry@patinanetwork.onmicrosoft.com",
  // },
} as const satisfies Record<AzureUserFullName, AzureUser>;

export type AzureUserName = keyof typeof AZURE_USERS;
