# Core API Reference

This document covers the core REST API methods for `shodan-ts`, including search, on-demand scanning, network alerts, directory lookups, and account management.

* **Base URL:** `https://api.shodan.io`
* **Official Shodan Docs:** [REST API Reference](https://developer.shodan.io/api)

---

## Search Methods

### `getHostInformation(ip, options?)`

Returns all services that have been found on the given host IP.

If Shodan returns a 404 (no data or no historical banners), this method resolves to `null` instead of throwing an error.

* **Official API Endpoint:** `GET /shodan/host/{ip}`
* **Returns:** `Promise<HostInformationResponse | null>`

#### Parameters

| Parameter | Type                     | Required | Description                              |
|:----------|:-------------------------|:--------:|:-----------------------------------------|
| `ip`      | `string`                 | **Yes**  | Host IP address (e.g., `'8.8.8.8'`).     |
| `options` | `HostInformationOptions` |    No    | Optional configuration for this request. |

#### `HostInformationOptions` Properties

| Property  | Type      | Description                                                                                        |
|:----------|:----------|:---------------------------------------------------------------------------------------------------|
| `history` | `boolean` | Set to `true` if all historical banners should be returned.                                        |
| `minify`  | `boolean` | Set to `true` to only return the list of ports and general host information (no detailed banners). |
| `timeout` | `number`  | Overrides the global client timeout (ms).                                                          |
| `retries` | `number`  | Overrides the global client retries.                                                               |

#### Example

```typescript
const hostInfo = await client.getHostInformation('8.8.8.8', {
  minify: true,
  history: false
});

if (hostInfo) {
  console.log(`Host Org: ${hostInfo.org}`);
} else {
  console.log('No information found for 8.8.8.8');
}
```
---

### `countHosts(query, options?)`

Returns the total number of results that matched the query and any facet information that was requested. This method behaves identically to `searchHosts` but does not return any host data in the `matches` array.

> **Note:** This method does **not** consume query credits.

* **Official API Endpoint:** `GET /shodan/host/count`
* **Returns:** `Promise<CountHostsResponse>`

#### Parameters

| Parameter | Type           | Required | Description                                    |
|:----------|:---------------|:--------:|:-----------------------------------------------|
| `query`   | `string`       | **Yes**  | Shodan search query (e.g., `"product:nginx"`). |
| `options` | `CountOptions` |    No    | Optional configuration for this request.       |

#### `CountOptions` Properties

| Property  | Type                   | Description                                            |
|:----------|:-----------------------|:-------------------------------------------------------|
| `facets`  | `string` \| `string[]` | A list of facets to get a breakdown of the top values. |
| `timeout` | `number`               | Overrides the global client timeout (ms).              |
| `retries` | `number`               | Overrides the global client retries.                   |

#### Example

```typescript
const result = await client.countHosts('product:nginx country:DE', {
  facets: ['os']
});

console.log(`Total NGINX servers in Germany: ${result.total}`);
console.log('Top Operating System:', result.facets?.os?.at(0)?.value);
```

---

### `searchHosts(query, options?)`

Search Shodan using the same query syntax as the website and use facets to get summary information for different properties.

> **Billing Note:** Your account will be deducted `1 query credit` if the search query contains a filter, or if you access results past the 1st page (1 credit per 100 results past page 1).

* **Official API Endpoint:** `GET /shodan/host/search`
* **Returns:** `Promise<SearchHostsResponse>`

#### Parameters

| Parameter | Type            | Required | Description                                    |
|:----------|:----------------|:--------:|:-----------------------------------------------|
| `query`   | `string`        | **Yes**  | Shodan search query (e.g., `"product:nginx"`). |
| `options` | `SearchOptions` |    No    | Optional configuration for this request.       |

#### `SearchOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `facets`  | `string` \| `string[]` | A list of facets to get a breakdown of the top values.          |
| `page`    | `number`               | The page number to page through results (100 results per page). |
| `minify`  | `boolean`              | If `true`, only returns essential data.                         |
| `fields`  | `string` \| `string[]` | A list of properties to return for each host banner.            |
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const result = await client.searchHosts('product:nginx country:DE', {
  minify: true,
  page: 1
});

console.log(`Found ${result.total.toLocaleString()} servers.`);
result.matches.forEach(host => console.log(host.ip_str));
```

---

### `getSearchFacets(options?)`

Returns a list of all search facets that can be used to get a breakdown of the top values for a property.

* **Official API Endpoint:** `GET /shodan/host/search/facets`
* **Returns:** `Promise<SearchFacet[]>`

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
const facets = await client.getSearchFacets();
console.log(`Number of available facets: ${facets.length}`);
```

---

### `getSearchFilters(options?)`

Returns a list of all filters that can be used when constructing a search query.

* **Official API Endpoint:** `GET /shodan/host/search/filters`
* **Returns:** `Promise<SearchFilter[]>`

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
const filters = await client.getSearchFilters();
console.log(`Number of available filters: ${filters.length}`);
```

---

### `getSearchTokens(query, options?)`

Breaks the search query into tokens. This lets you determine which filters are being used by the query string and what parameters were provided to the filters.

* **Official API Endpoint:** `GET /shodan/host/search/tokens`
* **Returns:** `Promise<SearchTokensResponse>`

#### Parameters

| Parameter | Type                   | Required | Description                                                    |
|:----------|:-----------------------|:--------:|:---------------------------------------------------------------|
| `query`   | `string`               | **Yes**  | The Shodan search query to parse (e.g., `"Raspbian port:22"`). |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request.                       |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const tokens = await client.getSearchTokens('Raspbian port:22');
console.log('Filters used:', tokens.filters); // ['port']
console.log('Base string:', tokens.string);   // 'Raspbian'
```

---

## On-Demand Scanning Methods

### `listPorts(options?)`

Returns a list of port numbers that the Shodan crawlers are actively looking for.

* **Official API Endpoint:** `GET /shodan/ports`
* **Returns:** `Promise<ListPortsResponse>`

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
const ports = await client.listPorts();
console.log(`Shodan is crawling ${ports.length} ports.`);
```

---

### `listProtocols(options?)`

Returns an object containing all the protocols that can be used when launching an Internet scan.

* **Official API Endpoint:** `GET /shodan/protocols`
* **Returns:** `Promise<ListProtocolsResponse>`

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
const protocols = await client.listProtocols();
console.log('Available protocols:', Object.keys(protocols));
```

---

### `requestScan(targets, options?)`

Request Shodan to crawl an IP, netblock, or specific services.

> **Billing Note:** This method consumes **1 API scan credit per IP**.

* **Official API Endpoint:** `POST /shodan/scan`
* **Returns:** `Promise<RequestScanResponse>`

#### Parameters

| Parameter | Type                   | Required | Description                                                       |
|:----------|:-----------------------|:--------:|:------------------------------------------------------------------|
| `targets` | `ScanPayload`          | **Yes**  | The targets to scan (string, array, or specific service mapping). |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request.                          |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### `ScanPayload` Usage
The `targets` parameter is highly flexible and accepts three different formats:
1. **String:** A comma-separated string of IPs or netblocks (e.g., `"8.8.8.8,1.1.1.1"`).
2. **Array:** An array of IP strings (e.g., `["8.8.8.8", "1.1.1.1"]`).
3. **Object:** A mapping of IPs to specific services to bypass the default scan (e.g., `{ "1.1.1.1": [[443, "https"], [53, "dns-udp"]] }`).

#### Example

```typescript
// Scan multiple IPs:
const scan = await client.requestScan(['8.8.8.8', '1.1.1.1']);
console.log(`Scan created! ID: ${scan.id}, Credits Left: ${scan.credits_left}`);
```

---

### `scanInternet(port, protocol, options?)`

Crawl the Internet for a specific port and protocol using Shodan

> **RESTRICTED ENDPOINT:** This method is restricted to security researchers and companies with a Shodan Enterprise Data license. To apply for access as a researcher, email `jmath@shodan.io` with your project information.

* **Official API Endpoint:** `POST /shodan/scan/internet`
* **Returns:** `Promise<InternetScanResponse>`

#### Parameters

| Parameter  | Type                   | Required | Description                                                      |
|:-----------|:-----------------------|:--------:|:-----------------------------------------------------------------|
| `port`     | `number`               | **Yes**  | The port that Shodan should crawl the Internet for.              |
| `protocol` | `string`               | **Yes**  | The protocol to interrogate the port with (see `listProtocols`). |
| `options`  | `ShodanRequestOptions` |    No    | Optional configuration for this request.                         |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const internetScan = await client.scanInternet(80, 'http');
console.log(`Internet scan initiated: ${internetScan.id}`);
```

---

### `getScans(options?)`

Returns a listing of all the on-demand scans that are currently active on the account.

* **Official API Endpoint:** `GET /shodan/scans`
* **Returns:** `Promise<ActiveScansResponse>`

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
const activeScans = await client.getScans();
console.log(`You have ${activeScans.total} active scans.`);
```

---

### `getScan(scanId, options?)`

Get the status of a specific scan request.

* **Official API Endpoint:** `GET /shodan/scan/{id}`
* **Returns:** `Promise<ScanStatusResponse>`

#### Parameters

| Parameter | Type                   | Required | Description                                   |
|:----------|:-----------------------|:--------:|:----------------------------------------------|
| `scanId`  | `string`               | **Yes**  | The unique scan ID returned by `requestScan`. |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request.      |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const status = await client.getScan('YOUR_SCAN_ID');
console.log(`Scan Status: ${status.status}`);
```
---

## Network Alert Methods

### `createAlert(payload, options?)`

Creates a new network alert to monitor changes to a specified set of IPs or netblocks.

* **Official API Endpoint:** `POST /shodan/alert`
* **Returns:** `Promise<NetworkAlert>`

#### Parameters

| Parameter | Type                   | Required | Description                                                      |
|:----------|:-----------------------|:--------:|:-----------------------------------------------------------------|
| `payload` | `CreateAlertPayload`   | **Yes**  | The alert configuration (name, IPs to monitor, expiration time). |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request.                         |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const alert = await client.createAlert({
  name: 'Production Servers',
  filters: { ip: ['8.8.8.8', '198.51.100.0/24'] },
  expires: 0 // 0 means it never expires
});
console.log(`Created alert: ${alert.name} (${alert.id})`);
```

---

### `getAlert(alertId, options?)`

Returns the information about a specific network alert.

* **Official API Endpoint:** `GET /shodan/alert/{id}/info`
* **Returns:** `Promise<NetworkAlert>`

#### Parameters

| Parameter | Type                   | Required | Description                              |
|:----------|:-----------------------|:--------:|:-----------------------------------------|
| `alertId` | `string`               | **Yes**  | The ID of the alert.                     |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request. |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const alert = await client.getAlert('YOUR_ALERT_ID');
console.log(`Monitoring ${alert.size} IPs.`);
```

---

### `deleteAlert(alertId, options?)`

Remove the specified network alert.

* **Official API Endpoint:** `DELETE /shodan/alert/{id}`
* **Returns:** `Promise<DeleteAlertResponse>`

#### Parameters

| Parameter | Type                   | Required | Description                              |
|:----------|:-----------------------|:--------:|:-----------------------------------------|
| `alertId` | `string`               | **Yes**  | The ID of the alert.                     |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request. |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const response = await client.deleteAlert('YOUR_ALERT_ID');
console.log(response.success ? 'Alert deleted successfully.' : 'Failed to delete.');
```

---

### `modifyAlert(alertId, payload, options?)`

Use this method to edit a network alert with a new list of IPs or networks to keep track of.

* **Official API Endpoint:** `POST /shodan/alert/{id}`
* **Returns:** `Promise<NetworkAlert>`

#### Parameters

| Parameter | Type                   | Required | Description                              |
|:----------|:-----------------------|:--------:|:-----------------------------------------|
| `alertId` | `string`               | **Yes**  | The ID of the alert to modify.           |
| `payload` | `ModifyAlertPayload`   | **Yes**  | The new configuration for the alert.     |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request. |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const updatedAlert = await client.modifyAlert('YOUR_ALERT_ID', {
  filters: { ip: ['8.8.8.8', '1.1.1.1'] } // Replaces the old IP list
});
console.log(`Alert updated, now monitoring ${updatedAlert.size} IPs.`);
```

---

### `getAlerts(options?)`

Returns a listing of all the network alerts that are currently active on the account.

* **Official API Endpoint:** `GET /shodan/alert/info`
* **Returns:** `Promise<NetworkAlert[]>`

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
const alerts = await client.getAlerts();
console.log(`You have ${alerts.length} active network alerts.`);
```

---

### `getTriggers(options?)`

Returns a list of all the triggers that can be enabled on network alerts.

* **Official API Endpoint:** `GET /shodan/alert/triggers`
* **Returns:** `Promise<ShodanTrigger[]>`

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
const triggers = await client.getTriggers();
triggers.forEach(t => console.log(`${t.name}: ${t.description}`));
```

---

### `enableTriggerForAlert(alertId, triggers, options?)`

Get notifications when the specified trigger is met.

* **Official API Endpoint:** `PUT /shodan/alert/{id}/trigger/{trigger}`
* **Returns:** `Promise<AlertActionResponse>`

#### Parameters

| Parameter  | Type                   | Required | Description                                                                                                   |
|:-----------|:-----------------------|:--------:|:--------------------------------------------------------------------------------------------------------------|
| `alertId`  | `string`               | **Yes**  | The ID of the alert.                                                                                          |
| `triggers` | `string` \| `string[]` | **Yes**  | A single trigger name or an array of trigger names (e.g., `'vulnerable'` or `['new_service', 'vulnerable']`). |
| `options`  | `ShodanRequestOptions` |    No    | Optional configuration for this request.                                                                      |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
await client.enableTriggerForAlert('YOUR_ALERT_ID', ['new_service', 'vulnerable']);
console.log('Triggers enabled.');
```

---

### `disableTriggerForAlert(alertId, triggers, options?)`

Stop getting notifications for the specified trigger.

* **Official API Endpoint:** `DELETE /shodan/alert/{id}/trigger/{trigger}`
* **Returns:** `Promise<AlertActionResponse>`

#### Parameters

| Parameter  | Type                   | Required | Description                                                    |
|:-----------|:-----------------------|:--------:|:---------------------------------------------------------------|
| `alertId`  | `string`               | **Yes**  | The ID of the alert.                                           |
| `triggers` | `string` \| `string[]` | **Yes**  | A single trigger name or an array of trigger names to disable. |
| `options`  | `ShodanRequestOptions` |    No    | Optional configuration for this request.                       |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
await client.disableTriggerForAlert('YOUR_ALERT_ID', 'any_match');
console.log('Trigger disabled.');
```

---

### `ignoreServiceForTrigger(alertId, trigger, service, options?)`

Ignores a specific service (IP:Port) when it matches a specific trigger. Useful for whitelisting known issues so they stop generating alert notifications.

* **Official API Endpoint:** `PUT /shodan/alert/{id}/trigger/{trigger}/ignore/{service}`
* **Returns:** `Promise<AlertActionResponse>`

#### Parameters

| Parameter | Type                   | Required | Description                                                      |
|:----------|:-----------------------|:--------:|:-----------------------------------------------------------------|
| `alertId` | `string`               | **Yes**  | The ID of the alert.                                             |
| `trigger` | `string`               | **Yes**  | The specific trigger name to ignore (e.g., `'vulnerable'`).      |
| `service` | `string`               | **Yes**  | The specific service (IP:Port) to ignore (e.g., `'1.1.1.1:80'`). |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request.                         |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
await client.ignoreServiceForTrigger('YOUR_ALERT_ID', 'vulnerable', '1.1.1.1:80');
```

---

### `unignoreServiceForTrigger(alertId, trigger, service, options?)`

Removes a service from the trigger's whitelist (un-ignores it), meaning it will generate alert notifications again if matched.

* **Official API Endpoint:** `DELETE /shodan/alert/{id}/trigger/{trigger}/ignore/{service}`
* **Returns:** `Promise<AlertActionResponse>`

#### Parameters

| Parameter | Type                   | Required | Description                                  |
|:----------|:-----------------------|:--------:|:---------------------------------------------|
| `alertId` | `string`               | **Yes**  | The ID of the alert.                         |
| `trigger` | `string`               | **Yes**  | The specific trigger name to un-ignore.      |
| `service` | `string`               | **Yes**  | The specific service (IP:Port) to un-ignore. |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request.     |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |


#### Example

```typescript
await client.unignoreServiceForTrigger('YOUR_ALERT_ID', 'vulnerable', '1.1.1.1:80');
```

---

### `addNotifierToAlert(alertId, notifierId, options?)`

Add the specified notifier to the network alert. Notifications are only sent if triggers have also been enabled.

* **Official API Endpoint:** `PUT /shodan/alert/{id}/notifier/{notifier_id}`
* **Returns:** `Promise<AlertActionResponse>`

#### Parameters

| Parameter    | Type                   | Required | Description                                   |
|:-------------|:-----------------------|:--------:|:----------------------------------------------|
| `alertId`    | `string`               | **Yes**  | The ID of the alert.                          |
| `notifierId` | `string`               | **Yes**  | The ID of the notification service to attach. |
| `options`    | `ShodanRequestOptions` |    No    | Optional configuration for this request.      |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
await client.addNotifierToAlert('YOUR_ALERT_ID', 'YOUR_NOTIFIER_ID');
```

---

### `removeNotifierFromAlert(alertId, notifierId, options?)`

Remove the notification service from the alert.

* **Official API Endpoint:** `DELETE /shodan/alert/{id}/notifier/{notifier_id}`
* **Returns:** `Promise<AlertActionResponse>`

#### Parameters

| Parameter    | Type                   | Required | Description                                   |
|:-------------|:-----------------------|:--------:|:----------------------------------------------|
| `alertId`    | `string`               | **Yes**  | The ID of the alert.                          |
| `notifierId` | `string`               | **Yes**  | The ID of the notification service to remove. |
| `options`    | `ShodanRequestOptions` |    No    | Optional configuration for this request.      |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
await client.removeNotifierFromAlert('YOUR_ALERT_ID', 'YOUR_NOTIFIER_ID');
```

---

## Notifiers Methods

### `getNotifiers(options?)`

Get a list of all the notifiers that the user has created.

* **Official API Endpoint:** `GET /notifier`
* **Returns:** `Promise<GetNotifiersResponse>`

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
const notifiers = await client.getNotifiers();
console.log(`You have ${notifiers.matches.length} notifiers configured.`);
```

---

### `getNotificationProviders(options?)`

Get a list of all the notification providers that are available and the parameters to submit when creating them.

* **Official API Endpoint:** `GET /notifier/provider`
* **Returns:** `Promise<GetNotificationProviderResponse>`

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
const providers = await client.getNotificationProviders();
console.log('Available providers:', Object.keys(providers));
```

---

### `createNotifier(payload, options?)`

Use this method to create a new notification service endpoint that Shodan services can send notifications through (e.g., Email, Slack, Discord).

* **Official API Endpoint:** `POST /notifier`
* **Returns:** `Promise<SaveNotifierResponse>`

#### Parameters

| Parameter | Type                   | Required | Description                                                                   |
|:----------|:-----------------------|:--------:|:------------------------------------------------------------------------------|
| `payload` | `SaveNotifierPayload`  | **Yes**  | The configuration payload specifying the provider and its required arguments. |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request.                                      |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const newNotifier = await client.createNotifier({
  provider: 'email',
  description: 'My Email Notifier',
  to: 'example@email.com'
});
console.log(`Notifier created with ID: ${newNotifier.id}`);
```

---

### `deleteNotifier(notifierId, options?)`

Remove the notification service created for the user.

* **Official API Endpoint:** `DELETE /notifier/{id}`
* **Returns:** `Promise<ActionSuccessResponse>`

#### Parameters

| Parameter    | Type                   | Required | Description                              |
|:-------------|:-----------------------|:--------:|:-----------------------------------------|
| `notifierId` | `string`               | **Yes**  | The ID of the notifier to delete.        |
| `options`    | `ShodanRequestOptions` |    No    | Optional configuration for this request. |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const response = await client.deleteNotifier('YOUR_NOTIFIER_ID');
console.log(response.success ? 'Notifier deleted.' : 'Failed to delete notifier.');
```

---

### `getNotifier(notifierId, options?)`

Get the detailed information about a specific configured notifier.

* **Official API Endpoint:** `GET /notifier/{id}`
* **Returns:** `Promise<Notifier>`

#### Parameters

| Parameter    | Type                   | Required | Description                              |
|:-------------|:-----------------------|:--------:|:-----------------------------------------|
| `notifierId` | `string`               | **Yes**  | The ID of the notifier to get.           |
| `options`    | `ShodanRequestOptions` |    No    | Optional configuration for this request. |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const notifier = await client.getNotifier('YOUR_NOTIFIER_ID');
console.log(`Notifier Provider: ${notifier.provider}`);
```

---

### `modifyNotifier(notifierId, payload, options?)`

Use this method to update the parameters of an existing notifier.

* **Official API Endpoint:** `PUT /notifier/{id}`
* **Returns:** `Promise<SaveNotifierResponse>`

#### Parameters

| Parameter    | Type                   | Required | Description                                         |
|:-------------|:-----------------------|:--------:|:----------------------------------------------------|
| `notifierId` | `string`               | **Yes**  | The ID of the notifier to update.                   |
| `payload`    | `SaveNotifierPayload`  | **Yes**  | The updated configuration payload for the notifier. |
| `options`    | `ShodanRequestOptions` |    No    | Optional configuration for this request.            |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const updatedNotifier = await client.modifyNotifier('YOUR_NOTIFIER_ID', {
  provider: 'email',
  description: 'Updated Email Notifier',
  to: 'admin@example.com'
});
console.log(`Notifier updated.`);
```

## Directory Methods

> **Note** The Shodan Query Directory endpoints currently return 503 and may be deprecated / disabled on Shodan's side.

### `getQueries(options?)`

Use this method to get a list of search queries that users have saved in Shodan.

* **Official API Endpoint:** `GET /shodan/query`
* **Returns:** `Promise<GetQueriesResponse>`

#### Parameters

| Parameter | Type                | Required | Description                              |
|:----------|:--------------------|:--------:|:-----------------------------------------|
| `options` | `GetQueriesOptions` |    No    | Optional configuration for this request. |

#### `GetQueriesOptions` Properties

| Property  | Type     | Description                                                            |
|:----------|:---------|:-----------------------------------------------------------------------|
| `page`    | `number` | Page number to iterate over results (each page contains 10 items).     |
| `sort`    | `string` | Sort the list based on a property (e.g., `'votes'`, `'timestamp'`).    |
| `order`   | `string` | Whether to sort in ascending (`'asc'`) or descending (`'desc'`) order. |
| `timeout` | `number` | Overrides the global client timeout (ms).                              |
| `retries` | `number` | Overrides the global client retries.                                   |

#### Example

```typescript
try {
  const queries = await client.getQueries({ page: 1, sort: 'votes', order: 'desc' });
  console.log(`Found ${queries.total} saved queries.`);
} catch (error) {
  console.error('Shodan Directory API is likely down (503).');
}
```

---

### `searchQueries(query, options?)`

Use this method to search the directory of search queries that users have saved in Shodan.

* **Official API Endpoint:** `GET /shodan/query/search`
* **Returns:** `Promise<SearchQueriesResponse>`

#### Parameters

| Parameter | Type                   | Required | Description                                                  |
|:----------|:-----------------------|:--------:|:-------------------------------------------------------------|
| `query`   | `string`               | **Yes**  | What to search for in the directory of saved search queries. |
| `options` | `SearchQueriesOptions` |    No    | Optional configuration for this request.                     |

#### `SearchQueriesOptions` Properties

| Property  | Type     | Description                                                        |
|:----------|:---------|:-------------------------------------------------------------------|
| `page`    | `number` | Page number to iterate over results (each page contains 10 items). |
| `timeout` | `number` | Overrides the global client timeout (ms).                          |
| `retries` | `number` | Overrides the global client retries.                               |

#### Example

```typescript
try {
  const results = await client.searchQueries('webcam');
  console.log(`Found ${results.total} queries matching "webcam".`);
} catch (error) {
  console.error('Shodan Directory API is likely down (503).');
}
```

---

### `getTags(options)`

Use this method to get a list of popular tags for the saved search queries in Shodan.

* **Official API Endpoint:** `GET /shodan/query/tags`
* **Returns:** `Promise<GetTagsResponse>`

#### Parameters

| Parameter | Type             | Required | Description                     |
|:----------|:-----------------|:--------:|:--------------------------------|
| `options` | `GetTagsOptions` | **Yes**  | Configuration for this request. |

#### `GetTagsOptions` Properties

| Property  | Type     | Description                                |
|:----------|:---------|:-------------------------------------------|
| `size`    | `number` | The number of tags to return (e.g., `10`). |
| `timeout` | `number` | Overrides the global client timeout (ms).  |
| `retries` | `number` | Overrides the global client retries.       |

#### Example

```typescript
try {
  const tags = await client.getTags({ size: 10 });
  console.log(`Top 10 tags:`, tags.matches.map(t => t.value));
} catch (error) {
  console.error('Shodan Directory API is likely down (503).');
}
```

---

## Bulk Data Methods (Enterprise)

> **Enterprise Only:** The methods in this section require a Shodan Enterprise Data license. If you attempt to call these with a standard API key, the API will return an error.

### `getAvailableDatasets(options?)`

Use this method to see a list of the datasets that are available for download.

* **Official API Endpoint:** `GET /shodan/data`
* **Returns:** `Promise<Dataset[]>`

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
const datasets = await client.getAvailableDatasets();
console.log(`Available datasets: ${datasets.length}`);
datasets.forEach(ds => console.log(`- ${ds.name}: ${ds.description}`));
```

---

### `getDataset(dataset, options?)`

Get a list of files that are available for download from the provided dataset.

* **Official API Endpoint:** `GET /shodan/data/{dataset}`
* **Returns:** `Promise<DatasetFile[]>`

#### Parameters

| Parameter | Type                   | Required | Description                                     |
|:----------|:-----------------------|:--------:|:------------------------------------------------|
| `dataset` | `string`               | **Yes**  | The name of the dataset (e.g., `'sonar.http'`). |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request.        |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const files = await client.getDataset('sonar.http');
console.log(`Found ${files.length} files for sonar.http.`);

if (files.length > 0) {
  console.log(`Download URL for first file: ${files[0].url}`);
}
```

---

## Manage Organization Methods (Enterprise)

> **Enterprise Only:** The methods in this section require your account to be part of a Shodan Enterprise subscription. Attempting to use them with a standard API key will result in an error.

### `getOrganization(options?)`

Get information about your organization such as the list of its members, upgrades, authorized domains, and more.

* **Official API Endpoint:** `GET /org`
* **Returns:** `Promise<Organization>`

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
const org = await client.getOrganization();
console.log(`Organization name: ${org.name}`);
console.log(`Members: ${org.admins.length + org.members.length}`);
```

---

### `addUserToOrganization(user, options?)`

Add a Shodan user to the organization and upgrade them.

* **Official API Endpoint:** `PUT /org/member/{user}`
* **Returns:** `Promise<OrganizationActionResponse>`

#### Parameters

| Parameter | Type                           | Required | Description                                  |
|:----------|:-------------------------------|:--------:|:---------------------------------------------|
| `user`    | `string`                       | **Yes**  | Username or email of the Shodan user to add. |
| `options` | `AddUserToOrganizationOptions` |    No    | Optional configuration for this request.     |

#### `AddUserToOrganizationOptions` Properties

| Property  | Type      | Description                                                            |
|:----------|:----------|:-----------------------------------------------------------------------|
| `notify`  | `boolean` | Whether to send an email notification to the user. Defaults to `true`. |
| `timeout` | `number`  | Overrides the global client timeout (ms).                              |
| `retries` | `number`  | Overrides the global client retries.                                   |

#### Example

```typescript
// Silently add a user without sending an email
const response = await client.addUserToOrganization('developer@example.com', {
  notify: false
});
console.log(response.success ? 'User added successfully!' : 'Failed to add user.');
```

---

### `deleteUserFromOrganization(user, options?)`

Remove and downgrade the provided member from the organization.

* **Official API Endpoint:** `DELETE /org/member/{user}`
* **Returns:** `Promise<OrganizationActionResponse>`

#### Parameters

| Parameter | Type                   | Required | Description                                     |
|:----------|:-----------------------|:--------:|:------------------------------------------------|
| `user`    | `string`               | **Yes**  | Username or email of the Shodan user to remove. |
| `options` | `ShodanRequestOptions` |    No    | Optional configuration for this request.        |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const response = await client.deleteUserFromOrganization('johndoe123');
console.log(response.success ? 'User removed from org.' : 'Failed to remove user.');
```

---

## Account Methods

### `getProfile(options?)`

Returns information about the Shodan account linked to the current API key (such as billing plan, credits, and display name).

* **Official API Endpoint:** `GET /account/profile`
* **Returns:** `Promise<AccountProfile>`

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
const profile = await client.getProfile();
console.log(`Hello ${profile.display_name}!`);
console.log(`Query Credits: ${profile.query_credits}`);
console.log(`Scan Credits: ${profile.scan_credits}`);
```

---

## DNS Methods

### `dnsInfo(hostname, options?)`

Get all the subdomains and other DNS entries for the given domain.

> **Billing Note:** This method uses **1 query credit** per lookup.

* **Official API Endpoint:** `GET /dns/domain/{domain}`
* **Returns:** `Promise<DnsInfoResponse>`

#### Parameters

| Parameter  | Type                   | Required | Description                                                                     |
|:-----------|:-----------------------|:--------:|:--------------------------------------------------------------------------------|
| `hostname` | `string`               | **Yes**  | The target domain name to query (e.g., `'example.com'` or `'api.example.com'`). |
| `options`  | `ShodanRequestOptions` |    No    | Optional configuration for this request.                                        |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const dnsData = await client.dnsInfo('example.com');
console.log(`Found ${dnsData.subdomains.length} subdomains for example.com.`);
```

---

### `dnsResolve(hostnames, options?)`

Look up the IP address for the provided list of hostnames.

* **Official API Endpoint:** `GET /dns/resolve`
* **Returns:** `Promise<DnsResolveResponse>`

#### Parameters

| Parameter   | Type                   | Required | Description                                                   |
|:------------|:-----------------------|:--------:|:--------------------------------------------------------------|
| `hostnames` | `string` \| `string[]` | **Yes**  | A single hostname string or an array of hostnames to resolve. |
| `options`   | `ShodanRequestOptions` |    No    | Optional configuration for this request.                      |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const resolved = await client.dnsResolve(['google.com', 'bing.com']);
console.log('google.com resolves to:', resolved['google.com']);
```

---

### `dnsReverse(ipAddresses, options?)`

Look up the hostnames that have been defined for the given list of IP addresses.

* **Official API Endpoint:** `GET /dns/reverse`
* **Returns:** `Promise<DnsReverseResponse>`

#### Parameters

| Parameter     | Type                   | Required | Description                                             |
|:--------------|:-----------------------|:--------:|:--------------------------------------------------------|
| `ipAddresses` | `string` \| `string[]` | **Yes**  | A single IPv4/IPv6 address or an array of IP addresses. |
| `options`     | `ShodanRequestOptions` |    No    | Optional configuration for this request.                |

#### `ShodanRequestOptions` Properties

| Property  | Type                   | Description                                                     |
|:----------|:-----------------------|:----------------------------------------------------------------|
| `timeout` | `number`               | Overrides the global client timeout (ms).                       |
| `retries` | `number`               | Overrides the global client retries.                            |

#### Example

```typescript
const reversed = await client.dnsReverse(['8.8.8.8', '1.1.1.1']);
console.log('8.8.8.8 resolves to:', reversed['8.8.8.8']);
```

---

## Utility Methods

### `showClientHttpHeaders(options?)`

Shows the HTTP headers that your client sends when connecting to a webserver. This is useful for debugging your requests or checking what headers the native `fetch` API is appending.

* **Official API Endpoint:** `GET /tools/httpheaders`
* **Returns:** `Promise<Record<string, string>>`

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
const headers = await client.showClientHttpHeaders();
console.log('My User-Agent is:', headers['User-Agent']);
```

---

### `showMyIp(options?)`

Get your current IP address as seen from the Internet.

* **Official API Endpoint:** `GET /tools/myip`
* **Returns:** `Promise<string>`

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
const myIp = await client.showMyIp();
console.log(`My public IP address is: ${myIp}`);
```

---

## API Status Methods

### `getApiInfo(options?)`

Returns information about the API plan belonging to the given API key. This is incredibly useful for proactively checking your remaining query and scan credits before executing large bulk operations.

* **Official API Endpoint:** `GET /api-info`
* **Returns:** `Promise<ApiInfo>`

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
const apiInfo = await client.getApiInfo();
console.log(`Plan unlocked: ${apiInfo.plan}`);
console.log(`Scan credits remaining: ${apiInfo.scan_credits}`);
console.log(`Query credits remaining: ${apiInfo.query_credits}`);
```