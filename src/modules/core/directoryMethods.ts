import {
  GetQueriesOptions,
  GetTagsOptions,
  SearchQueriesOptions,
  ShodanClientOptions,
} from '../../types/options';
import { request } from '../../utils/fetcher';
import { GetQueriesResponse, GetTagsResponse, SearchQueriesResponse } from '../../types/directory';

/**
 * This implements the methods that would historically be used here: https://www.shodan.io/explore
 * As of writing this module, these endpoints do not work as intended and consistently return 503 errors.
 */
export const buildDirectoryMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * Use this method to get a list of search queries that users have saved in Shodan.
   * @param options - Optional configuration for this request.
   *
   * @remarks
   * **Warning:** The Shodan Query Directory feature appears to have been removed or disabled on Shodan's backend.
   * As of recent testing, this endpoint consistently returns a `503 Service Unavailable` error.
   */
  getQueries: async (options?: GetQueriesOptions): Promise<GetQueriesResponse> => {
    return request(baseUrl, 'shodan/query', apiKey, {
      method: 'GET',
      params: {
        page: options?.page,
        sort: options?.sort,
        order: options?.order,
      },
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Use this method to search the directory of search queries that users have saved in Shodan.
   * @param query - What to search for in the directory of saved search queries.
   * @param options - Optional configuration for this request.
   *
   * @remarks
   * **Warning:** The Shodan Query Directory feature appears to have been removed or disabled on Shodan's backend.
   * As of recent testing, this endpoint consistently returns a `503 Service Unavailable` error.
   */
  searchQueries: async (
    query: string,
    options?: SearchQueriesOptions,
  ): Promise<SearchQueriesResponse> => {
    return request(baseUrl, 'shodan/query/search', apiKey, {
      params: {
        query,
        page: options?.page,
      },
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Use this method to get a list of popular tags for the saved search queries in Shodan.
   * @param options - Optional configuration for this request.
   *
   * @remarks
   * **Warning:** The Shodan Query Directory feature appears to have been removed or disabled on Shodan's backend.
   * As of recent testing, this endpoint consistently returns a `503 Service Unavailable` error.
   */
  getTags: async (options: GetTagsOptions): Promise<GetTagsResponse> => {
    return request(baseUrl, 'shodan/query/tags', apiKey, {
      params: {
        size: options?.size,
      },
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
});
