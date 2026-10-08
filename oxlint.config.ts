import shared from "@Patina-Network/cicd-config/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  ...shared,
  ignorePatterns: [...(shared.ignorePatterns ?? []), "sdks", ".github/scripts"],
});
