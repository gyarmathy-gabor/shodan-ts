import { request } from '../../utils/fetcher';

export const buildDnsMethods = (baseUrl: string, apiKey: string) => ({
  /**
   * Get all the subdomains and other DNS entries for the given domain. Uses 1 query credit per lookup.
   * @param hostname - The target domain name to query (e.g., 'example.com' or 'api.example.com').
   */
  dnsInfo: async (hostname: string) => {
    const endpoint = `dns/domain/${hostname}`;
    return await request(baseUrl, endpoint, apiKey);
  },
  /**
   * Look up the IP address for the provided list of hostnames.
   * @param hostnames - A single hostname string or an array of hostnames to resolve.
   */
  dnsResolve: async (hostnames: string[] | string) => {
    const hosts: string = Array.isArray(hostnames) ? hostnames.join(',') : hostnames;
    return await request(baseUrl, 'dns/resolve', apiKey, { params: { hostnames: hosts } });
  },
  /**
   * Look up the hostnames that have been defined for the given list of IP addresses.
   * @param ipAddresses - A single IPv4/IPv6 address or an array of IP addresses.
   */
  dnsReverse: async (ipAddresses: string[] | string) => {
    const ips: string = Array.isArray(ipAddresses) ? ipAddresses.join(',') : ipAddresses;
    return await request(baseUrl, 'dns/reverse', apiKey, { params: { ips: ips } });
  },
});
