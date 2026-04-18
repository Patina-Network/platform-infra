export type ResourceGroup = {
  tags: Record<string, string>;
};

type ResourceGroupName = string;

export const RESOURCE_GROUPS = {
  k8s: {
    tags: {},
  },
  "platform-infra": {
    tags: {},
  },
} as const satisfies Record<ResourceGroupName, ResourceGroup>;
