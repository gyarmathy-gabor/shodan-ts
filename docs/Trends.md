# Trends API Reference

This document covers the Historical Data / Trends API methods for `shodan-ts`. These endpoints allow you to query how the internet has changed over time and get aggregated historical results.

* **Base URL:** `https://trends.shodan.io`
* **Official Shodan Docs:** [Trends API Reference](https://developer.shodan.io/api/trends)

---

## Historical Data Methods

### `searchHistoricalData(query, options?)`

Get a breakdown of historical results aggregated by a facet field.

* **Official API Endpoint:** `GET /api/v1/search`
* **Returns:** `Promise<HistoricalDataResponse>`

#### Parameters

| Parameter | Type                          | Required | Description                                                                                                        |
|:----------|:------------------------------|:--------:|:-------------------------------------------------------------------------------------------------------------------|
| `query`   | `TrendsFilterValue`           | **Yes**  | The search query string. Can be a simple keyword (e.g., `'linux'`) or a filtered search (e.g., `'product:nginx'`). |
| `options` | `SearchHistoricalDataOptions` |    No    | Optional configuration for this request.                                                                           |

#### `SearchHistoricalDataOptions` Properties

| Property     | Type     | Description                                                                     |
|:-------------|:---------|:--------------------------------------------------------------------------------|
| `facetType`  | `string` | The property to break down the historical data by (e.g., `'country'`, `'org'`). |
| `facetLimit` | `number` | The number of top values to return for the given facet.                         |
| `timeout`    | `number` | Overrides the global client timeout (ms).                                       |
| `retries`    | `number` | Overrides the global client retries.                                            |

#### Example

```typescript
const history = await client.searchHistoricalData('product:nginx', {
  facetType: 'country',
  facetLimit: 5
});
console.log('Historical data retrieved successfully.');
```

---

### `getTrendFilters(options?)`

Returns a list of search filters that can be used in the trends search query.

* **Official API Endpoint:** `GET /api/v1/search/filters`
* **Returns:** `Promise<string[]>`

#### Parameters

| Parameter | Type                   | Required | Description                              |
|:----------|:-----------------------|:--------:|:-----------------------------------------|
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request. |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const filters = await client.getTrendFilters();
console.log(`Available trend filters: ${filters.length}`);
```

---

### `getTrendFacets(options?)`

Returns a list of facets that can be used to get a breakdown of the top values for a property over time.

* **Official API Endpoint:** `GET /api/v1/search/facets`
* **Returns:** `Promise<string[]>`

#### Parameters

| Parameter | Type                   | Required | Description                              |
|:----------|:-----------------------|:--------:|:-----------------------------------------|
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request. |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |


#### Example

```typescript
const facets = await client.getTrendFacets();
console.log(`Available trend facets: ${facets.length}`);
```