import * as azure from "@pulumi/azure-native";

import { k8sManifestsCluster } from "@/azure/clusters";
import { patinaTestingK8sResourceGroup } from "@/azure/groups";
import { fluxKustomizeIdentity } from "@/azure/identities";
import { provider } from "@/azure/provider";
import { sopsMasterVault } from "@/azure/vaults";
import { env } from "@/env";

const KEY_VAULT_CRYPTO_USER_ROLE_DEFINITION_ID =
  "12338af0-0e69-4776-bea7-57ae8d297424";

export const fluxKustomizeControllerFederatedCredential =
  new azure.managedidentity.FederatedIdentityCredential(
    "flux-kustomize-controller-federated-credential",
    {
      audiences: ["api://AzureADTokenExchange"],
      federatedIdentityCredentialResourceName: "flux-kustomize-controller",
      issuer: k8sManifestsCluster.oidcIssuerProfile.apply(
        (profile) => profile?.issuerURL ?? "",
      ),
      resourceGroupName: patinaTestingK8sResourceGroup.name,
      resourceName: fluxKustomizeIdentity.name,
      subject: "system:serviceaccount:flux-system:kustomize-controller",
    },
    { provider },
  );

export const fluxKustomizeSopsMasterCryptoUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    "flux-kustomize-sops-master-crypto-user-role-assignment",
    {
      principalId: fluxKustomizeIdentity.principalId,
      principalType: azure.authorization.PrincipalType.ServicePrincipal,
      roleDefinitionId: `/subscriptions/${env.azure.subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${KEY_VAULT_CRYPTO_USER_ROLE_DEFINITION_ID}`,
      // TODO: remove when access is granted
      scope: sopsMasterVault.id.apply((id) => id.replace(/^\//, "")),
    },
    {
      provider,
      import:
        "/subscriptions/7779681e-36d2-4f42-9289-8160bd1a407d/resourceGroups/platform-infra/providers/Microsoft.KeyVault/vaults/sops-master/providers/Microsoft.Authorization/roleAssignments/8ef47163-d263-4337-b569-8a4adf4dbfff",
    },
  );
