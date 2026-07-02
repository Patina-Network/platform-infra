# Centralized CI Secret Distribution

This repo pushes GitHub Actions CI secrets out to the `Patina-Network` org and to individual repositories within the org. Values are stored SOPS-encrypted in this repo; Pulumi decrypts them at apply time and reconciles the state on GitHub.

Currently supported:

- **Org-wide** Actions secrets — visible to every repo in `Patina-Network`.
- **Repo-scoped** Actions secrets — visible only to a single repo.

Not supported:

- Environment-scoped secrets

# Adding an org-wide CI secret

Org secrets are visible to every repo under `Patina-Network`.

1. Edit the encrypted file:

   ```bash
   just edit src/github/organization/secrets.yaml
   ```

2. Add a key/value pair inside the editor:

   ```yaml
   MY_ORG_SECRET: "the-value"
   ```

3. Save and close. `sops` re-encrypts on save.

4. Open a PR

5. CI's preview job will show a new `ActionsOrganizationSecret` in the diff. CD applies it on merge + tag.

# Adding a repo-scoped CI secret

Repo secrets are visible to exactly one repo. The file name must match the repository key in [`src/github/repositories/inputs.ts`](../src/github/repositories/inputs.ts) (e.g. `codebloom`, `patchats`, `dockerfiles`).

> [!NOTE]
> If the file name doesn't match a repo key in `REPOSITORIES`, `pulumi preview` will fail with a clear error. Rename the file or add the repo to `REPOSITORIES` first.

1. Open the encrypted file.
   - **First time for a repo**

     create the file, then encrypt it in place:

     ```bash
     touch src/github/repositories/secrets/<repo-name>.yaml
     # add a key, e.g. `MY_REPO_SECRET: the-value`
     just encrypt src/github/repositories/secrets/<repo-name>.yaml
     ```

   - **Subsequent edits**

     use `just edit`:

     ```bash
     just edit src/github/repositories/secrets/<repo-name>.yaml
     ```

     Add a key/value pair inside the editor:

     ```yaml
     MY_REPO_SECRET: "the-value"
     ```

     Save & close, `sops` re-encrypts on save.

2. Open a PR

3. CI's preview job will show a new `ActionsSecret` in the diff. CD applies it on merge + tag.

# What ends up on GitHub

| File                                          | GitHub resource                    | Visibility                    |
| --------------------------------------------- | ---------------------------------- | ----------------------------- |
| `src/github/organization/secrets.yaml`        | `github.ActionsOrganizationSecret` | `all` (every repo in the org) |
| `src/github/repositories/secrets/<repo>.yaml` | `github.ActionsSecret`             | Only that repo                |

Values are pushed to GitHub via libsodium sealed-box encryption. Pulumi marks the plaintext as sensitive, so it does not appear in `pulumi preview` diffs or the PR preview comment.

# Rotating or removing a secret

- **Rotate**: `just edit <file>`, change the value, preview + merge.
- **Remove**: `just edit <file>`, delete the key, preview + merge.

Pulumi will delete the corresponding secret from GitHub.

# Code

logic lives in:

- [`src/github/organization/secrets.ts`](../src/github/organization/secrets.ts)
- [`src/github/repositories/secrets.ts`](../src/github/repositories/secrets.ts)
