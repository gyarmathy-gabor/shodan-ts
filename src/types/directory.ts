/**
 * Represents a saved search query in the Shodan directory.
 */
export interface DirectoryQuery {
  /** The number of upvotes the query has received. */
  votes: number;

  /** A description of what the query searches for. */
  description: string;

  /** The title of the saved query. */
  title: string;

  /** An array of tags associated with the query. */
  tags: string[];

  /** The date and time the query was saved or last updated. */
  timestamp: string;

  /** The actual Shodan search query string. */
  query: string;
}

/**
 * Represents a tag used to categorize saved search queries.
 */
export interface ShodanTag {
  /** The number of times this tag has been used. */
  count: number;

  /** The name/value of the tag (e.g., "webcam", "ics"). */
  value: string;
}

/**
 * The response returned when listing saved search queries.
 */
export interface GetQueriesResponse {
  /** An array of saved queries matching the request. */
  matches: DirectoryQuery[];

  /** The total number of queries available across all pages. */
  total: number;
}

/**
 * The response returned when searching through the directory of saved queries.
 */
export interface SearchQueriesResponse {
  /** An array of saved queries matching the search term. */
  matches: DirectoryQuery[];

  /** The total number of matching queries across all pages. */
  total: number;
}

export interface GetTagsResponse {
  /** An array of the most popular tags. */
  matches: ShodanTag[];
  /** The total number of distinct tags in the directory. */
  total: number;
}
