import type { UserArgs } from "@pulumi/azuread";

type AzureUser = {
  /** Set this to objectId if you are importing a user into Pulumi. Then once state is reonciled, delete it. */
  bootstrapObjectId?: string;
  mail: UserArgs["mail"];
  mailNickname: UserArgs["mailNickname"];
  preferredLanguage?: UserArgs["preferredLanguage"];
  userPrincipalName: UserArgs["userPrincipalName"];
};

type AzureUserFullName = string;

export const AZURE_USERS = {
  "Arshadul Monir": {
    bootstrapObjectId: "c85509f6-be66-4677-b113-56566f1f4469",
    mail: "arshadul@patinanetwork.onmicrosoft.com",
    mailNickname: "arshadul",
    userPrincipalName: "arshadul@patinanetwork.onmicrosoft.com",
  },
  "Kevin Ma": {
    bootstrapObjectId: "93e7f9d0-1a18-4844-b181-db12118cb997",
    mail: "kevin.ma@patinanetwork.onmicrosoft.com",
    mailNickname: "kevin.ma",
    userPrincipalName: "kevin.ma@patinanetwork.onmicrosoft.com",
  },
  "Ray Zhou": {
    bootstrapObjectId: "bf8318fb-4ea0-48ce-aba7-dcf23fb22470",
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
