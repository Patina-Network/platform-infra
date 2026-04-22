export const AZURE_STORAGE_RBAC_ROLE_IDS = {
  /**
   * Storage Blob Data Reader
   *
   * Allows read access to blob data.
   */
  reader: "2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
  /**
   * Storage Blob Data Contributor
   *
   * Allows read, write, and delete access to blob data.
   */
  writer: "ba92f5b4-2d11-453d-a403-e96b0029c9fe",
} as const;
