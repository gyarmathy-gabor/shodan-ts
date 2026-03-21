import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildDnsMethods } from '../../../src/modules/core/dnsMethods';
import {
  mockDnsInfoResponse,
  mockDnsResolveResponse,
  mockDnsReverseResponse,
} from '../../test-data/dns.data';

const fetchMock = vi.fn();

describe('dnsMethods', () => {
  const dnsMethods = buildDnsMethods('https://api.shodan.io', 'API_KEY', {
    timeout: 5000,
    retries: 0,
  });

  beforeEach(() => {
    fetchMock.mockClear();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('dnsInfo should build correct URL with hostname in path', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockDnsInfoResponse,
    });

    const result = await dnsMethods.dnsInfo('example.com');

    expect(result.domain).toBe('example.com');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/dns/domain/example.com?key=API_KEY',
      expect.any(Object),
    );
  });

  it('dnsResolve should handle array of hostnames as query params', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockDnsResolveResponse,
    });

    await dnsMethods.dnsResolve(['google.com', 'facebook.com']);

    const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(lastCallUrl).toContain('hostnames=google.com%2Cfacebook.com');
  });

  it('dnsResolve should handle a single hostname as query param', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockDnsResolveResponse,
    });

    await dnsMethods.dnsResolve('google.com');

    const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(lastCallUrl).toContain('hostnames=google.com');
  });

  it('dnsReverse should handle multiple IP addresses', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockDnsReverseResponse,
    });

    const result = await dnsMethods.dnsReverse(['8.8.8.8', '1.1.1.1']);

    expect(result['8.8.8.8']).toContain('dns.google');
    expect(result['1.1.1.1']).toContain('one.one.one.one');
    const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(lastCallUrl).toContain('ips=8.8.8.8');
    expect(lastCallUrl).toContain('1.1.1.1');
  });

  it('dnsReverse should handle a single IP address', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockDnsReverseResponse,
    });

    const result = await dnsMethods.dnsReverse('8.8.8.8');

    expect(result['8.8.8.8']).toContain('dns.google');
    const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(lastCallUrl).toContain('ips=8.8.8.8');
  });
});
