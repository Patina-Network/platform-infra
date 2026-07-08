### Core Commands

# Initial setup command
# Pulumi applies changes based on diffing its existing state stored in an Azure storage account. Point Pulumi to this state.
# Also installs the git hooks.
init-pulumi *args:
  just install-pre-scripts && sops exec-env secrets.yaml "pulumi login "azblob://pulumi-state?storage_account=platform4pulumi""

# Preview the changes that will occur in production by having pulumi diff the existing state.
# NOTE: sops exec-env expects an encrypted secrets.yaml file.
preview *args:
  sops exec-env secrets.yaml "sops exec-env secrets.administrator.yaml \"pulumi preview {{ args }}\""

# Print the initial password Pulumi generated for a newly-created Azure user, keyed by their full email.
get-init-pwd fullEmail:
  sops exec-env secrets.yaml "pulumi stack output azureInitPwsPlaintext --show-secrets --json | jq -er --arg e '{{ fullEmail }}' '.[\$e]'"


### Secret management
# sops is a library that handles the encryption and decryption of files (primarily used for secrets).
# Our secrets are encrypted & stored inside of secrets.yaml.
# The reason why our secrets are checked into version control is so we can
# programmatically change them, track & diff them (similar to what we do with regular source code).

# Use if you created a new secret file and need to encrypt it with SOPS
# If you are editing a file that has already been encrypted, see `just edit`
encrypt file *args:
  just install-pre-scripts && sops --encrypt --in-place {{ file }} {{ args }}

# Securely edit any secret file that is encrypted with SOPS
# You can change the editor it will call on by changing the $EDITOR environment variable
# 
# you can choose to set it one time for the scope of the command: `EDITOR="nvim" just edit secrets.yaml`
# or you can put `export EDITOR=nvim` inside of your `~/.zshrc`, then restart your terminal & run: `just edit secrets.yaml`
#
# if you would like to use VSCode, `EDITOR="code --wait"` (You may have to follow this first: https://code.visualstudio.com/docs/setup/mac#_launch-vs-code-from-the-command-line)
edit file *args:
  just install-pre-scripts && sops edit {{ file }} {{ args }}

# Git hooks are installed on almost every command
# so that we don't accidentally add unencrypted secrets to the git history.
install-pre-scripts:
  just install-pre-commit && just install-pre-push

install-pre-commit:
  cp pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

install-pre-push:
  cp pre-commit .git/hooks/pre-push && chmod +x .git/hooks/pre-push
