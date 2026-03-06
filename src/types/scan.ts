/**
 * Represents a tuple containing a port number and protocol string.
 * To get the current list of supported protocols, use `listProtocols`.
 */
export type ScanService = [number, string];

/**
 * The target payload for requesting a new Shodan scan.
 * - Can be a comma-separated string of IPs or netblocks (e.g., "8.8.8.8,1.1.1.1"),
 * - an array of IP strings (e.g., ["8.8.8.8", "1.1.1.1"]),
 * - or an object mapping IPs to specific services to scan (e.g., { "1.1.1.1": [[443, "https"], [53, "dns-udp"]] }).
 */
export type ScanPayload = string | string[] | Record<string, ScanService[]>;

/**
 * The current status of a scan.
 */
export type ScanStatus = 'SUBMITTING' | 'QUEUE' | 'PROCESSING' | 'DONE';

/**
 * The response returned after successfully requesting a new scan via `requestScan`.
 */
export interface RequestScanResponse {
  count: number;
  id: string;
  credits_left: number;
}

/**
 * A list of protocols that can be used when launching a scan.
 */
export type ListProtocolsResponse = Record<string, string>;

/**
 * A list of port numbers that the Shodan crawlers are looking for.
 */
export type ListPortsResponse = number[];

/**
 * Represents an individual active scan currently on the account.
 */
export interface ActiveScan {
  status: ScanStatus;
  id: string;
  created: string;
  status_check: string;
  api_key: string;
  size: number;
  credits_left: number;
}

/**
 * The response returned when launching an Internet scan via `scanInternet`.
 */
export interface InternetScanResponse {
  id: string;
}

/**
 * The response returned when querying all active on-demand scans via `getScans`.
 */
export interface ActiveScansResponse {
  matches: ActiveScan[];
  total: number;
}

/**
 * The response returned when querying the status of a scan via `getScan`.
 */
export interface ScanStatusResponse {
  count: number;
  status: ScanStatus;
  id: string;
  created: string;
}
