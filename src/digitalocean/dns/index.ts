import type { Replace } from "type-fest";

import * as digitalocean from "@pulumi/digitalocean";
import { createHash } from "node:crypto";

import { RECORDS, ROOT, type DnsType } from "@/digitalocean/dns/inputs";
import { provider } from "@/digitalocean/provider";

// TODO: @tahminator - clean this up

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

// avoid duplicates (pulumi requires unique names, but they must be relatively consistent)
const getDnsRecordDiscriminator = (key: string, value: string) =>
  // 8 chars is safe slice
  // gives 16^8 = 4,294,967,296 possible combinations
  createHash("sha256").update(`${key}:${value}`).digest("hex").slice(0, 8);

// type hack to fix Object.groupBy thinking that the V attached to the K
// is not null. see call site to see why.
function isDefinedEntry<K, V>(entry: [K, V]): entry is [K, NonNullable<V>] {
  return entry[1] !== undefined && entry[1] !== null;
}

// e.g. output
// stg-patchats-patinanetwork-org-A
// patinanetwork-org-TXT
const getDnsRecordResourceName = <
  TDomainString extends keyof typeof RECORDS,
  // TODO: Use full generic extension for valid hostnames instead of just string
  THostnameString extends string,
  TRecordTypeString extends DnsType,
>(
  domain: TDomainString,
  hostname: THostnameString,
  type: TRecordTypeString,
) => `${toKebabCase(getFqdn(domain, hostname))}-${type}` as const;

export const digitaloceanDnsRecordMap = (() => {
  const groupedRecordsArray = Object.entries(RECORDS).flatMap(
    ([domain, recordsMap]) => {
      return Object.entries(recordsMap).flatMap(([type, records]) => {
        return records.map((record) => {
          const resourceName = getDnsRecordResourceName(
            domain,
            record.name,
            type,
          );
          const discriminator = getDnsRecordDiscriminator(
            record.name,
            record.value,
          );

          const dnsRecord = new digitalocean.DnsRecord(
            `${resourceName}-${discriminator}`,
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
          );

          return { resourceName, dnsRecord };
        });
      });
    },
  );

  // Record<ResourceName, { resourceName: ResourceName; dnsRecord: DnsRecord }[]>
  const groupedRecords = Object.groupBy(groupedRecordsArray, (item) => {
    return item.resourceName;
  });

  return Object.fromEntries(
    Object.entries(groupedRecords)
      .filter((entry): entry is NonNullable<typeof entry> => !!entry)
      // we cannot narrow entry[0] due to TypeScript generic quirks (TypeScript no longer
      // can determine that some T1 can be matched to the right T2 in Tuple<T1, T2>
      // [because T1 represents union of all types in slot 0 & T2 represents union of all types in slot 1])
      //
      // if we try to side step this with a generic instead of an explicit lambda in `.filter`,
      // we can correctly get TypeScript to focus on a specific section of the type
      // and avoid `DnsRecord[] | undefined` from the final type.
      .filter((entry) => isDefinedEntry(entry))
      .map(([resourceName, objs]) => [
        resourceName,
        objs.map((o) => o.dnsRecord),
      ]),
  );
})();
