import * as headscale from "@pulumi/headscale";
import * as pulumi from "@pulumi/pulumi";

import { provider } from "@/headscale/provider";
import { headscaleMachineUsers, headscaleUsers } from "@/headscale/users";

const toMachineUserGroupMember = (name: pulumi.Input<string>) =>
  pulumi.interpolate`${name}@`;

// https://tailscale.com/docs/reference/syntax/policy-file
const policy = pulumi.jsonStringify({
  groups: {
    ["group:consumers"]: [
      ...Object.values(headscaleUsers).map((user) => user.email),
      toMachineUserGroupMember(headscaleMachineUsers["global-cicd"].name),
    ],
    ["group:cluster"]: [
      toMachineUserGroupMember(headscaleMachineUsers["vpn-infra"].name),
    ],
  },
  acls: [
    {
      action: "accept",
      src: ["group:consumers"],
      dst: [`group:cluster:*`],
    },
    {
      action: "accept",
      src: ["group:cluster"],
      dst: [`group:consumers:*`],
    },
  ],
});

export const headscalePolicy = new headscale.Policy(
  "headscale-policy",
  {
    policy,
  },
  { provider },
);
