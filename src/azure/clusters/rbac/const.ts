export const AKS_RBAC_ROLE_IDS = {
  /**
   * Azure Kubernetes Service Cluster User Role
   *
   * Allows fetching user credentials for the cluster.
   */
  clusterUser: "4abbcc35-e782-43d8-92c5-2d3f1bd2253f",
  /**
   * Azure Kubernetes Service RBAC reader
   *
   * Allows read-only access to see most objects in a namespace. It does not allow viewing roles or role bindings. This role does not allow viewing Secrets, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation). Applying this role at cluster scope will give access across all namespaces.
   */
  reader: "7f6c6a51-bcf8-42ba-9220-52d62157d7db",
  /**
   * Azure Kubernetes Service RBAC Writer
   *
   * Allows read/write access to most objects in a namespace.
   */
  writer: "a7ffa36f-339b-4b5c-8bdf-e2c188b2c0eb",
} as const;
