import * as digitalocean from "@pulumi/digitalocean";

import { RECORDS } from "@/digitalocean/dns/inputs";
import { provider } from "@/digitalocean/provider";

type DigitaloceanDnsRecordMap = Record<string, digitalocean.DnsRecord>;
type DnsRecord = (typeof RECORDS)[number];

const getDnsRecordDomain = (name: string) =>
  name.split(".").slice(-2).join(".");

const getDnsRecordHostname = (name: string) => {
  const domain = getDnsRecordDomain(name);
  return name === domain ? "@" : name.slice(0, -(domain.length + 1));
};

const getDnsRecordResourceName = (record: DnsRecord) => {
  const group = RECORDS.filter(
    (r) => r.name === record.name && r.type === record.type,
  );
  const index = group.indexOf(record);
  const base = `${record.name.replaceAll(".", "-")}-${record.type}`;
  return index === 0 ? base : `${base}-${index + 1}`;
};

export const digitaloceanDnsRecordMap: DigitaloceanDnsRecordMap =
  Object.fromEntries(
    RECORDS.map(
      (record) =>
        [
          `${record.name}-${record.type}-${record.value}`,
          new digitalocean.DnsRecord(
            getDnsRecordResourceName(record),
            {
              domain: getDnsRecordDomain(record.name),
              name: getDnsRecordHostname(record.name),
              ttl: record.ttl,
              type: record.type,
              value: record.value,
            },
            { provider },
          ),
        ] as const,
    ),
  );
