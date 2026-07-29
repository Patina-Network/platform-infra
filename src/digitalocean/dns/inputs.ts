export type DnsType = "A" | "CNAME" | "SOA" | "TXT";

export type DnsRecord = {
  name: string;
  ttl?: number;
  type: DnsType;
  value: string;
};

const K8S_IP_ADDR = "20.127.117.204" as const;

export const RECORDS = [
  {
    name: "gerrit.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 1800,
  },
  {
    name: "stg.patchats.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 3600,
  },
  {
    name: "patchats.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 3600,
  },
  {
    name: "codebloom.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 1800,
  },
  {
    name: "stg.codebloom.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 1800,
  },
  {
    name: "redis.k8s.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 1800,
  },
  {
    name: "_dmarc.patinanetwork.org",
    type: "TXT",
    value: "v=DMARC1; p=reject",
    ttl: 3600,
  },
  {
    name: "patinanetwork.org",
    type: "TXT",
    value:
      "google-site-verification=pdlc7KgCKoujU77ylEWBIBfAgVCM1XKUIYfAJEV-94w",
    ttl: 3600,
  },
  {
    name: "grafana.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 1800,
  },
  {
    name: "production.k8s.codebloom.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 1800,
  },
  {
    name: "staging.k8s.codebloom.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 1800,
  },
  {
    name: "db.k8s.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 1800,
  },
  {
    name: "k8s.codebloom.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 1800,
  },
  {
    name: "stg.k8s.codebloom.patinanetwork.org",
    type: "A",
    value: K8S_IP_ADDR,
    ttl: 1800,
  },
  {
    name: "_gh-patina-network-o.patinanetwork.org",
    type: "TXT",
    value: "7288a89d92",
    ttl: 3600,
  },
  {
    name: "www.patinanetwork.org",
    type: "CNAME",
    value: "sites.framer.app",
    ttl: 1800,
  },
  { name: "patinanetwork.org", type: "A", value: "31.43.161.6", ttl: 3600 },
  { name: "patinanetwork.org", type: "A", value: "31.43.160.6", ttl: 3600 },
  {
    name: "gb-bounces.patinanetwork.org",
    type: "CNAME",
    value: "pm.mtasv.net",
    ttl: 43200,
  },
  {
    name: "20250710202314pm._domainkey.patinanetwork.org",
    type: "TXT",
    value:
      "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCVthxAcjPURrrzqIbDDKynFPHks+4prGiQorgh8ER8cEIKD7goMFc4ppkGYBvwO8oGG92XYI17tWMIEJld8uViBKW5T38vmNeGV3swP3HIWTcsBLni2438miSsZicXwN+wKHg1IDvgLCi5UvvpghM0Nb/E3XZs+q92Ada5pz8MHwIDAQAB",
    ttl: 3600,
  },
  {
    name: "patinanetwork.org",
    type: "TXT",
    value:
      "google-site-verification=WyezXUc1re_sfrSpxapoWirIfM-PESmOPQNNgK5twD8",
    ttl: 3600,
  },
  {
    name: "patinanetwork.org",
    type: "TXT",
    value: "v=spf1 include:mailgun.org include:_spf.google.com ~all",
    ttl: 3600,
  },
  {
    name: "mx._domainkey.patinanetwork.org",
    type: "TXT",
    value:
      "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGV+Hg2+QM/rAZrvMnJgrP+KvPCLgUj/yPzXfNMcOGljlryp+8SWnko1CgcLpm+hoib4GlwkJamLfKsFsPXw05H2JQ35K9Q7+ycs9XKsmW8SEoLOp+wdTb04cp3BZlfJ+c/+OWTWVc7s2wGJm8wLIP1uudOv7mXKo9s6NJlKPNEQIDAQAB",
    ttl: 3600,
  },
] as const satisfies readonly DnsRecord[];
