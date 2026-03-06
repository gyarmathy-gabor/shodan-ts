export interface HostInformationOptions {
  history?: boolean;
  minify?: boolean;
}

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
export interface ShodanService {
  ip: number;
  ip_str: string;
  port: number;
  transport: string | null;
  timestamp: string | null;
  data: string | null;
  hash: number | null;
  asn: string | null;
  isp: string | null;
  org: string | null;
  domains: string[];
  hostnames: string[];
  location: ShodanLocation;
  _shodan: unknown;
  [key: string]: unknown;
}

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
  data: ShodanService[];
  [key: string]: unknown; //Catch-all for any additional properties
}
