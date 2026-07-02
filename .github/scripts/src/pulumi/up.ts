import {
  EnvClient,
  EnvClientStrategy,
  PulumiClient,
  PulumiClientStrategy,
} from "@tahminator/pipeline";
import _ from "lodash";

export async function main() {
  const envClient = EnvClient.create(EnvClientStrategy.SOPS);
  const { azurePulumiLocation, env } = parseCiEnv(
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
      PULUMI_BACKEND_URL: azurePulumiLocation,
      ...env,
    },
  });

  console.log("Pulumi up beginning...");
  console.time("pulumi up");
  const res = await pulumiClient.up();
  console.timeEnd("pulumi up");

  console.log(`Pulumi has finished reconciling!`);
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
