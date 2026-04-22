import * as azure from "@pulumi/azure-native";

import { azureClusters } from "@/azure/clusters";
import { CLUSTERS } from "@/azure/clusters/inputs";
import { azureResourceGroups } from "@/azure/groups";
import { DEFAULT_REGION } from "@/azure/inputs";
import { provider } from "@/azure/provider";
import { AZURE_SERVICE_ACCOUNTS } from "@/azure/serviceaccounts/inputs";

const getUserAssignedIdentityResourceName = (
  resourceGroupName: string,
  identityName: string,
) =>
  `azure-resource-group-${resourceGroupName}-user-assigned-identity-${identityName}`;

const getFederatedIdentityCredentialResourceName = (
  resourceGroupName: string,
  identityName: string,
  credentialName: string,
) =>
  `azure-resource-group-${resourceGroupName}-user-assigned-identity-${identityName}-federated-identity-credential-${credentialName}`;

const getFederatedIdentityCredentialSubject = (
  namespace: string,
  serviceAccountName: string,
) => `system:serviceaccount:${namespace}:${serviceAccountName}`;

export const azureServiceAccountManagedIdentities = Object.fromEntries(
  Object.entries(AZURE_SERVICE_ACCOUNTS).map(
    ([serviceAccountName, serviceAccount]) => [
      serviceAccountName,
      new azure.managedidentity.UserAssignedIdentity(
        getUserAssignedIdentityResourceName(
          CLUSTERS[serviceAccount.clusterName].resourceGroup,
          serviceAccountName,
        ),
        {
          location: DEFAULT_REGION,
          resourceGroupName:
            azureResourceGroups[
              CLUSTERS[serviceAccount.clusterName].resourceGroup
            ].name,
          resourceName: serviceAccountName,
        },
        { provider },
      ),
    ],
  ),
);

export const azureServiceAccountFederatedIdentityCredentials =
  Object.fromEntries(
    Object.entries(AZURE_SERVICE_ACCOUNTS).map(
      ([serviceAccountName, serviceAccount]) => [
        serviceAccountName,
        new azure.managedidentity.FederatedIdentityCredential(
          getFederatedIdentityCredentialResourceName(
            CLUSTERS[serviceAccount.clusterName].resourceGroup,
            serviceAccountName,
            serviceAccountName,
          ),
          {
            audiences: ["api://AzureADTokenExchange"],
            federatedIdentityCredentialResourceName: serviceAccountName,
            issuer: azureClusters[
              serviceAccount.clusterName
            ].oidcIssuerProfile.apply((profile) => profile?.issuerURL ?? ""),
            resourceGroupName:
              azureResourceGroups[
                CLUSTERS[serviceAccount.clusterName].resourceGroup
              ].name,
            resourceName:
              azureServiceAccountManagedIdentities[serviceAccountName].name,
            subject: getFederatedIdentityCredentialSubject(
              serviceAccount.namespace,
              serviceAccountName,
            ),
          },
          { provider },
        ),
      ],
    ),
  );
