export type ScanService = [number, string];

export type ScanPayload = string | string[] | Record<string, ScanService[]>;

export interface ScanResponse {
  count: number;
  id: string;
  credits_left: number;
}
