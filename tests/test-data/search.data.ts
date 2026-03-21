import {
  CountHostsResponse,
  HostInformationResponse,
  SearchHostsResponse,
  SearchTokensResponse,
} from '../../src';
import { SearchFacet } from '../../src';
import { SearchFilter } from '../../src';

export const mockHostInformationResponse: HostInformationResponse = {
  region_code: null,
  ip: 134744072,
  country_code: 'US',
  city: null,
  last_update: '2021-01-22T08:49:35.190817',
  latitude: 37.751,
  longitude: -97.822,
  tags: [],
  area_code: null,
  country_name: 'United States',
  hostnames: ['dns.google'],
  domains: ['dns.google'],
  org: 'Google',
  asn: 'AS15169',
  isp: 'Google',
  ip_str: '8.8.8.8',
  os: null,
  ports: [53],
  data: [
    {
      _shodan: {
        id: 'cea5795b-55fd-4595-b9e5-ad5ca847cb4b',
        options: {},
        ptr: true,
        module: 'dns-udp',
        crawler: 'ac284849be0745621b3c518f74c14cf43cafbf08',
      },
      hash: -553166942,
      ip: 134744072,
      isp: 'Google',
      port: 53,
      hostnames: ['dns.google'],
      location: {
        city: null,
        region_code: null,
        area_code: null,
        longitude: -97.822,
        country_code3: null,
        country_name: 'United States',
        postal_code: null,
        dma_code: null,
        country_code: 'US',
        latitude: 37.751,
      },
      timestamp: '2021-01-22T08:49:35.190817',
      domains: ['dns.google'],
      org: 'Google',
      data: '\nRecursion: enabled',
      transport: 'udp',
      ip_str: '8.8.8.8',
    },
  ],
};

export const mockCountHostsResponse: CountHostsResponse = {
  matches: [],
  facets: {
    org: [
      { count: 3012386, value: 'Amazon.com' },
      { count: 1322102, value: 'Google Cloud' },
    ],
    os: [{ count: 601923, value: 'Ubuntu' }],
  },
  total: 19590274,
};

export const mockSearchHostsResponse: SearchHostsResponse = {
  matches: [
    {
      ip: 1616761883,
      port: 443,
      transport: 'tcp',
      ip_str: '96.93.212.27',
      timestamp: '2021-01-25T21:33:49.154513',
      data: 'HTTP/1.1 400 Bad Request\r\nServer: nginx\r\n',
      hostnames: ['three.webapplify.net'],
      location: {
        city: 'Denver',
        region_code: 'CO',
        area_code: null,
        longitude: -104.9078,
        country_code3: null,
        latitude: 39.7301,
        postal_code: null,
        dma_code: 751,
        country_code: 'US',
        country_name: 'United States',
      },
      _shodan: {
        crawler: 'c9b639b99e5410a46f656e1508a68f1e6e5d6f99',
        ptr: true,
        id: '534cc127-e734-44bc-be88-2e219a56a099',
        module: 'auto',
        options: {},
      },
    },
  ],
  facets: {
    country: [
      { count: 7883733, value: 'US' },
      { count: 2964965, value: 'CN' },
    ],
  },
  total: 23047224,
};

export const mockSearchFacetsResponse: SearchFacet[] = [
  'asn' as SearchFacet,
  'bitcoin.ip' as SearchFacet,
  'bitcoin.ip_count' as SearchFacet,
];

export const mockSearchFiltersResponse: SearchFilter[] = [
  'all' as SearchFilter,
  'asn' as SearchFilter,
  'bitcoin.ip' as SearchFilter,
];

export const mockSearchTokensResponse: SearchTokensResponse = {
  attributes: {
    ports: [22],
  },
  errors: [],
  string: 'Raspbian',
  filters: ['port'],
};
