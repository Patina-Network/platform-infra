import * as github from "@pulumi/github";
import { EnvClient, EnvClientStrategy } from "@tahminator/pipeline";
import { readdirSync } from "node:fs";
import { basename, join } from "node:path";

import { GITHUB_OWNER } from "@/github/inputs";
import { provider } from "@/github/provider";
import {
  REPOSITORIES,
  type GithubRepositoryName,
} from "@/github/repositories/inputs";

const SECRETS_DIR = join(import.meta.dir, "secrets");

const envClient = EnvClient.create(EnvClientStrategy.SOPS);

const getRepositoryActionsSecretResourceName = (
  repositoryName: string,
  secretName: string,
) =>
  `${GITHUB_OWNER}-repository-${repositoryName}-actions-secret-${secretName}`;

const isRepositoryName = (name: string): name is GithubRepositoryName =>
  name in REPOSITORIES;

const secretFiles = readdirSync(SECRETS_DIR).filter((f) => f.endsWith(".yaml"));

export const githubRepositoryActionsSecrets = (
  await Promise.all(
    secretFiles.map(async (filename) => {
      const repositoryName = basename(filename, ".yaml");
      if (!isRepositoryName(repositoryName)) {
        throw new Error(
          `src/github/repositories/secrets/${filename} does not match any repository in REPOSITORIES.`,
        );
      }
      const repositoryConfig = REPOSITORIES[repositoryName];
      const actualRepositoryName = repositoryConfig.oldName ?? repositoryName;
      const secrets = await envClient.readFromEnv(filename, {
        baseDir: SECRETS_DIR,
      });
      return Object.entries(secrets).map(
        ([secretName, value]) =>
          new github.ActionsSecret(
            getRepositoryActionsSecretResourceName(repositoryName, secretName),
            {
              repository: actualRepositoryName,
              secretName,
              value,
            },
            {
              provider,
            },
          ),
      );
    }),
  )
).flat();
