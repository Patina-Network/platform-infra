import * as azure from "@pulumi/azure-native";

import { AZURE_IDENTITIES } from "@/azure/identities";
import { provider } from "@/azure/provider";
import { sopsMasterVault } from "@/azure/vaults";
import { AZURE_KEY_VAULT_ROLES } from "@/azure/vaults/rbac/const";
import { env } from "@/env";

const getRoleDefinitionId = (subscriptionId: string, roleId: string) =>
  `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleId}`;

const getRoleAssignmentResourceName = (...parts: string[]) =>
  `azure-role-assignment-${parts.join("-")}`;

export const fluxKustomizeSopsMasterCryptoUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    getRoleAssignmentResourceName(
      "flux-kustomize",
      "key-vault",
      "sops-master",
      "crypto-user",
    ),
    {
      principalId: AZURE_IDENTITIES["kustomize-controller"].objectId,
      principalType: azure.authorization.PrincipalType.ServicePrincipal,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AZURE_KEY_VAULT_ROLES.keyVaultCryptoUser,
      ),
      scope: sopsMasterVault.id,
    },
    { provider },
  );
