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
import { ShodanClientOptions, ShodanRequestOptions } from '../../types/options';

export const buildScanningMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * This method returns a list of port numbers that the crawlers are looking for.
   * @param options - Optional configuration for this request.
   */
  listPorts: async (options?: ShodanRequestOptions): Promise<ListPortsResponse> => {
    return request(baseUrl, 'shodan/ports', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * This method returns an object containing all the protocols that can be used when launching an Internet scan.
   * @param options - Optional configuration for this request.
   */
  listProtocols: async (options?: ShodanRequestOptions): Promise<ListProtocolsResponse> => {
    return request(baseUrl, 'shodan/protocols', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Request Shodan to crawl an IP, netblock, or specific services.
   * Consumes 1 API scan credit per IP.
   * @param targets - The targets to scan. This can be:
   * 1. A comma-separated string of IPs or netblocks (e.g., "8.8.8.8,1.1.1.1").
   * 2. An array of IP strings (e.g., ["8.8.8.8", "1.1.1.1"]).
   * 3. An object mapping IPs to specific services to scan, bypassing the default scan
   * (e.g., { "1.1.1.1": [[443, "https"], [53, "dns-udp"]] }).
   * @param options - Optional configuration for this request.
   */
  requestScan: async (
    targets: ScanPayload,
    options?: ShodanRequestOptions,
  ): Promise<RequestScanResponse> => {
    let ipsPayload: string | Record<string, ScanService[]>;

    if (Array.isArray(targets)) {
      ipsPayload = targets.join(',');
    } else if (typeof targets === 'string') {
      ipsPayload = targets;
    } else {
      ipsPayload = targets;
    }
    return request(baseUrl, 'shodan/scan', apiKey, {
      method: 'POST',
      body: { ips: ipsPayload },
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
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
   * @param options - Optional configuration for this request.
   */
  scanInternet: async (
    port: number,
    protocol: string,
    options?: ShodanRequestOptions,
  ): Promise<InternetScanResponse> => {
    return request(baseUrl, 'shodan/scan/internet', apiKey, {
      method: 'POST',
      body: { port: port, protocol: protocol },
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Returns a listing of all the on-demand scans that are currently active on the account.
   * @param options - Optional configuration for this request.
   */
  getScans: async (options?: ShodanRequestOptions): Promise<ActiveScansResponse> => {
    return request(baseUrl, 'shodan/scans', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Get the status of a scan request.
   * @param scanId - The unique scan ID that was returned by /shodan/scan.
   * @param options - Optional configuration for this request.
   */
  getScan: async (scanId: string, options?: ShodanRequestOptions): Promise<ScanStatusResponse> => {
    return request(baseUrl, `shodan/scan/${scanId}`, apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
});
