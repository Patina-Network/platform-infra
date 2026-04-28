import * as sonarcloud from "@pulumi/sonarcloud";

import { SONARCLOUD_ORGANIZATION_NAME } from "@/sonarcloud/const";
import { PROJECTS } from "@/sonarcloud/project/inputs";
import { provider } from "@/sonarcloud/provider";

const getSonarqubeProjectResourceName = (projectName: string) =>
  `sonarcloud-project-${projectName}`;

const getSonarqubeProjectKey = (projectName: string) =>
  `${SONARCLOUD_ORGANIZATION_NAME}_${projectName}` as const;

export const sonarqubeProjects = Object.fromEntries(
  Object.entries(PROJECTS).map(([projectName]) => [
    projectName,
    new sonarcloud.Project(
      getSonarqubeProjectResourceName(projectName),
      {
        name: projectName,
        key: getSonarqubeProjectKey(projectName),
      },
      {
        provider,
      },
    ),
  ]),
);
