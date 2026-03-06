import { request } from '../../utils/fetcher';
import {
  ScanPayload,
  ScanStatusResponse,
  ScanService,
  ActiveScansResponse,
  RequestScanResponse,
  InternetScanResponse,
  ListProtocolsResponse,
  ListPortsResponse,
} from '../../types/scan';

export const buildScanningMethods = (baseUrl: string, apiKey: string) => ({
  /**
   * This method returns a list of port numbers that the crawlers are looking for.
   */
  listPorts: async (): Promise<ListPortsResponse> => {
    return await request(baseUrl, 'shodan/ports', apiKey);
  },

  /**
   * This method returns an object containing all the protocols that can be used when launching an Internet scan.
   */
  listProtocols: async (): Promise<ListProtocolsResponse> => {
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
  requestScan: async (targets: ScanPayload): Promise<RequestScanResponse> => {
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

  /**
   * RESTRICTED ENDPOINT: Crawl the Internet for a specific port and protocol.
   *
   * @remarks
   * This method is restricted to security researchers and companies with a Shodan Enterprise Data license.
   * To apply for access to this method as a researcher, please email jmath@shodan.io with information about your project.
   * Access is restricted to prevent abuse.
   *
   * @param port - The port that Shodan should crawl the Internet for.
   * @param protocol - The name of the protocol that should be used to interrogate the port. See /shodan/protocols for a list of supported protocols.
   */
  scanInternet: async (port: number, protocol: string): Promise<InternetScanResponse> => {
    return await request(baseUrl, 'shodan/scan/internet', apiKey, {
      method: 'POST',
      body: { port: port, protocol: protocol },
    });
  },

  /**
   * Returns a listing of all the on-demand scans that are currently active on the account.
   */
  getScans: async (): Promise<ActiveScansResponse> => {
    return await request(baseUrl, 'shodan/scans', apiKey);
  },

  /**
   * Get the status of a scan request.
   * @param scanId - The unique scan ID that was returned by /shodan/scan.
   */
  getScan: async (scanId: string): Promise<ScanStatusResponse> => {
    return await request(baseUrl, `shodan/scan/${scanId}`, apiKey);
  },
});
