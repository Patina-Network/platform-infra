import * as azure from "@pulumi/azure-native";

import { azureClusters } from "@/azure/clusters";
import { azureResourceGroups } from "@/azure/groups";
import { fluxKustomizeIdentity } from "@/azure/identities";
import { provider } from "@/azure/provider";
import { sopsMasterVault } from "@/azure/vaults";
import { AZURE_KEY_VAULT_ROLES } from "@/azure/vaults/rbac/const";
import { env } from "@/env";

const getRoleDefinitionId = (subscriptionId: string, roleId: string) =>
  `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleId}`;

const getFederatedIdentityCredentialResourceName = (
  resourceGroupName: string,
  identityName: string,
  credentialName: string,
) =>
  `azure-resource-group-${resourceGroupName}-user-assigned-identity-${identityName}-federated-identity-credential-${credentialName}`;

const getRoleAssignmentResourceName = (...parts: string[]) =>
  `azure-role-assignment-${parts.join("-")}`;

// system:serviceaccount:<ns>:<svcaccount> where <svcaccount> is the name of the k8s object requiring access
const getFederatedIdentityCredentialSubject = (
  namespace: string,
  svcAccount: string,
) => `system:serviceaccount:${namespace}:${svcAccount}`;

export const fluxKustomizeControllerFederatedCredential =
  new azure.managedidentity.FederatedIdentityCredential(
    getFederatedIdentityCredentialResourceName(
      "k8s",
      "flux-kustomize",
      "flux-kustomize-controller",
    ),
    {
      audiences: ["api://AzureADTokenExchange"],
      federatedIdentityCredentialResourceName: "flux-kustomize-controller",
      issuer: azureClusters["k8s-manifests"].oidcIssuerProfile.apply(
        (profile) => profile?.issuerURL ?? "",
      ),
      resourceGroupName: azureResourceGroups.k8s.name,
      resourceName: fluxKustomizeIdentity.name,
      subject: getFederatedIdentityCredentialSubject(
        "flux-system",
        "kustomize-controller",
      ),
    },
    { provider },
  );

export const fluxKustomizeSopsMasterCryptoUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    getRoleAssignmentResourceName(
      "flux-kustomize",
      "key-vault",
      "sops-master",
      "crypto-user",
    ),
    {
      principalId: fluxKustomizeIdentity.principalId,
      principalType: azure.authorization.PrincipalType.ServicePrincipal,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultCryptoUser,
      ),
      scope: sopsMasterVault.id,
    },
    { provider },
  );
