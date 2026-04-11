import {
  EnvClient,
  EnvClientStrategy,
  GitHubClient,
  PulumiClient,
  PulumiClientStrategy,
  Utils,
} from "@tahminator/pipeline";
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
  const { azurePulumiLocation, env } = parseCiEnv(
    await envClient.readFromEnv("secrets.yaml"),
  );
  const githubClient = await GitHubClient.createWithDefaultCiToken();

  const pulumiClient = await PulumiClient.create({
    strategy: PulumiClientStrategy.AZURE,
    stackName: "main",
    workDir: ".",
    envs: {
      PULUMI_BACKEND_URL: azurePulumiLocation,
      ...env,
    },
  });

  const res = await pulumiClient.preview();
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

\`\`\`text
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
  const azurePulumiLocation = (() => {
    const v = ciEnv["AZURE_PULUMI_LOCATION"];
    if (!v) {
      throw new Error("Missing AZURE_PULUMI_LOCATION from .env.ci");
    }
    return v;
  })();

  return {
    azurePulumiLocation,
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
