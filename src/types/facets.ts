/**
 * A list of valid properties (facets) that can be used to get summary information for Shodan historical trends.
 */
export type TrendsFacet =
  | 'asn'
  | 'city'
  | 'country'
  | 'domain'
  | 'has_screenshot'
  | 'hash'
  | 'http.component'
  | 'http.component_category'
  | 'http.favicon.hash'
  | 'http.html_hash'
  | 'http.robots_hash'
  | 'http.status'
  | 'http.title'
  | 'http.waf'
  | 'ip'
  | 'isp'
  | 'mongodb.database.name'
  | 'org'
  | 'os'
  | 'port'
  | 'product'
  | 'redis.key'
  | 'region'
  | 'rsync.module'
  | 'screenshot.label'
  | 'ssh.fingerprint'
  | 'ssl.alpn'
  | 'ssl.cert.fingerprint'
  | 'ssl.cert.issuer.cn'
  | 'ssl.cert.serial'
  | 'ssl.cert.subject.cn'
  | 'ssl.ja3s'
  | 'ssl.jarm'
  | 'ssl.version'
  | 'state'
  | 'tag'
  | 'version'
  | 'vuln'
  | 'vuln.verified'
  | (string & {});

/**
 * Represents a trend facet with a specific result count limit.
 * The format is "property:count", where "count" is the number of top items to return (e.g., "port:100").
 */
export type TrendsFacetCount = `${TrendsFacet}:${number}`;

/**
 * The parameter format accepted by Trends methods for facets.
 * Can be a single facet string, a single facet with a count.
 * @example "country"
 * @example "country:100"
 */
export type TrendsFacetValue = TrendsFacet | TrendsFacetCount | (string & {});

/**
 * A list of valid properties (facets) that can be used to get summary information on search results.
 * @Note Visit the Shodan website's Facet Analysis page for an up-to-date list of available facets.
 */
export type SearchFacet =
  | 'asn'
  | 'bitcoin.ip'
  | 'bitcoin.ip_count'
  | 'bitcoin.port'
  | 'bitcoin.user_agent'
  | 'bitcoin.version'
  | 'city'
  | 'cloud.provider'
  | 'cloud.region'
  | 'cloud.service'
  | 'country'
  | 'cpe'
  | 'device'
  | 'domain'
  | 'google_ads'
  | 'google_analytics'
  | 'google_tag_manager'
  | 'has_screenshot'
  | 'hash'
  | 'http.component'
  | 'http.component_category'
  | 'http.dom_hash'
  | 'http.favicon.hash'
  | 'http.headers_hash'
  | 'http.html_hash'
  | 'http.robots_hash'
  | 'http.server_hash'
  | 'http.status'
  | 'http.title'
  | 'http.title_hash'
  | 'http.waf'
  | 'ip'
  | 'isp'
  | 'link'
  | 'meta_pixel'
  | 'mongodb.database.name'
  | 'ntp.ip'
  | 'ntp.ip_count'
  | 'ntp.more'
  | 'ntp.port'
  | 'open_dir.extension'
  | 'open_dir.hash'
  | 'org'
  | 'os'
  | 'port'
  | 'postal'
  | 'product'
  | 'redis.key'
  | 'region'
  | 'rsync.module'
  | 'screenshot.hash'
  | 'screenshot.label'
  | 'snmp.contact'
  | 'snmp.location'
  | 'snmp.name'
  | 'ssh.cipher'
  | 'ssh.fingerprint'
  | 'ssh.hassh'
  | 'ssh.mac'
  | 'ssh.type'
  | 'ssl.alpn'
  | 'ssl.cert.alg'
  | 'ssl.cert.expired'
  | 'ssl.cert.extension'
  | 'ssl.cert.fingerprint'
  | 'ssl.cert.issuer.cn'
  | 'ssl.cert.pubkey.bits'
  | 'ssl.cert.pubkey.type'
  | 'ssl.cert.serial'
  | 'ssl.cert.subject.cn'
  | 'ssl.chain_count'
  | 'ssl.cipher.bits'
  | 'ssl.cipher.name'
  | 'ssl.cipher.version'
  | 'ssl.ja3s'
  | 'ssl.jarm'
  | 'ssl.version'
  | 'state'
  | 'tag'
  | 'telnet.do'
  | 'telnet.dont'
  | 'telnet.option'
  | 'telnet.will'
  | 'telnet.wont'
  | 'tiktok_pixel'
  | 'uptime'
  | 'version'
  | 'vuln'
  | 'vuln.verified'
  | 'x_pixel'
  | (string & {});

/**
 * Represents a search facet with a specific result count limit.
 *
 * The format is "property:count", where "count" is the number of facets to return (e.g., "country:100").
 */
export type SearchFacetCount = `${SearchFacet}:${number}`;

/**
 * A single FacetParam Item (e.g., "country", "country:50")
 */
export type SearchFacetItem = SearchFacet | SearchFacetCount | (string & {});

/**
 * The parameter format accepted by Search methods for facets.
 * Can be a single facet string, a single facet with a count, or an array of either.
 * @example "country"
 * @example "country:100"
 * @example ["country:100", "os", "port:50"]
 */
export type SearchFacetParam = SearchFacetItem | SearchFacetItem[];
