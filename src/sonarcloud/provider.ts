import * as sonarcloud from "@pulumi/sonarcloud";

import { env } from "@/env";
import { SONARCLOUD_ORGANIZATION } from "@/sonarcloud/const";

// to update installedEdition & installedVersion
// run ``

export const provider = new sonarcloud.Provider("sonarcloud", {
  organization: SONARCLOUD_ORGANIZATION,
  token: env.sonarcloud.token,
});
