import * as sonarcloud from "@pulumi/sonarcloud";

import { PROJECTS } from "@/sonarcloud/project/inputs";
import { provider } from "@/sonarcloud/provider";

const getSonarqubeProjectResourceName = (projectName: string) =>
  `sonarcloud-project-${projectName}`;

export const sonarqubeProjects = Object.fromEntries(
  Object.entries(PROJECTS).map(([projectName]) => [
    projectName,
    new sonarcloud.Project(
      getSonarqubeProjectResourceName(projectName),
      {
        name: projectName,
        key: projectName,
      },
      {
        provider,
      },
    ),
  ]),
);
