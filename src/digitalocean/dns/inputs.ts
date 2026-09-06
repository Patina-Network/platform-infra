export type DnsType = "A" | "CNAME" | "SOA" | "TXT";

export type DnsRecordInput = {
  bootstrapId?: number;
  name: string;
  ttl?: number;
  value: string;
};

export const ROOT = "@";

const K8S_IP_ADDR = "20.127.117.204" as const;

export const RECORDS = {
  "patinanetwork.org": {
    A: [
      // {
      //   bootstrapId: 1824470027,
      //   name: "gerrit",
      //   value: K8S_IP_ADDR,
      //   ttl: 1800,
      // },
      {
        bootstrapId: 1823138069,
        name: "stg.patchats",
        value: K8S_IP_ADDR,
        ttl: 3600,
      },
      {
        bootstrapId: 1823138018,
        name: "patchats",
        value: K8S_IP_ADDR,
        ttl: 3600,
      },
    //   {
    //     bootstrapId: 1817054900,
    //     name: "codebloom",
    //     value: K8S_IP_ADDR,
    //     ttl: 1800,
    //   },
    //   {
    //     bootstrapId: 1817052577,
    //     name: "stg.codebloom",
    //     value: K8S_IP_ADDR,
    //     ttl: 1800,
    //   },
    //   {
    //     bootstrapId: 1816958860,
    //     name: "redis.k8s",
    //     value: K8S_IP_ADDR,
    //     ttl: 1800,
    //   },
    //   {
    //     bootstrapId: 1815864905,
    //     name: "grafana",
    //     value: K8S_IP_ADDR,
    //     ttl: 1800,
    //   },
    //   {
    //     bootstrapId: 1815657393,
    //     name: "production.k8s.codebloom",
    //     value: K8S_IP_ADDR,
    //     ttl: 1800,
    //   },
    //   {
    //     bootstrapId: 1815657172,
    //     name: "staging.k8s.codebloom",
    //     value: K8S_IP_ADDR,
    //     ttl: 1800,
    //   },
    //   {
    //     bootstrapId: 1815538560,
    //     name: "db.k8s",
    //     value: K8S_IP_ADDR,
    //     ttl: 1800,
    //   },
    //   {
    //     bootstrapId: 1815478721,
    //     name: "k8s.codebloom",
    //     value: K8S_IP_ADDR,
    //     ttl: 1800,
    //   },
    //   {
    //     bootstrapId: 1814324580,
    //     name: "stg.k8s.codebloom",
    //     value: K8S_IP_ADDR,
    //     ttl: 1800,
    //   },
    //   { bootstrapId: 1790438940, name: ROOT, value: "31.43.161.6", ttl: 3600 },
    //   { bootstrapId: 1790438925, name: ROOT, value: "31.43.160.6", ttl: 3600 },
    // ],
    // CNAME: [
    //   {
    //     bootstrapId: 1790730528,
    //     name: "www",
    //     value: "sites.framer.app",
    //     ttl: 1800,
    //   },
    //   {
    //     bootstrapId: 1785343407,
    //     name: "gb-bounces",
    //     value: "pm.mtasv.net",
    //     ttl: 43200,
    //   },
    // ],
    // TXT: [
    //   {
    //     bootstrapId: 1816751902,
    //     // used for email authenticity
    //     name: "_dmarc",
    //     value: "v=DMARC1; p=reject",
    //     ttl: 3600,
    //   },
    //   {
    //     bootstrapId: 1816749498,
    //     // Google Search Console domain verification
    //     name: ROOT,
    //     value:
    //       "google-site-verification=pdlc7KgCKoujU77ylEWBIBfAgVCM1XKUIYfAJEV-94w",
    //     ttl: 3600,
    //   },
    //   {
    //     bootstrapId: 1810800193,
    //     // GitHub organization domain verification
    //     name: "_gh-patina-network-o",
    //     value: "7288a89d92",
    //     ttl: 3600,
    //   },
    //   {
    //     bootstrapId: 1785340947,
    //     // used for email authenticity
    //     name: "20250710202314pm._domainkey",
    //     value:
    //       "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCVthxAcjPURrrzqIbDDKynFPHks+4prGiQorgh8ER8cEIKD7goMFc4ppkGYBvwO8oGG92XYI17tWMIEJld8uViBKW5T38vmNeGV3swP3HIWTcsBLni2438miSsZicXwN+wKHg1IDvgLCi5UvvpghM0Nb/E3XZs+q92Ada5pz8MHwIDAQAB",
    //     ttl: 3600,
    //   },
    //   {
    //     bootstrapId: 1750483664,
    //     // Google Search Console domain verification
    //     name: ROOT,
    //     value:
    //       "google-site-verification=WyezXUc1re_sfrSpxapoWirIfM-PESmOPQNNgK5twD8",
    //     ttl: 3600,
    //   },
    //   {
    //     bootstrapId: 1746552430,
    //     // used for email authenticity
    //     name: ROOT,
    //     value: "v=spf1 include:mailgun.org include:_spf.google.com ~all",
    //     ttl: 3600,
    //   },
    //   {
    //     bootstrapId: 1746552401,
    //     // used for email authenticity
    //     name: "mx._domainkey",
    //     value:
    //       "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGV+Hg2+QM/rAZrvMnJgrP+KvPCLgUj/yPzXfNMcOGljlryp+8SWnko1CgcLpm+hoib4GlwkJamLfKsFsPXw05H2JQ35K9Q7+ycs9XKsmW8SEoLOp+wdTb04cp3BZlfJ+c/+OWTWVc7s2wGJm8wLIP1uudOv7mXKo9s6NJlKPNEQIDAQAB",
    //     ttl: 3600,
    //   },
    ],
  },
} as const satisfies Record<
  string,
  Partial<Record<DnsType, readonly DnsRecordInput[]>>
>;
