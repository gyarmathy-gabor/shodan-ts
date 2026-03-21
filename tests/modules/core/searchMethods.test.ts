import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildSearchMethods } from '../../../src/modules/core/searchMethods';
import {
  mockCountHostsResponse,
  mockHostInformationResponse,
  mockSearchFacetsResponse,
  mockSearchFiltersResponse,
  mockSearchHostsResponse,
  mockSearchTokensResponse,
} from '../../test-data/search.data';

const fetchMock = vi.fn();

describe('searchMethods', () => {
  const searchMethods = buildSearchMethods('https://api.shodan.io', 'API_KEY', {
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

  describe('getHostInformation', () => {
    it('should return host information successfully', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockHostInformationResponse,
      });

      const result = await searchMethods.getHostInformation('8.8.8.8');
      expect(result?.ip_str).toBe('8.8.8.8');
      expect(result?.org).toBe('Google');
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.shodan.io/shodan/host/8.8.8.8?key=API_KEY',
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('should append history and minify parameters correctly', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockHostInformationResponse,
      });

      await searchMethods.getHostInformation('8.8.8.8', { history: true, minify: false });
      const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
      expect(lastCallUrl).toContain('history=true');
      expect(lastCallUrl).toContain('minify=false');
    });

    it('should catch 404 errors and return null', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'No information available for that IP.' }),
      });

      const result = await searchMethods.getHostInformation('127.0.0.1');
      expect(result).toBeNull();
    });
  });

  describe('countHosts', () => {
    it('should format array of facets correctly and return count', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockCountHostsResponse,
      });

      const result = await searchMethods.countHosts('product:nginx', { facets: ['org', 'os'] });
      expect(result.total).toBe(19590274);

      const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
      expect(lastCallUrl).toContain('query=product%3Anginx');
      expect(lastCallUrl).toContain('facets=org%2Cos');
    });

    it('should throw an error if the API returns a status other than 404', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server Unavailable.' }),
      });
      expect(searchMethods.getHostInformation('127.0.0.1')).rejects.toThrow();
    });
  });

  describe('searchHosts', () => {
    it('should format all arrays and parameters correctly', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockSearchHostsResponse,
      });

      const result = await searchMethods.searchHosts('product:nginx', {
        facets: ['country'],
        fields: ['ip_str', 'port'],
        page: 2,
        minify: true,
      });

      expect(result.matches[0]?.ip_str).toBe('96.93.212.27');

      const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
      expect(lastCallUrl).toContain('query=product%3Anginx');
      expect(lastCallUrl).toContain('facets=country');
      expect(lastCallUrl).toContain('fields=ip_str%2Cport');
      expect(lastCallUrl).toContain('page=2');
      expect(lastCallUrl).toContain('minify=true');
    });
  });

  it('getSearchFacets should return an array of facet strings', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockSearchFacetsResponse });
    const result = await searchMethods.getSearchFacets();
    expect(result).toContain('asn');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/host/search/facets?key=API_KEY',
      expect.any(Object),
    );
  });

  it('getSearchFilters should return an array of filter strings', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockSearchFiltersResponse });
    const result = await searchMethods.getSearchFilters();
    expect(result).toContain('bitcoin.ip');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/host/search/filters?key=API_KEY',
      expect.any(Object),
    );
  });

  it('getSearchTokens should send query and return tokens', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockSearchTokensResponse });
    const result = await searchMethods.getSearchTokens('Raspbian port:22');

    expect(result.string).toBe('Raspbian');
    expect(result.attributes['ports']).toEqual([22]);

    const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(lastCallUrl).toContain('query=Raspbian+port%3A22');
  });
});
