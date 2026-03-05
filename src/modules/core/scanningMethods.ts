import { request } from '../../utils/fetcher';
import { ScanPayload, ScanResponse, ScanService } from '../../types/scan';

export const buildScanningMethods = (baseUrl: string, apiKey: string) => ({
  /**
   * This method returns a list of port numbers that the crawlers are looking for.
   */
  listPorts: async () => {
    return await request(baseUrl, 'shodan/ports', apiKey);
  },
  /**
   * This method returns an object containing all the protocols that can be used when launching an Internet scan.
   */
  listProtocols: async () => {
    return await request(baseUrl, 'shodan/protocols', apiKey);
  },
  /**
   * Request Shodan to crawl an IP, netblock, or specific services.
   * Consumes 1 API scan credit per IP.
   * @param targets - The targets to scan. This can be:
   * 1. A comma-separated string of IPs or netblocks (e.g., "8.8.8.8,1.1.1.1").
   * 2. An array of IP strings (e.g., ["8.8.8.8", "1.1.1.1"]).
   * 3. An object mapping IPs to specific services to scan, bypassing the default scan
   * (e.g., { "1.1.1.1": [[443, "https"], [53, "dns-udp"]] }).
   */
  requestScan: async (targets: ScanPayload): Promise<ScanResponse> => {
    let ipsPayload: string | Record<string, ScanService[]>;

    if (Array.isArray(targets)) {
      ipsPayload = targets.join(',');
    } else if (typeof targets === 'string') {
      ipsPayload = targets;
    } else {
      ipsPayload = targets;
    }
    return await request(baseUrl, 'shodan/scan', apiKey, {
      method: 'POST',
      body: { ips: ipsPayload },
    });
  },
});
