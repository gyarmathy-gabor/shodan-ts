import { request } from '../../utils/fetcher';
import { TrendsFilterValue } from '../../types/filters';
import {
  SearchHistoricalDataOptions,
  ShodanClientOptions,
  ShodanRequestOptions,
} from '../../types/options';
import { HistoricalDataResponse } from '../../types/historical';

export const buildHistoricalDataMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * This method returns a list of facets that can be used to get a breakdown of the top values for a property.
   */
  getTrendFacets: async (options?: ShodanRequestOptions): Promise<string[]> =>
    request(baseUrl, `api/v1/search/facets`, apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    }),
  /**
   * This method returns a list of search filters that can be used in the search query.
   */
  getTrendFilters: async (options?: ShodanRequestOptions): Promise<string[]> =>
    request(baseUrl, `api/v1/search/filters`, apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    }),
  /**
   * Get breakdown of historical results aggregate by facet field.
   * @param query - The search query string. Can be a simple keyword (e.g., 'linux') or a filtered search (e.g., 'product:nginx').
   * @param options - Optional configuration for this request.
   */
  searchHistoricalData: async (
    query: TrendsFilterValue,
    options?: SearchHistoricalDataOptions,
  ): Promise<HistoricalDataResponse> => {
    const { facetType, facetLimit, timeout, retries } = options || {};
    const facet = facetType
      ? facetLimit !== undefined
        ? `${facetType}:${facetLimit}`
        : facetType
      : undefined;

    return request(baseUrl, `api/v1/search`, apiKey, {
      params: {
        query: query,
        facets: facet,
      },
      timeout: timeout ?? globalOptions.timeout,
      retries: retries ?? globalOptions.retries,
    });
  },
});
