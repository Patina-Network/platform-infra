import * as headscale from "@pulumi/headscale";

import { env } from "@/env";

export const provider = new headscale.Provider("headscale", {
  apiKey: env.headscale.token,
  endpoint: "https://headscale.patinanetwork.org",
});
