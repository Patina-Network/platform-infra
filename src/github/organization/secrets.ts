import * as github from "@pulumi/github";
import { EnvClient, EnvClientStrategy } from "@tahminator/pipeline";

import { GITHUB_OWNER } from "@/github/inputs";
import { provider } from "@/github/provider";

const envClient = EnvClient.create(EnvClientStrategy.SOPS, {
  skipMasking: true,
});

const getOrgActionsSecretResourceName = (secretName: string) =>
  `${GITHUB_OWNER}-organization-actions-secret-${secretName}`;

export const githubOrganizationActionsSecrets = Object.entries(
  await envClient.readFromEnv("secrets.yaml", { baseDir: import.meta.dir }),
).map(
  ([secretName, value]) =>
    new github.ActionsOrganizationSecret(
      getOrgActionsSecretResourceName(secretName),
      {
        secretName,
        value,
        visibility: "all",
      },
      { provider },
    ),
);
