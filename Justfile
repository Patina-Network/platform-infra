e file *args:
  sops --encrypt --in-place {{ file }} {{ args }}

d file *args:
  sops --decrypt --in-place {{ file }} {{ args }}

appe app env:
  just encrypt apps/{{ env }}/{{ app }}/secrets.yaml

appd app env:
  just decrypt apps/{{ env }}/{{ app }}/secrets.yaml
