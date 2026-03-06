import { request } from '../../utils/fetcher';
import { TrendsFacet } from '../../types/facets';
import { TrendsFilterValue } from '../../types/filters';

export const buildHistoricalDataMethods = (baseUrl: string, apiKey: string) => ({
  /**
   * This method returns a list of facets that can be used to get a breakdown of the top values for a property.
   */
  getFacets: async () => await request(baseUrl, `api/v1/search/facets`, apiKey),
  /**
   * This method returns a list of search filters that can be used in the search query.
   */
  getFilters: async () => await request(baseUrl, `api/v1/search/filters`, apiKey),
  /**
   * Get breakdown of historical results aggregate by facet field.
   * @param filterType - The search query string. Can be a simple keyword (e.g., 'linux') or a filtered search (e.g., 'product:nginx').
   * @param facetType - A list of properties to get summary information on. e.g. country.
   * @param facetLimit - The number of results to return for the facet breakdown (e.g., 10 to get the top 10 values).
   */
  searchHistoricalData: async (
    filterType: TrendsFilterValue,
    facetType?: TrendsFacet,
    facetLimit?: number,
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
    });
  },
});
