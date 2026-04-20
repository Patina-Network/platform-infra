import * as azure from "@pulumi/azure-native";
import * as azuread from "@pulumi/azuread";

import { k8sManifestsCluster } from "@/azure/clusters";
import { AKS_RBAC_ROLE_IDS } from "@/azure/clusters/rbac/const";
import {
  AKS_CLUSTER_READONLY_USERS,
  AKS_CLUSTER_ADMIN_USERS,
} from "@/azure/clusters/rbac/inputs";
import { azureadProvider, provider } from "@/azure/provider";
import { azureUsers } from "@/azure/users";
import { AZURE_USERS } from "@/azure/users/inputs";
import { env } from "@/env";

const getRoleDefinitionId = (subscriptionId: string, roleId: string) =>
  `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleId}`;

const getGroupResourceName = (groupName: string) => `azure-group-${groupName}`;

const getGroupMemberResourceName = (groupName: string, memberName: string) =>
  `azure-group-${groupName}-member-${memberName}`;

const getRoleAssignmentResourceName = (...parts: string[]) =>
  `azure-role-assignment-${parts.join("-")}`;

export const k8sManifestsReadersGroup = new azuread.Group(
  getGroupResourceName("k8s-manifests-readers"),
  {
    displayName: "k8s-manifests-readers",
    mailEnabled: false,
    securityEnabled: true,
  },
  { provider: azureadProvider },
);

export const k8sManifestsReaderGroupMembers = Object.fromEntries(
  AKS_CLUSTER_READONLY_USERS.map((userName) => [
    userName,
    new azuread.GroupMember(
      getGroupMemberResourceName(
        "k8s-manifests-readers",
        AZURE_USERS[userName].mailNickname,
      ),
      {
        groupObjectId: k8sManifestsReadersGroup.objectId,
        memberObjectId: azureUsers[userName].objectId,
      },
      { provider: azureadProvider },
    ),
  ]),
);

export const k8sManifestsReaderRoleAssignment =
  new azure.authorization.RoleAssignment(
    getRoleAssignmentResourceName(
      "k8s-manifests-readers",
      "managed-cluster",
      "k8s-manifests",
      "reader",
    ),
    {
      principalId: k8sManifestsReadersGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AKS_RBAC_ROLE_IDS.reader,
      ),
      scope: k8sManifestsCluster.id,
    },
    { provider },
  );

export const k8sManifestsReaderClusterUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    getRoleAssignmentResourceName(
      "k8s-manifests-readers",
      "managed-cluster",
      "k8s-manifests",
      "cluster-user",
    ),
    {
      principalId: k8sManifestsReadersGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AKS_RBAC_ROLE_IDS.clusterUser,
      ),
      scope: k8sManifestsCluster.id,
    },
    { provider },
  );

export const k8sManifestsAdminsGroup = new azuread.Group(
  getGroupResourceName("k8s-manifests-admins"),
  {
    displayName: "k8s-manifests-admins",
    mailEnabled: false,
    securityEnabled: true,
  },
  { provider: azureadProvider },
);

export const k8sManifestsAdminGroupMembers = Object.fromEntries(
  AKS_CLUSTER_ADMIN_USERS.map((userName) => [
    userName,
    new azuread.GroupMember(
      getGroupMemberResourceName(
        "k8s-manifests-admins",
        AZURE_USERS[userName].mailNickname,
      ),
      {
        groupObjectId: k8sManifestsAdminsGroup.objectId,
        memberObjectId: azureUsers[userName].objectId,
      },
      { provider: azureadProvider },
    ),
  ]),
);

export const k8sManifestsAdminRoleAssignment =
  new azure.authorization.RoleAssignment(
    getRoleAssignmentResourceName(
      "k8s-manifests-admins",
      "managed-cluster",
      "k8s-manifests",
      "admin",
    ),
    {
      principalId: k8sManifestsAdminsGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AKS_RBAC_ROLE_IDS.admin,
      ),
      scope: k8sManifestsCluster.id,
    },
    { provider },
  );
