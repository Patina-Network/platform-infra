import * as github from "@pulumi/github";
import { EnvClient, EnvClientStrategy } from "@tahminator/pipeline";

import { GITHUB_OWNER } from "@/github/inputs";
import { provider } from "@/github/provider";

const envClient = EnvClient.create(EnvClientStrategy.SOPS, {
  skipMasking: true,
});

const getOrgActionsSecretResourceName = (secretName: string) =>
  `${GITHUB_OWNER}-organization-actions-secret-${secretName}`;

const getOrgDependabotSecretResourceName = (secretName: string) =>
  `${GITHUB_OWNER}-organization-dependabot-secret-${secretName}`;

const secrets = Object.entries(
  await envClient.readFromEnv("secrets.yaml", { baseDir: import.meta.dir }),
);

export const githubOrganizationActionsSecrets = secrets.map(
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

export const githubOrganizationDependabotSecrets = secrets.map(
  ([secretName, value]) =>
    new github.DependabotOrganizationSecret(
      getOrgDependabotSecretResourceName(secretName),
      {
        secretName,
        value,
        visibility: "all",
      },
      { provider },
    ),
);
