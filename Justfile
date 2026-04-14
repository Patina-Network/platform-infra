e file *args:
  just install-pre-commit && sops --encrypt --in-place {{ file }} {{ args }}

d file *args:
  just install-pre-commit && sops --decrypt --in-place {{ file }} {{ args }}

preview *args:
 just install-pre-commit && sops exec-env secrets.yaml "pulumi preview {{ args }}"

install-pre-commit:
  cp pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
