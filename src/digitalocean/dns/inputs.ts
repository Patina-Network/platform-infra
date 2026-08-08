export type DnsType = "A" | "CNAME" | "SOA" | "TXT";

export type DnsRecordInput = {
  name: string;
  ttl?: number;
  value: string;
};

export const ROOT = "@";

const K8S_IP_ADDR = "20.127.117.204" as const;

export const RECORDS = {
  "patinanetwork.org": {
    A: [
      { name: "gerrit", value: K8S_IP_ADDR, ttl: 1800 },
      { name: "stg.patchats", value: K8S_IP_ADDR, ttl: 3600 },
      { name: "patchats", value: K8S_IP_ADDR, ttl: 3600 },
      { name: "codebloom", value: K8S_IP_ADDR, ttl: 1800 },
      { name: "stg.codebloom", value: K8S_IP_ADDR, ttl: 1800 },
      { name: "redis.k8s", value: K8S_IP_ADDR, ttl: 1800 },
      { name: "grafana", value: K8S_IP_ADDR, ttl: 1800 },
      { name: "production.k8s.codebloom", value: K8S_IP_ADDR, ttl: 1800 },
      { name: "staging.k8s.codebloom", value: K8S_IP_ADDR, ttl: 1800 },
      { name: "db.k8s", value: K8S_IP_ADDR, ttl: 1800 },
      { name: "k8s.codebloom", value: K8S_IP_ADDR, ttl: 1800 },
      { name: "stg.k8s.codebloom", value: K8S_IP_ADDR, ttl: 1800 },
      { name: ROOT, value: "31.43.161.6", ttl: 3600 },
      { name: ROOT, value: "31.43.160.6", ttl: 3600 },
    ],
    CNAME: [
      { name: "www", value: "sites.framer.app", ttl: 1800 },
      { name: "gb-bounces", value: "pm.mtasv.net", ttl: 43200 },
    ],
    TXT: [
      {
        // used for email authenticity
        name: "_dmarc",
        value: "v=DMARC1; p=reject",
        ttl: 3600,
      },
      {
        // Google Search Console domain verification
        name: ROOT,
        value:
          "google-site-verification=pdlc7KgCKoujU77ylEWBIBfAgVCM1XKUIYfAJEV-94w",
        ttl: 3600,
      },
      {
        // GitHub organization domain verification
        name: "_gh-patina-network-o",
        value: "7288a89d92",
        ttl: 3600,
      },
      {
        // used for email authenticity
        name: "20250710202314pm._domainkey",
        value:
          "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCVthxAcjPURrrzqIbDDKynFPHks+4prGiQorgh8ER8cEIKD7goMFc4ppkGYBvwO8oGG92XYI17tWMIEJld8uViBKW5T38vmNeGV3swP3HIWTcsBLni2438miSsZicXwN+wKHg1IDvgLCi5UvvpghM0Nb/E3XZs+q92Ada5pz8MHwIDAQAB",
        ttl: 3600,
      },
      {
        // Google Search Console domain verification
        name: ROOT,
        value:
          "google-site-verification=WyezXUc1re_sfrSpxapoWirIfM-PESmOPQNNgK5twD8",
        ttl: 3600,
      },
      {
        // used for email authenticity
        name: ROOT,
        value: "v=spf1 include:mailgun.org include:_spf.google.com ~all",
        ttl: 3600,
      },
      {
        // used for email authenticity
        name: "mx._domainkey",
        value:
          "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGV+Hg2+QM/rAZrvMnJgrP+KvPCLgUj/yPzXfNMcOGljlryp+8SWnko1CgcLpm+hoib4GlwkJamLfKsFsPXw05H2JQ35K9Q7+ycs9XKsmW8SEoLOp+wdTb04cp3BZlfJ+c/+OWTWVc7s2wGJm8wLIP1uudOv7mXKo9s6NJlKPNEQIDAQAB",
        ttl: 3600,
      },
    ],
  },
} as const satisfies Record<
  string,
  Partial<Record<DnsType, readonly DnsRecordInput[]>>
>;
