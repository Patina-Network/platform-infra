import * as azure from "@pulumi/azure-native";

import { k8sManifestsCluster } from "@/azure/clusters";
import { k8sResourceGroup } from "@/azure/groups";
import { fluxKustomizeIdentity } from "@/azure/identities";
import { provider } from "@/azure/provider";
import { AZURE_ROLE_IDS } from "@/azure/rbac/const";
import { sopsMasterVault } from "@/azure/vaults";
import { env } from "@/env";

const getRoleDefinitionId = (subscriptionId: string, roleId: string) =>
  `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleId}`;

// system:serviceaccount:<ns>:<svcaccount> where <svcaccount> is the name of the k8s object requiring access
const getFederatedIdentityCredentialSubject = (
  namespace: string,
  svcAccount: string,
) => `system:serviceaccount:${namespace}:${svcAccount}`;

export const fluxKustomizeControllerFederatedCredential =
  new azure.managedidentity.FederatedIdentityCredential(
    "flux-kustomize-controller-federated-credential",
    {
      audiences: ["api://AzureADTokenExchange"],
      federatedIdentityCredentialResourceName: "flux-kustomize-controller",
      issuer: k8sManifestsCluster.oidcIssuerProfile.apply(
        (profile) => profile?.issuerURL ?? "",
      ),
      resourceGroupName: k8sResourceGroup.name,
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
    "flux-kustomize-sops-master-crypto-user-role-assignment",
    {
      principalId: fluxKustomizeIdentity.principalId,
      principalType: azure.authorization.PrincipalType.ServicePrincipal,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_ROLE_IDS.keyVaultCryptoUser,
      ),
      scope: sopsMasterVault.id,
    },
    {
      provider,
    },
  );
