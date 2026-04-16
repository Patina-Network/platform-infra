export const AKS_RBAC_ROLE_IDS = {
  /**
   * Azure Kubernetes Service RBAC reader
   *
   * Allows read-only access to see most objects in a namespace. It does not allow viewing roles or role bindings. This role does not allow viewing Secrets, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation). Applying this role at cluster scope will give access across all namespaces.
   */
  reader: "7f6c6a51-bcf8-42ba-9220-52d62157d7db",
} as const;
