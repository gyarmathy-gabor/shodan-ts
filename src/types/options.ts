import { SearchFacetParam, TrendsFacetValue } from './facets';

export interface ShodanRequestOptions {
  /**
   * Connection timeout in milliseconds.
   */
  timeout?: number;

  /**
   * Number of retries to attempt if the request fails.
   */
  retries?: number;
}

/**
 * This is for the client itself.
 * If in the future we want to add more options, we can add them here.
 */
export type ShodanClientOptions = ShodanRequestOptions;

export interface SearchHistoricalDataOptions extends ShodanRequestOptions {
  /**
   * A list of properties to get summary information on.
   * @example 'country'
   */
  facetType?: TrendsFacetValue;

  /**
   * The number of results to return for the facet breakdown.
   * @example 10
   */
  facetLimit?: number;
}

export interface AddUserToOrganizationOptions extends ShodanRequestOptions {
  /**
   * Whether or not to send an email notification to the user.
   * @default true
   */
  notify?: boolean;
}

/**
 * Options for querying host information.
 */
export interface HostInformationOptions extends ShodanRequestOptions {
  /**
   * True if all historical banners should be returned.
   * @default false
   */
  history?: boolean;

  /**
   * When set to `true`, only the list of ports and general host information are returned, excluding detailed banners.
   * @default false
   */
  minify?: boolean;
}

/**
 * Optional parameters for the countHosts method.
 */
export interface CountOptions extends ShodanRequestOptions {
  facets?: SearchFacetParam;
}

/**
 * Optional parameters for the searchHosts method.
 */
export interface SearchOptions extends ShodanRequestOptions {
  /**
   * The parameter format accepted by Search methods for facets.
   * Can be a single facet string, a single facet with a count, or an array of either.   * - Look at {@link SearchFacetParam} for the full type definition.
   * @example "country"
   * @example "country:100"
   * @example ["country:100", "os", "port:50"]
   */
  facets?: SearchFacetParam;

  /**
   * The page number to page through results 100 at a time.
   * @default 1
   */
  page?: number;

  /**
   * Whether to truncate some of the larger fields.
   * @default true
   */
  minify?: boolean;

  /**
   * An array of fields to return in the response.
   * @default undefined
   * @example ["http.title", "http.favicon.hash"]
   */
  fields?: string[];
}
