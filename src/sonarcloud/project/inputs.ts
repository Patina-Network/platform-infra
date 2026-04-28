import {
  REPOSITORIES,
  type GithubRepositoryName,
} from "@/github/repositories/inputs";

type Project = {};

// https://github.com/microsoft/TypeScript/issues/29729#issuecomment-505826972
type ProjectName = DefaultProjectName | (string & {});

type OverridenProjectName = (typeof OVERRIDEN_PROJECTS)[number];
type DefaultProjectName = Exclude<GithubRepositoryName, OverridenProjectName>;

/**
 * If you need to deploy multiple scanners in one repository,
 * add the repository name to this `OVERRIDEN_PROJECTS`,
 * then update `PROJECTS`.
 *
 * If you only need to modify a single scanner in a repository,
 * just skip straight to `PROJECTS` and override as you see fit.
 */
const OVERRIDEN_PROJECTS = [
  "codebloom",
] as const satisfies GithubRepositoryName[];

const DEFAULT_PROJECTS = Object.fromEntries(
  Object.entries(REPOSITORIES)
    .map(([k]) => [k, {}] as const)
    .filter(
      ([k]) =>
        !OVERRIDEN_PROJECTS.includes(k as unknown as OverridenProjectName), // typehack for const
    ),
) as Record<DefaultProjectName, Project>;

export const PROJECTS = {
  ...DEFAULT_PROJECTS,
  codebloom_frontend: {},
  codebloom_backend: {},
} as const satisfies Record<ProjectName, Project>;
