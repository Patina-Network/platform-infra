`platform-infra` is a Bun + TypeScript Pulumi repository for managing Patina-Network platform infrastructure.

- `./src/index.ts` is the main entrypoint and should remain side-effect only so Pulumi discovers every resource declaration.
- Infrastructure is organized by Provider (e.g. `./src/azure`, `./src/github`, and `./src/postgres`).
- Prefer small, type-safe changes that fit the existing module structure instead of introducing new abstractions.
- Use the `@/` path alias for local imports rather than long relative paths.
- Keep provider construction centralized in each domain's `provider.ts` and reuse those exported providers instead of instantiating ad hoc providers in resource modules.
  - All resources should have an explicit provider.
- Keep declarative infrastructure data in neighboring `inputs.ts` files so that simple additions / deletions / updates can be done by anybody with relative ease. These data objects should always be `as const satisfies ...` so derived key types stay precise.
- Follow the existing pattern of deriving resource collections into a `Record` with `Object.entries(...)`, `Object.fromEntries(...)`, and `flatMap(...)` instead of hand-writing repetitive resource declarations.
- When adding Pulumi resources, prefer small local helpers for stable resource names such as `get...ResourceName(...)` so renames and aliases remain explicit.
- Stop using `...parts: string[]` to create resource names; it is an anti-pattern and makes maintenance much more difficult.
- Preserve exported map shapes when extending modules. Other modules frequently index into exported collections like `azureResourceGroups`, `githubTeams`, `azureClusters`, and `pgRolesMap`.
- TypeScript is intentionally strict: keep changes compatible with `strict`, `noUncheckedIndexedAccess`, and `verbatimModuleSyntax`, and prefer explicit local types when inference gets loose.
- ESLint enforces sorted imports via `perfectionist/sort-imports`; keep import order clean and use `_` prefixes for intentionally unused variables.
- Environment access should flow through `./src/env.ts` helpers instead of reading `process.env` directly in feature modules.
- Pulumi secrets are managed with SOPS. Do not commit decrypted `secret.yaml` or `secrets.yaml` files. Do not attempt to edit secrets yourself; prompt the user to do so instead.
- `./src/patches.ts` contains unorthodox TypeScript overrides - read that first to be sure you have a full understanding of underlying types.
