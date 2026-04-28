import { AZURE_USERS } from "@/azure/users/inputs";

/**
 * Any RBAC-compatible input can accept this object in order to provide organization-wide
 * access to a resource.
 *
 * __NOTE: BE VERY CAREFUL WITH THIS. YOU SHOULD ONLY ATTACH THIS TO ANY READERS (unless you have a good reason otherwise).__
 */
export const ALL_AZURE_USERS = Object.entries(AZURE_USERS).map(([k]) => k);
