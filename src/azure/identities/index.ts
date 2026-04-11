import * as azuread from "@pulumi/azuread";

function createAccessGroup(name: string, description: string) {
  return new azuread.Group(name, {
    description,
    displayName: name,
    preventDuplicateNames: true,
    securityEnabled: true,
  });
}

export const aksReadersGroup = createAccessGroup(
  "aks-readers",
  "Read-only access to AKS clusters.",
);

export const aksWritersGroup = createAccessGroup(
  "aks-writers",
  "Read-write access to AKS clusters.",
);
