import {
  EnvClient,
  EnvClientStrategy,
  PulumiClient,
  PulumiClientStrategy,
} from "@tahminator/pipeline";

export async function main() {
  const envClient = EnvClient.create(EnvClientStrategy.SOPS);
  const { azurePulumiLocation, env } = parseCiEnv(
    await envClient.readFromEnv("secrets.yaml"),
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

  const { cliOutput } = await pulumiClient.up();

  console.log(`Pulumi has finished reconciling!`);
  console.log(cliOutput);
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
