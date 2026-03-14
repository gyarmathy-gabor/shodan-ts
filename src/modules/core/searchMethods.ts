import { request } from '../../utils/fetcher';
import {
  CountOptions,
  HostInformationOptions,
  HostInformationResponse,
  SearchOptions,
  SearchTokensResponse,
} from '../../types/search';
import { SearchFilter } from '../../types/filters';
import { SearchFacet } from '../../types/facets';

export const buildSearchMethods = (baseUrl: string, apiKey: string) => ({
  /**
   * Returns all services that have been found on the given host IP.
   * @param ip - Host IP address
   * @param options - optional parameters:
   *  - history: True if all historical banners should be returned (default: False)
   *  - minify: True to only return the list of ports and the general host information, no banners. (default: False)
   * @remarks
   * Note: The official Shodan API returns a 404 error if you set history to true and the IP has no historical banners.
   * It also returns a 404 error when it can't find anything about the given ip.
   * To prevent crashes, this method catches 404 errors and returns `null` instead.
   */
  getHostInformation: async (
    ip: string,
    options?: HostInformationOptions,
  ): Promise<HostInformationResponse | null> => {
    try {
      return await request(baseUrl, `shodan/host/${ip}`, apiKey, {
        params: options as Record<string, boolean | undefined>,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  },

  /**
   * This method behaves identical to `searchHosts` with the only difference that this method
   * does not return any host results, it only returns the total number of results that matched the query
   * and any facet information that was requested.
   * @remarks This method does not consume query credits.
   *
   * @param query - Shodan search query (e.g., "product:nginx")
   * @param options - optional parameters:
   * - facets: A list of properties to get summary information on. e.g., country.
   */
  countHosts: async (query: string, options?: CountOptions) => {
    const { facets } = options || {};
    const facetsFormatted = Array.isArray(facets) ? facets.join(',') : facets;
    return await request(baseUrl, 'shodan/host/count', apiKey, {
      params: { query: query, facets: facetsFormatted },
    });
  },

  /**
   * Search Shodan using the same query syntax as the website and use facets to get
   * summary information for different properties.
   *
   * @remarks
   * **Billing Note:** Your account will be deducted 1 query credit if:
   * 1. The search query contains a filter.
   * 2. You access results past the 1st page (1 credit is deducted for every 100 results past page 1).
   *
   * @param query - Shodan search query (e.g., "product:nginx")
   * @param options - optional parameters:
   * - facets: A list of properties to get summary information on. e.g., country.
   * - page: The page number to return. (default: 1)
   * - minify: Whether to truncate some of the larger fields (default: True)
   * - fields: An array of fields to return in the search results. Example tags: "http.title", "http.favicon.hash"
   */
  searchHosts: async (query: string, options?: SearchOptions) => {
    const { facets, page, minify, fields } = options || {};
    const facetsFormatted = Array.isArray(facets) ? facets.join(',') : facets;
    const fieldsFormatted = Array.isArray(fields) ? fields.join(',') : fields;
    return await request(baseUrl, 'shodan/host/search', apiKey, {
      params: {
        query: query,
        facets: facetsFormatted,
        page: page,
        minify: minify,
        fields: fieldsFormatted,
      },
    });
  },
  /**
   * List all search facets.
   * This method returns a list of facets that can be used to get a breakdown of the top values for a property.
   */
  getSearchFacets: async (): Promise<SearchFacet[]> =>
    await request(baseUrl, `shodan/host/search/facets`, apiKey),

  /**
   * List all filters that can be used when searching.
   * This method returns a list of search filters that can be used in the search query.
   */
  getSearchFilters: async (): Promise<SearchFilter[]> =>
    await request(baseUrl, `shodan/host/search/filters`, apiKey),

  /**
   * Break the search query into tokens.
   * - This method lets you determine which filters are being used by the query string
   * and what parameters were provided to the filters.
   * @param query - The Shodan search query to parse (e.g., "Raspbian port:22").
   */
  getSearchTokens: async (query: string): Promise<SearchTokensResponse> =>
    await request(baseUrl, `shodan/host/search/tokens`, apiKey, { params: { query: query } }),
});
