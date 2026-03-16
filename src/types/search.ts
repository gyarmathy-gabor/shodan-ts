/**
 * Geographic and location information associated with a Shodan host.
 */
export interface ShodanLocation {
  city: string | null;
  region_code: string | null;
  area_code: number | null;
  longitude: number | null;
  country_code3: string | null;
  country_name: string | null;
  postal_code: string | null;
  dma_code: number | null;
  country_code: string | null;
  latitude: number | null;
}

/**
 * Detailed information about a specific vulnerability (CVE).
 */
export interface ShodanVulnerability {
  /**
   * Whether the vulnerability has been verified by Shodan.
   */
  verified: boolean;
  /**
   * A brief description of the vulnerability.
   */
  summary: string;
  /**
   * A list of external URLs for further reading.
   */
  references: string[];
  /**
   * The CVSS score (usually v3).
   */
  cvss: number | null;
  /**
   * The version of the CVSS score used.
   */
  cvss_version?: number | string;
  /**
   * The CVSS v2 score, if available.
   */
  cvss_v2?: number | null;
  /**
   * The Exploit Prediction Scoring System (EPSS) score.
   */
  epss?: number;
  /**
   * The percentile ranking of the EPSS score.
   */
  ranking_epss?: number;
  /**
   * Known Exploited Vulnerabilities (CISA KEV catalog status).
   */
  kev?: boolean;
  /**
   * Name of any associated ransomware campaign.
   */
  ransomware_campaign?: string;
}

/**
 * Represents a single service or banner found on a specific port for a host.
 * Depending on the service type (HTTP, SSH, SSL, etc.), additional properties may be present.
 */
export interface ShodanService {
  ip: number;
  ip_str: string;
  port: number;
  transport: string | null;
  timestamp: string | null;
  /**
   * The actual banner data/response returned by the service.
   */
  data: string | null;
  hash?: number | null;
  asn?: string | null;
  isp?: string | null;
  org?: string | null;
  domains?: string[];
  vulns?: Record<string, ShodanVulnerability>;
  hostnames: string[];
  location: ShodanLocation;
  _shodan: unknown;
  [key: string]: unknown;
}

/**
 * The response returned when querying information about a specific host IP.
 * Contains general information, vulnerabilities, location data, and an array of all services found.
 */
export interface HostInformationResponse {
  ip: number;
  ip_str: string;
  country_code: string | null;
  country_name: string | null;
  region_code: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  area_code: number | null;
  asn: string | null;
  isp: string | null;
  org: string | null;
  os: string | null;
  last_update: string | null;
  tags: string[];
  hostnames: string[];
  domains: string[];
  ports: number[];
  /**
   * An array of potential CVE vulnerabilities associated with the host.
   * @note If no vulnerabilities are inferred, this property is completely omitted from the response.
   */
  vulns?: string[];
  data: ShodanService[];
  [key: string]: unknown; //Catch-all for any additional properties
}

/**
 * The response returned when breaking a Shodan search query into tokens.
 */
export interface SearchTokensResponse {
  /**
   * An object containing the parsed attributes and their values (e.g., { ports: [22] }).
   */
  attributes: Record<string, unknown[]>;

  /**
   * Any errors encountered while parsing the query.
   */
  errors: string[];

  /**
   * The base search string without the specific filters.
   */
  string: string;

  /**
   * An array of the filter names used in the query.
   */
  filters: string[];
}

export interface FacetResultItem {
  count: number;
  value: string | number;
}

/**
 * The response returned when counting the total number of hosts matching a query.
 */
export interface CountHostsResponse {
  total: number;
  matches: never[];
  facets?: Record<string, FacetResultItem[]>;
}

export interface SearchHostsResponse {
  total: number;
  matches: ShodanService[];
  facets?: Record<string, FacetResultItem[]>;
}
