import * as azure from "@pulumi/azure-native";

import { provider } from "@/azure/provider.ts";
import { azureUsers } from "@/azure/users";
import { AZURE_USERS } from "@/azure/users/inputs.ts";
import { AZURE_RBAC_GLOBAL_ROLES } from "@/azure/users/rbac/const.ts";
import { env } from "@/env.ts";

const getRoleDefinitionId = (subscriptionId: string, roleId: string) =>
  `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleId}`;

const getUserRoleAssignmentResourceName = (
  principalName: string,
  roleName: string,
) => `azure-role-assignment-${principalName}-global-${roleName}`;

/**
 * Creates global roles in Azure Resource Manager (ARM) to manage all Azure resources in the root subscription.
 */
export const globalAzureRoleAssignment = Object.entries(AZURE_USERS).flatMap(
  ([userFullName, user]) =>
    user.azureRoles.map((globalRole) => {
      new azure.authorization.RoleAssignment(
        getUserRoleAssignmentResourceName(user.mailNickname, globalRole),
        {
          principalId: azureUsers[userFullName].objectId,
          principalType: azure.authorization.PrincipalType.User,
          roleDefinitionId: getRoleDefinitionId(
            env.azure.subscriptionId,
            AZURE_RBAC_GLOBAL_ROLES[globalRole],
          ),
          scope: "/subscriptions/" + env.azure.subscriptionId,
        },
        { provider },
      );
    }),
);
