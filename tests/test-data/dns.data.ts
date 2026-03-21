import { DnsInfoResponse, DnsResolveResponse, DnsReverseResponse } from '../../src/types/dns';

export const mockDnsInfoResponse: DnsInfoResponse = {
  domain: 'example.com',
  tags: ['ipv6'],
  data: [
    {
      subdomain: 'api',
      type: 'A',
      value: '93.184.216.34',
      last_seen: '2021-01-19T22:23:15.978799+00:00',
    },
  ],
  subdomains: ['api'],
  more: false,
};

export const mockDnsResolveResponse: DnsResolveResponse = {
  'example.com': '93.184.216.34',
  'invalid.test': null,
};

export const mockDnsReverseResponse: DnsReverseResponse = {
  '8.8.8.8': ['dns.google'],
  '1.1.1.1': ['one.one.one.one'],
};
