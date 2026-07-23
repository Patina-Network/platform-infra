import {
  EnvClient,
  EnvClientStrategy,
  GitHubClient,
  PulumiClient,
  PulumiClientStrategy,
  Utils,
} from "@tahminator/pipeline";
import _ from "lodash";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { GITHUB_OWNER, GITHUB_REPOSITORY } from "../const";

const { prId } = await yargs(hideBin(process.argv))
  .option("prId", {
    type: "number",
    describe: "Pull request number",
    demandOption: true,
  })
  .strict()
  .parse();

export async function main() {
  const envClient = EnvClient.create(EnvClientStrategy.SOPS);
  const {
    pulumiBackendUrl,
    githubAppAppId,
    githubAppInstallationId,
    githubAppPrivateKey,
    env,
  } = parseCiEnv(
    _.merge(
      await envClient.readFromEnv("secrets.yaml"),
      await envClient.readFromEnv("secrets.administrator.yaml"),
    ),
  );
  const githubClient = await GitHubClient.createWithGithubAppToken({
    appId: githubAppAppId,
    privateKey: githubAppPrivateKey,
    installationId: githubAppInstallationId,
  });

  const pulumiClient = await PulumiClient.create({
    strategy: PulumiClientStrategy.AZURE,
    stackName: "main",
    workDir: ".",
    envs: {
      PULUMI_BACKEND_URL: pulumiBackendUrl,
      ...env,
    },
  });

  console.log("Pulumi preview beginning...");
  console.time("pulumi preview");
  const res = await pulumiClient.preview({
    diff: true,
    rewriteStdoutToDiffFriendly: true,
  });
  console.timeEnd("pulumi preview");

  console.log(`Pulumi has finished generating preview!`);
  if (res.stderr.length) {
    console.warn(res.stderr);
  }

  if (Utils.Log.isDebug) {
    console.log(res.stdout);
  }

  await githubClient.sendPrMessage({
    message: `
# Preview of current changes:

## Change Summary
${PulumiClient.parseChangeSumaryToPrettyTable(res.changeSummary)}

## Detailed Diff
<details>
<summary>Click to view full diff</summary>

\`\`\`diff
${res.stdout}
\`\`\`

</details>
`,
    prId,
    owner: GITHUB_OWNER,
    repository: GITHUB_REPOSITORY,
  });
}

function parseCiEnv(ciEnv: Record<string, string>) {
  const pulumiBackendUrl = (() => {
    const v = ciEnv["PULUMI_BACKEND_URL"];
    if (!v) {
      throw new Error("Missing PULUMI_BACKEND_URL from .env.ci");
    }
    return v;
  })();

  const githubAppAppId = (() => {
    const v = ciEnv["GITHUB_APP_APP_ID"];
    if (!v) {
      throw new Error("Missing GITHUB_APP_APP_ID from .env.ci");
    }
    return v;
  })();

  const githubAppInstallationId = (() => {
    const v = ciEnv["GITHUB_APP_INSTALLATION_ID"];
    if (!v) {
      throw new Error("Missing GITHUB_APP_INSTALLATION_ID from .env.ci");
    }
    return v;
  })();

  const githubAppPrivateKey = (() => {
    const v = ciEnv["GITHUB_APP_PEM_CONTENT"];
    if (!v) {
      throw new Error("Missing GITHUB_APP_PEM_CONTENT from .env.ci");
    }
    return v;
  })();

  return {
    pulumiBackendUrl,
    githubAppAppId,
    githubAppInstallationId,
    githubAppPrivateKey,
    env: ciEnv,
  };
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
