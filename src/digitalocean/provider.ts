import * as digitalocean from "@pulumi/digitalocean";

import { env } from "@/env";

export const provider = new digitalocean.Provider("digitalocean", {
  token: env.digitalocean.token,
});
