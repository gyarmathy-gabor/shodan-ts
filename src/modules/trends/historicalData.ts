import { request } from '../../utils/fetcher';
import { TrendsFacetValue } from '../../types/facets';
import { TrendsFilterValue } from '../../types/filters';
import { ShodanClientOptions, ShodanRequestOptions } from '../../types/options';

export const buildHistoricalDataMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * This method returns a list of facets that can be used to get a breakdown of the top values for a property.
   */
  getTrendFacets: async (options?: ShodanRequestOptions) =>
    await request(baseUrl, `api/v1/search/facets`, apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    }),
  /**
   * This method returns a list of search filters that can be used in the search query.
   */
  getTrendFilters: async (options?: ShodanRequestOptions) =>
    await request(baseUrl, `api/v1/search/filters`, apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    }),
  /**
   * Get breakdown of historical results aggregate by facet field.
   * @param filterType - The search query string. Can be a simple keyword (e.g., 'linux') or a filtered search (e.g., 'product:nginx').
   * @param options - Optional configuration for this request.
   */
  searchHistoricalData: async (
    filterType: TrendsFilterValue,
    facetType?: TrendsFacetValue,
    facetLimit?: number,
    options?: ShodanRequestOptions,
  ) => {
    const facet = facetType
      ? facetLimit !== undefined
        ? `${facetType}:${facetLimit}`
        : facetType
      : undefined;

    return await request(baseUrl, `api/v1/search`, apiKey, {
      params: {
        query: filterType,
        facets: facet,
      },
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
});
