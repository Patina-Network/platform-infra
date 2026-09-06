import type { Replace } from "type-fest";

import * as digitalocean from "@pulumi/digitalocean";

import { RECORDS, ROOT, type DnsType } from "@/digitalocean/dns/inputs";
import { provider } from "@/digitalocean/provider";

type Fqdn<TDomain extends string, THostname extends string> =
  THostname extends typeof ROOT ? TDomain : `${THostname}.${TDomain}`;

const getFqdn = <TDomain extends string, THostname extends string>(
  domain: TDomain,
  hostname: THostname,
) =>
  (hostname === ROOT ? domain : `${hostname}.${domain}`) as Fqdn<
    TDomain,
    THostname
  >;

const toKebabCase = <TString extends string>(value: TString) =>
  value.replaceAll(".", "-") as Replace<TString, ".", "-", { all: true }>;

// e.g. output
// stg-patchats-patinanetwork-org-A
// patinanetwork-org-CNAME
const getDnsRecordResourceName = <
  TDomainString extends string,
  THostnameString extends string,
  TRecordTypeString extends DnsType,
>(
  domain: TDomainString,
  hostname: THostnameString,
  type: TRecordTypeString,
) => `${toKebabCase(getFqdn(domain, hostname))}-${type}` as const;

export const digitaloceanDnsRecordMap = Object.fromEntries(
  Object.entries(RECORDS).flatMap(([domain, typeMap]) =>
    Object.entries(typeMap).flatMap(([type, typedRecords]) =>
      typedRecords.map((record) => {
        const resourceName = getDnsRecordResourceName(
          domain,
          record.name,
          type,
        );

        return [
          resourceName,
          new digitalocean.DnsRecord(
            resourceName,
            {
              domain,
              name: record.name,
              ttl: record.ttl,
              type,
              value: record.value,
            },
            {
              provider,
              import:
                record.bootstrapId === undefined ?
                  undefined
                : `${domain},${record.bootstrapId}`,
            },
          ),
        ] as const;
      }),
    ),
  ),
);
