import { request } from '../../utils/fetcher';
import { ShodanClientOptions, ShodanRequestOptions } from '../../types/options';

export const buildDnsMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * Get all the subdomains and other DNS entries for the given domain. Uses 1 query credit per lookup.
   * @param hostname - The target domain name to query (e.g., 'example.com' or 'api.example.com').
   * @param options - Optional configuration for this request.
   */
  dnsInfo: async (hostname: string, options?: ShodanRequestOptions) => {
    const endpoint = `dns/domain/${hostname}`;
    return request(baseUrl, endpoint, apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
  /**
   * Look up the IP address for the provided list of hostnames.
   * @param hostnames - A single hostname string or an array of hostnames to resolve.
   * @param options - Optional configuration for this request.
   */
  dnsResolve: async (hostnames: string[] | string, options?: ShodanRequestOptions) => {
    const hosts: string = Array.isArray(hostnames) ? hostnames.join(',') : hostnames;
    return request(baseUrl, 'dns/resolve', apiKey, {
      params: { hostnames: hosts },
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
  /**
   * Look up the hostnames that have been defined for the given list of IP addresses.
   * @param ipAddresses - A single IPv4/IPv6 address or an array of IP addresses.
   * @param options - Optional configuration for this request.
   */
  dnsReverse: async (ipAddresses: string[] | string, options?: ShodanRequestOptions) => {
    const ips: string = Array.isArray(ipAddresses) ? ipAddresses.join(',') : ipAddresses;
    return request(baseUrl, 'dns/reverse', apiKey, {
      params: { ips: ips },
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
});
