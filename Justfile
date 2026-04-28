### Core Commands

# Initial setup command
# Pulumi applies changes based on diffing its existing state stored in an Azure storage account. Point Pulumi to this state.
# Also installs the git hooks.
init-pulumi *args:
  just install-pre-scripts && sops exec-env secrets.yaml "pulumi login "azblob://pulumi-state?storage_account=platform4pulumi""

# Preview the changes that will occur in production by having pulumi diff the existing state.
preview *args:
  sops exec-env secrets.yaml "pulumi preview {{ args }}"


### Secret management
# Our secrets are stored encrypted in the secrets.yaml file, so that we can store them on Github publicly.
# sops is used to encrypt and decrypt this file when changes need to be made.
# Git hooks are installed so that we don't accidentally add unencrypted secrets to the git history.
# sops exec-env expects an encrypted secrets.yaml file.
e file *args:
  just install-pre-scripts && sops --encrypt --in-place {{ file }} {{ args }}

d file *args:
  just install-pre-scripts && sops --decrypt --in-place {{ file }} {{ args }}

install-pre-scripts:
  just install-pre-commit && just install-pre-push

install-pre-commit:
  cp pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

install-pre-push:
  cp pre-commit .git/hooks/pre-push && chmod +x .git/hooks/pre-push
