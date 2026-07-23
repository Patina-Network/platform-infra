import {
  EnvClient,
  EnvClientStrategy,
  PulumiClient,
  PulumiClientStrategy,
} from "@tahminator/pipeline";
import _ from "lodash";

export async function main() {
  const envClient = EnvClient.create(EnvClientStrategy.SOPS);
  const { pulumiBackendUrl, env } = parseCiEnv(
    _.merge(
      await envClient.readFromEnv("secrets.yaml"),
      await envClient.readFromEnv("secrets.administrator.yaml"),
    ),
  );

  const pulumiClient = await PulumiClient.create({
    strategy: PulumiClientStrategy.AZURE,
    stackName: "main",
    workDir: ".",
    envs: {
      PULUMI_BACKEND_URL: pulumiBackendUrl,
      ...env,
    },
  });

  console.log("Pulumi refresh beginning...");
  console.time("pulumi refresh");
  const res = await pulumiClient.refresh();
  console.timeEnd("pulumi refresh");

  console.log(`Pulumi has finished refreshing!`);
  if (res.summary.resourceChanges) {
    console.log("Summary:");
    console.log(
      PulumiClient.parseChangeSumaryToPrettyTable(res.summary.resourceChanges),
    );
  }
  console.log("Stdout:");
  console.log(res.stdout);
}

function parseCiEnv(ciEnv: Record<string, string>) {
  const pulumiBackendUrl = (() => {
    const v = ciEnv["PULUMI_BACKEND_URL"];
    if (!v) {
      throw new Error("Missing PULUMI_BACKEND_URL from .env.ci");
    }
    return v;
  })();

  return {
    pulumiBackendUrl,
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
