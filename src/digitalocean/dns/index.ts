import * as digitalocean from "@pulumi/digitalocean";

import { RECORDS, ROOT, type DnsRecordInput } from "@/digitalocean/dns/inputs";
import { provider } from "@/digitalocean/provider";

const getDnsRecordResourceName = (
  domain: string,
  hostname: string,
  type: string,
  index: number,
) => {
  const fqdn = hostname === ROOT ? domain : `${hostname}.${domain}`;
  const base = `${fqdn.replaceAll(".", "-")}-${type}`;
  return index === 0 ? base : `${base}-${index + 1}`;
};

export const digitaloceanDnsRecordMap = Object.fromEntries(
  Object.entries(RECORDS).flatMap(([domain, typeMap]) =>
    Object.entries(typeMap).flatMap(([type, typedRecords]) => {
      const records: readonly DnsRecordInput[] = typedRecords;

      return records.map((record) => {
        const index = records
          .filter((r) => r.name === record.name)
          .indexOf(record);

        const resourceName = getDnsRecordResourceName(
          domain,
          record.name,
          type,
          index,
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
            { provider },
          ),
        ] as const;
      });
    }),
  ),
);
