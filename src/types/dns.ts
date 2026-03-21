export interface DnsEntry {
  /** The specific subdomain (e.g., "www" or empty string for root). */
  subdomain: string;

  /** The type of DNS record (A, MX, CNAME, etc.). */
  type: string;

  /** The value/target of the record. */
  value: string;

  /** ISO timestamp of when this record was last indexed. */
  last_seen: string;
}

/**
 * Detailed DNS information for a domain.
 */
export interface DnsInfoResponse {
  /** The requested domain name. */
  domain: string;

  /** List of tags associated with the domain (e.g., "ipv6"). */
  tags: string[];

  /** Detailed list of specific DNS records. */
  data: DnsEntry[];

  /** A flat list of all discovered subdomains. */
  subdomains: string[];

  /** Whether there are more results available. */
  more: boolean;
}

/**
 * Maps hostnames to their resolved IP addresses.
 * Values can be null if the hostname could not be resolved.
 */
export type DnsResolveResponse = Record<string, string | null>;

/**
 * Maps IP addresses to their associated hostnames.
 */
export type DnsReverseResponse = Record<string, string[] | null>;
