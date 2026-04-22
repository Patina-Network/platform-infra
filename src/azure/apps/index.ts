import * as azuread from "@pulumi/azuread";

import { azureadProvider as provider } from "@/azure/provider";

export const platformInfraPulumiSp = azuread.getServicePrincipalOutput(
  {
    clientId: "66926468-2026-44a4-afe9-d10e76e7ab9a",
  },
  {
    provider,
  },
);
