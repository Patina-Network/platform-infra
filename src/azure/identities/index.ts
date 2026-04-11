import * as azuread from "@pulumi/azuread";

export const tahmidUser = azuread.getUserOutput({
  userPrincipalName: "tahmid@patinanetwork.onmicrosoft.com",
});

export const henryUser = azuread.getUserOutput({
  userPrincipalName: "henry@patinanetwork.onmicrosoft.com",
});
