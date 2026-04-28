# `bun install` will fail, you must run `bun run install:deps`
install:
  bun run install:deps

e file *args:
  just install-pre-scripts && sops --encrypt --in-place {{ file }} {{ args }}

d file *args:
  just install-pre-scripts && sops --decrypt --in-place {{ file }} {{ args }}

# generate pulumi sdk using terraform-provider
tgen provider:
  pulumi package add terraform-provider {{ provider }}


preview *args:
 just install-pre-scripts && sops exec-env secrets.yaml "pulumi preview {{ args }}"

install-pre-scripts:
  just install-pre-commit && just install-pre-push

install-pre-commit:
  cp pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

install-pre-push:
  cp pre-commit .git/hooks/pre-push && chmod +x .git/hooks/pre-push
