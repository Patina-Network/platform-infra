import * as azure from "@pulumi/azure-native";
import * as azuread from "@pulumi/azuread";

import { k8sManifestsCluster } from "@/azure/clusters";
import { AKS_RBAC_ROLE_IDS } from "@/azure/clusters/rbac/const";
import {
  AKS_CLUSTER_READER_USERS,
  AKS_CLUSTER_WRITER_USERS,
} from "@/azure/clusters/rbac/inputs";
import { azureadProvider, provider } from "@/azure/provider";
import { azureUsers } from "@/azure/users";
import { AZURE_USERS } from "@/azure/users/inputs";
import { env } from "@/env";

const getRoleDefinitionId = (subscriptionId: string, roleId: string) =>
  `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleId}`;

export const k8sManifestsReadersGroup = new azuread.Group(
  "k8s-manifests-readers-group",
  {
    displayName: "k8s-manifests-readers",
    mailEnabled: false,
    securityEnabled: true,
  },
  {
    provider: azureadProvider,
  },
);

export const k8sManifestsReaderGroupMembers = Object.fromEntries(
  AKS_CLUSTER_READER_USERS.map((userName) => [
    userName,
    new azuread.GroupMember(
      `k8s-manifests-reader-${AZURE_USERS[userName].mailNickname}`,
      {
        groupObjectId: k8sManifestsReadersGroup.objectId,
        memberObjectId: azureUsers[userName].objectId,
      },
      {
        provider: azureadProvider,
      },
    ),
  ]),
);

export const k8sManifestsReaderRoleAssignment =
  new azure.authorization.RoleAssignment(
    "k8s-manifests-reader-role-assignment",
    {
      principalId: k8sManifestsReadersGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AKS_RBAC_ROLE_IDS.reader,
      ),
      scope: k8sManifestsCluster.id,
    },
    {
      provider,
    },
  );

export const k8sManifestsReaderClusterUserRoleAssignment =
  new azure.authorization.RoleAssignment(
    "k8s-manifests-reader-cluster-user-role-assignment",
    {
      principalId: k8sManifestsReadersGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AKS_RBAC_ROLE_IDS.clusterUser,
      ),
      scope: k8sManifestsCluster.id,
    },
    {
      provider,
    },
  );

export const k8sManifestsWritersGroup = new azuread.Group(
  "k8s-manifests-writers-group",
  {
    displayName: "k8s-manifests-writers",
    mailEnabled: false,
    securityEnabled: true,
  },
  {
    provider: azureadProvider,
  },
);

export const k8sManifestsWriterGroupMembers = Object.fromEntries(
  AKS_CLUSTER_WRITER_USERS.map((userName) => [
    userName,
    new azuread.GroupMember(
      `k8s-manifests-writer-${AZURE_USERS[userName].mailNickname}`,
      {
        groupObjectId: k8sManifestsWritersGroup.objectId,
        memberObjectId: azureUsers[userName].objectId,
      },
      {
        provider: azureadProvider,
      },
    ),
  ]),
);

export const k8sManifestsWriterRoleAssignment =
  new azure.authorization.RoleAssignment(
    "k8s-manifests-writer-role-assignment",
    {
      principalId: k8sManifestsWritersGroup.objectId,
      principalType: azure.authorization.PrincipalType.Group,
      roleDefinitionId: getRoleDefinitionId(
        env.azure.subscriptionId,
        AKS_RBAC_ROLE_IDS.writer,
      ),
      scope: k8sManifestsCluster.id,
    },
    {
      provider,
    },
  );
