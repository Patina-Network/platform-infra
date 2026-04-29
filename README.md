# platform-infra

Patina's Platform Infrastructure, mainly its Github Organization and Azure Resources are configured and managed through
this repo.

It follows the GitOps methodology, where configuration is stored as code and tracked through Git. Changes are all
recorded through pull requests and leave a record of changes.  
Manual changes through the UI interfaces of platforms Pulumi manages may lead to inconsistencies between the state and
the real configuration.  
Pulumi runs on a push model, and updates resources when the CI pipeline triggers. Inconsistencies may be rolled back if
the manual changes conflict with the configuration.

https://www.pulumi.com/docs/iac/  
https://about.gitlab.com/topics/gitops/

## Onboarding to the Patina Network Organization

To be onboarded to the org, you'll need someone in the @Patina-Network/infra team to create a PR to add you to Github
and Azure.

The following files should be edited:

- src/github/members/inputs.ts
- src/github/teams/inputs.ts
- src/azure/users/inputs.ts

## Onboarding to Azure

Please read the instructions in [`src/azure/users/inputs.ts`](./src/azure/users/inputs.ts) in order to understand how to onboard a new user via Azure.

## Infra Workflow

Anyone in the organization can make changes to the infra by creating a PR on this repo.

Some resources will require someone in @Patina-Network/infra to run the checks and merge the PR for the changes to be
applied.

## Dependencies

Pulumi - Infrastructure-as-Code (IaC) platform.  
https://www.pulumi.com/docs/get-started/download-install/

sops - Secret Management using master key stored in Azure KeyVault  
https://github.com/getsops/sops/releases

AzureCLI - Interface with Azure  
https://learn.microsoft.com/en-us/cli/azure/install-azure-cli

Just - Project Commands  
https://just.systems/man/en/packages.html

Bun - Fast Javascript Runtime  
https://bun.com/
