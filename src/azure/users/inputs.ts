import type { AzureGlobalEntraRoleName } from "@/azure/users/entra/const";
import type { AzureGlobalRbacRoleName } from "@/azure/users/rbac/const";

/**
 * __ATTENTION__: Please follow these instructions in order to onboard a new
 * Azure user.
 *
 * 1. Add user to `AZURE_USERS` below with `newUser` set to `true`.
 * 2. Create & merge PR.
 * 3. After state is reconciled, you can run `just get-init-pwd {fullEmail}` to get their initial password.
 *    Provide their `fullEmail` and this password to them so they can login & change their password when prompted.
 *
 * __Note__: If you need a password reset, please reach out to a user with `globalAdministrator` or `userAdministrator` role.
 */

type AzureUser = {
  /** Set this to `true` if you are creating a new user. Then once state is reconciled, please set it to `false`. */
  newUser?: boolean;
  /** Roles giving permission for Microsoft Entra, which manages access to Microsoft's suite of apps, but not Azure.  */
  entraRoles: readonly AzureGlobalEntraRoleName[];
  /** Roles giving permission for Azure, allowing developers to view and manage resources.  */
  azureRoles: readonly AzureGlobalRbacRoleName[];
  /** The SMTP address for the user. This property cannot be unset once specified.  */
  mail: string;
  /** The mail alias for the user. Defaults to the user name part of the user principal name (UPN).  */
  mailNickname: string;
  /** The user principal name (UPN) of the user.  */
  userPrincipalName: string;
};

type AzureUserFullName = string;

// New users should be created in Azure, then bootstrapped to this repository.
// Then, we can use Pulumi to wire up resources & permissions.
export const AZURE_USERS = {
  "Henry Chen": {
    newUser: false,
    entraRoles: ["globalAdministrator", "userAdministrator"],
    azureRoles: ["owner"],
    mail: "henry@patinanetwork.onmicrosoft.com",
    mailNickname: "henry",
    userPrincipalName: "henry@patinanetwork.onmicrosoft.com",
  },
  "Tahmid Ahmed": {
    newUser: false,
    entraRoles: ["globalAdministrator", "userAdministrator"],
    azureRoles: ["owner"],
    mail: "tahmid@patinanetwork.onmicrosoft.com",
    mailNickname: "tahmid",
    userPrincipalName: "tahmid@patinanetwork.onmicrosoft.com",
  },
  "Kevin Ma": {
    newUser: false,
    entraRoles: ["globalAdministrator", "userAdministrator"],
    azureRoles: ["contributor"],
    mail: "kevin.ma@patinanetwork.onmicrosoft.com",
    mailNickname: "kevin.ma",
    userPrincipalName: "kevin.ma@patinanetwork.onmicrosoft.com",
  },
  "Ray Zhou": {
    newUser: false,
    entraRoles: ["userAdministrator", "globalReader"],
    azureRoles: ["contributor"],
    mail: "ray@patinanetwork.onmicrosoft.com",
    mailNickname: "ray",
    userPrincipalName: "ray@patinanetwork.onmicrosoft.com",
  },
  "Arshadul Monir": {
    newUser: false,
    entraRoles: ["globalReader", "userAdministrator"],
    azureRoles: ["contributor"],
    mail: "arshadul@patinanetwork.onmicrosoft.com",
    mailNickname: "arshadul",
    userPrincipalName: "arshadul@patinanetwork.onmicrosoft.com",
  },
  "Haoking Luo": {
    newUser: false,
    entraRoles: ["globalReader"],
    azureRoles: ["reader"],
    mail: "haoking.luo@patinanetwork.onmicrosoft.com",
    mailNickname: "haoking.luo",
    userPrincipalName: "haoking.luo@patinanetwork.onmicrosoft.com",
  },
  "Randy Dean": {
    newUser: false,
    entraRoles: ["globalReader"],
    azureRoles: ["reader"],
    mail: "randy.dean@patinanetwork.onmicrosoft.com",
    mailNickname: "randy.dean",
    userPrincipalName: "randy.dean@patinanetwork.onmicrosoft.com",
  },
  "Isabella Lam": {
    newUser: false,
    entraRoles: ["globalReader"],
    azureRoles: ["reader"],
    mail: "isabella.lam@patinanetwork.onmicrosoft.com",
    mailNickname: "isabella.lam",
    userPrincipalName: "isabella.lam@patinanetwork.onmicrosoft.com",
  },
  "Allison Lee": {
    newUser: false,
    entraRoles: ["globalReader"],
    azureRoles: ["reader"],
    mail: "allison.lee@patinanetwork.onmicrosoft.com",
    mailNickname: "allison.lee",
    userPrincipalName: "allison.lee@patinanetwork.onmicrosoft.com",
  },
  "Andrew Yu": {
    newUser: false,
    entraRoles: ["globalReader"],
    azureRoles: ["reader"],
    mail: "andrew.yu@patinanetwork.onmicrosoft.com",
    mailNickname: "andrew.yu",
    userPrincipalName: "andrew.yu@patinanetwork.onmicrosoft.com",
  },
  "Maliha Tasnim": {
    newUser: false,
    entraRoles: ["globalReader"],
    azureRoles: ["reader"],
    mail: "maliha.tasnim@patinanetwork.onmicrosoft.com",
    mailNickname: "maliha.tasnim",
    userPrincipalName: "maliha.tasnim@patinanetwork.onmicrosoft.com",
  },
  "Ousmane Barrie": {
    newUser: false,
    entraRoles: ["globalReader"],
    azureRoles: ["contributor"],
    mail: "ousmane.barrie@patinanetwork.onmicrosoft.com",
    mailNickname: "ousmane.barrie",
    userPrincipalName: "ousmane.barrie@patinanetwork.onmicrosoft.com",
  },
  "Angela Yu": {
    newUser: true,
    entraRoles: ["globalReader"],
    azureRoles: ["reader"],
    mail: "angela.yu@patinanetwork.onmicrosoft.com",
    mailNickname: "angela.yu",
    userPrincipalName: "angela.yu@patinanetwork.onmicrosoft.com",
  },
    "Kelly Lin": {
    bootstrapObjectId: "c9361bf6-3919-48c9-b5aa-d34250e5454c",
    entraRoles: ["globalReader", "userAdministrator"],
    azureRoles: ["reader"],
    mail: "kelly.lin@patinanetwork.onmicrosoft.com",
    mailNickname: "kelly.lin",
    userPrincipalName: "kelly.lin@patinanetwork.onmicrosoft.com",
  },
} as const satisfies Record<AzureUserFullName, AzureUser>;

export type AzureUserName = keyof typeof AZURE_USERS;
