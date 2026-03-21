import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  mockHistoricalDataResponse,
  mockTrendFacetsResponse,
  mockTrendFiltersResponse,
} from '../../test-data/historical.data';
import { buildHistoricalDataMethods } from '../../../src/modules/trends/historicalData';

const fetchMock = vi.fn();

describe('historicalDataMethods', () => {
  const trendsMethods = buildHistoricalDataMethods('https://trends.shodan.io', 'API_KEY', {
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

  it('getTrendFacets should send correct URL and return array of strings', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockTrendFacetsResponse,
    });

    const result = await trendsMethods.getTrendFacets();
    expect(result).toContain('asn');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://trends.shodan.io/api/v1/search/facets?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('getTrendFilters should send correct URL and return array of strings', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockTrendFiltersResponse,
    });

    const result = await trendsMethods.getTrendFilters();
    expect(result).toContain('country');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://trends.shodan.io/api/v1/search/filters?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  describe('searchHistoricalData', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockHistoricalDataResponse,
      });
    });

    it('should request historical data without facets', async () => {
      const result = await trendsMethods.searchHistoricalData('nginx');

      expect(result.total).toBe(1464808820);
      expect(result.matches[0]?.month).toBe('2017-06');

      const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
      expect(lastCallUrl).toContain('query=nginx');
      // Shouldn't contain facets if not provided
      expect(lastCallUrl).not.toContain('facets=');
    });

    it('should append facet type correctly without limit', async () => {
      await trendsMethods.searchHistoricalData('nginx', { facetType: 'country' });

      const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
      expect(lastCallUrl).toContain('facets=country');
    });

    it('should format facet with limit correctly (e.g. country:5)', async () => {
      await trendsMethods.searchHistoricalData('nginx', {
        facetType: 'country',
        facetLimit: 5,
      });

      const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
      expect(lastCallUrl).toContain('facets=country%3A5');
    });
  });
});
