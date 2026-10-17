import * as github from "@pulumi/github";
import { EnvClient, EnvClientStrategy } from "@tahminator/pipeline";
import { readdirSync } from "node:fs";
import { basename, join } from "node:path";

import { GITHUB_OWNER } from "@/github/inputs";
import { provider } from "@/github/provider";
import { REPOSITORIES, type GithubRepositoryName } from "@/github/repositories/inputs";

const SECRETS_DIR = join(import.meta.dir, "secrets");

const envClient = EnvClient.create(EnvClientStrategy.SOPS, {
  skipMasking: true,
});

const getRepositoryActionsSecretResourceName = (repositoryName: string, secretName: string) =>
  `${GITHUB_OWNER}-repository-${repositoryName}-actions-secret-${secretName}`;

const getRepositoryDependabotSecretResourceName = (repositoryName: string, secretName: string) =>
  `${GITHUB_OWNER}-repository-${repositoryName}-dependabot-secret-${secretName}`;

const isRepositoryName = (name: string): name is GithubRepositoryName => name in REPOSITORIES;

const secretFiles = readdirSync(SECRETS_DIR).filter((f) => f.endsWith(".yaml"));

const repositorySecrets = (
  await Promise.all(
    secretFiles.map(async (filename) => {
      const repositoryName = basename(filename, ".yaml");
      if (!isRepositoryName(repositoryName)) {
        throw new Error(
          `src/github/repositories/secrets/${filename} does not match any repository in REPOSITORIES.`,
        );
      }

      const secrets = await envClient.readFromEnv(filename, {
        baseDir: SECRETS_DIR,
      });

      return Object.entries(secrets).map(([secretName, value]) => ({
        repositoryName,
        secretName,
        value,
      }));
    }),
  )
).flat();

export const githubRepositoryActionsSecrets = repositorySecrets.map(
  ({ repositoryName, secretName, value }) =>
    new github.ActionsSecret(
      getRepositoryActionsSecretResourceName(repositoryName, secretName),
      {
        repository: repositoryName,
        secretName,
        value,
      },
      {
        provider,
      },
    ),
);

export const githubRepositoryDependabotSecrets = repositorySecrets.map(
  ({ repositoryName, secretName, value }) =>
    new github.DependabotSecret(
      getRepositoryDependabotSecretResourceName(repositoryName, secretName),
      {
        repository: repositoryName,
        secretName,
        value,
      },
      {
        provider,
      },
    ),
);
