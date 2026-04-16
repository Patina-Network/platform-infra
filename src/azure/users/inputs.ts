import type { AzureGlobalEntraRoleName } from "@/azure/users/const";

type AzureUser = {
  /** Set this to objectId if you are importing a user into Pulumi. Then once state is reonciled, delete it. */
  bootstrapObjectId?: string;
  entraRoles: readonly AzureGlobalEntraRoleName[];
  /**
   * The SMTP address for the user. This property cannot be unset once specified.
   */
  mail: string;
  /**
   * The mail alias for the user. Defaults to the user name part of the user principal name (UPN).
   */
  mailNickname: string;
  /**
   * The user principal name (UPN) of the user.
   */
  userPrincipalName: string;
};

type AzureUserFullName = string;

// New users should be created in Azure, then bootstrapped to this repository.
// Then, we can use Pulumi to wire up resources & permissions.
export const AZURE_USERS = {
  "Arshadul Monir": {
    bootstrapObjectId: undefined,
    entraRoles: ["globalReader"],
    mail: "arshadul@patinanetwork.onmicrosoft.com",
    mailNickname: "arshadul",
    userPrincipalName: "arshadul@patinanetwork.onmicrosoft.com",
  },
  "Kevin Ma": {
    bootstrapObjectId: undefined,
    entraRoles: ["globalAdministrator", "userAdministrator", "globalReader"],
    mail: "kevin.ma@patinanetwork.onmicrosoft.com",
    mailNickname: "kevin.ma",
    userPrincipalName: "kevin.ma@patinanetwork.onmicrosoft.com",
  },
  "Ray Zhou": {
    bootstrapObjectId: undefined,
    entraRoles: ["userAdministrator", "globalReader"],
    mail: "ray@patinanetwork.onmicrosoft.com",
    mailNickname: "ray",
    userPrincipalName: "ray@patinanetwork.onmicrosoft.com",
  },
  "Tahmid Ahmed": {
    bootstrapObjectId: undefined,
    entraRoles: ["globalAdministrator", "userAdministrator"],
    mail: "tahmid@patinanetwork.onmicrosoft.com",
    mailNickname: "tahmid",
    userPrincipalName: "tahmid@patinanetwork.onmicrosoft.com",
  },
  "Henry Chen": {
    bootstrapObjectId: undefined,
    entraRoles: ["globalAdministrator"],
    mail: "henry@patinanetwork.onmicrosoft.com",
    mailNickname: "henry",
    userPrincipalName: "henry@patinanetwork.onmicrosoft.com",
  },
} as const satisfies Record<AzureUserFullName, AzureUser>;

export type AzureUserName = keyof typeof AZURE_USERS;
