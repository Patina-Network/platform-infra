import * as github from "@pulumi/github";

import { env } from "@/env";
import { GITHUB_OWNER } from "@/github/const";

export const provider = new github.Provider("github", {
  owner: GITHUB_OWNER,
  appAuth: {
    id: env.github.appId,
    installationId: env.github.installationId,
    pemFile: env.github.pemContent,
  },
});
