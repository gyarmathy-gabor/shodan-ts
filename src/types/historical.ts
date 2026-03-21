/**
 * Represents the aggregate count of results for a specific month.
 */
export interface HistoricalMatch {
  /** The month of the aggregation (e.g., "2017-06"). */
  month: string;
  /** The total number of matches for that month. */
  count: number;
}

/**
 * Represents a specific value and its count within a facet.
 */
export interface HistoricalFacetValue {
  /** The number of times this value appeared. */
  count: number;
  /** The actual value of the facet (e.g., "US", "CN", "nginx"). */
  value: string;
}

/**
 * Represents a facet grouping, typically broken down by month keys.
 */
export interface HistoricalFacetItem {
  /** The key for this facet group (e.g., "2017-06"). */
  key: string;
  /** The top values and their counts for this key. */
  values: HistoricalFacetValue[];
}

/**
 * The response returned when querying historical aggregate data.
 */
export interface HistoricalDataResponse {
  /** The total number of aggregate matches across the time period. */
  total: number;
  /** The aggregate counts broken down by month. */
  matches: HistoricalMatch[];
  /** Optional facet breakdowns, keyed by the requested facet type (e.g., "country"). */
  facets?: Record<string, HistoricalFacetItem[]>;
}
