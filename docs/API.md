# shodan-ts API Reference

Welcome to the complete API reference for `shodan-ts`. The library is modularized to match the official Shodan API structure, providing a 1:1 mapping for every endpoint.

## Modules

Detailed documentation, parameter types, and code examples are split into the following modules:

* **[Core API](./Core.md):** Methods for searching hosts, managing alerts, account info, and directory lookups.
* **[Trends API](./Trends.md):** Methods for querying historical data and trends.
* **[Stream API](./Stream.md):** *(Planned for a future release)* Methods for consuming real-time Shodan data streams.

---

## Official Resources

If you need to cross-reference raw API responses, you can find the official Shodan developer documentation here:

* **[Shodan REST API Reference](https://developer.shodan.io/api)**
* **[Shodan Trends API Reference](https://developer.shodan.io/api/trends)**

## Endpoint Mapping Directory

Use the tables below to quickly find the `shodan-ts` method that corresponds to the official Shodan REST API endpoint you want to use.

### Search Methods

| Official Shodan Endpoint      | HTTP  | shodan-ts Method                          | Reference                                           |
|:------------------------------|:-----:|:------------------------------------------|:----------------------------------------------------|
| `/shodan/host/{ip}`           | `GET` | `client.getHostInformation(ip, options?)` | [View Docs](./Core.md#gethostinformationip-options) |
| `/shodan/host/count`          | `GET` | `client.countHosts(query, options?)`      | [View Docs](./Core.md#counthostsquery-options)      |
| `/shodan/host/search`         | `GET` | `client.searchHosts(query, options?)`     | [View Docs](./Core.md#searchhostsquery-options)     |
| `/shodan/host/search/facets`  | `GET` | `client.getSearchFacets(options?)`        | [View Docs](./Core.md#getsearchfacetsoptions)       |
| `/shodan/host/search/filters` | `GET` | `client.getSearchFilters(options?)`       | [View Docs](./Core.md#getsearchfiltersoptions)      |
| `/shodan/host/search/tokens`  | `GET` | `client.getSearchTokens(query, options?)` | [View Docs](./Core.md#getsearchtokensquery-options) |

### On-Demand Scanning Methods

| Official Shodan Endpoint |  HTTP  | `shodan-ts` Method                              | Reference                                                |
|:-------------------------|:------:|:------------------------------------------------|:---------------------------------------------------------|
| `/shodan/ports`          | `GET`  | `client.listPorts(options?)`                    | [View Docs](./Core.md#listportsoptions)                  |
| `/shodan/protocols`      | `GET`  | `client.listProtocols(options?)`                | [View Docs](./Core.md#listprotocolsoptions)              |
| `/shodan/scan`           | `POST` | `client.requestScan(targets, options?)`         | [View Docs](./Core.md#requestscantargets-options)        |
| `/shodan/scan/internet`  | `POST` | `client.scanInternet(port, protocol, options?)` | [View Docs](./Core.md#scaninternetport-protocol-options) |
| `/shodan/scans`          | `GET`  | `client.getScans(options?)`                     | [View Docs](./Core.md#getscansoptions)                   |
| `/shodan/scan/{id}`      | `GET`  | `client.getScan(scanId, options?)`              | [View Docs](./Core.md#getscanscanid-options)             |

### Network Alert Methods

| Official Shodan Endpoint                                |   HTTP   | `shodan-ts` Method                                                      | Reference                                                                       |
|:--------------------------------------------------------|:--------:|:------------------------------------------------------------------------|:--------------------------------------------------------------------------------|
| `/shodan/alert`                                         |  `POST`  | `client.createAlert(payload, options?)`                                 | [View Docs](./Core.md#createalertpayload-options)                               |
| `/shodan/alert/{id}/info`                               |  `GET`   | `client.getAlert(alertId, options?)`                                    | [View Docs](./Core.md#getalertalertid-options)                                  |
| `/shodan/alert/{id}`                                    | `DELETE` | `client.deleteAlert(alertId, options?)`                                 | [View Docs](./Core.md#deletealertalertid-options)                               |
| `/shodan/alert/{id}`                                    |  `POST`  | `client.modifyAlert(alertId, payload, options?)`                        | [View Docs](./Core.md#modifyalertalertid-payload-options)                       |
| `/shodan/alert/info`                                    |  `GET`   | `client.getAlerts(options?)`                                            | [View Docs](./Core.md#getalertsoptions)                                         |
| `/shodan/alert/triggers`                                |  `GET`   | `client.getTriggers(options?)`                                          | [View Docs](./Core.md#gettriggersoptions)                                       |
| `/shodan/alert/{id}/trigger/{trigger}`                  |  `PUT`   | `client.enableTriggerForAlert(alertId, triggers, options?)`             | [View Docs](./Core.md#enabletriggerforalertalertid-triggers-options)            |
| `/shodan/alert/{id}/trigger/{trigger}`                  | `DELETE` | `client.disableTriggerForAlert(alertId, triggers, options?)`            | [View Docs](./Core.md#disabletriggerforalertalertid-triggers-options)           |
| `/shodan/alert/{id}/trigger/{trigger}/ignore/{service}` |  `PUT`   | `client.ignoreServiceForTrigger(alertId, trigger, service, options?)`   | [View Docs](./Core.md#ignoreservicefortriggeralertid-trigger-service-options)   |
| `/shodan/alert/{id}/trigger/{trigger}/ignore/{service}` | `DELETE` | `client.unignoreServiceForTrigger(alertId, trigger, service, options?)` | [View Docs](./Core.md#unignoreservicefortriggeralertid-trigger-service-options) |
| `/shodan/alert/{id}/notifier/{notifier_id}`             |  `PUT`   | `client.addNotifierToAlert(alertId, notifierId, options?)`              | [View Docs](./Core.md#addnotifiertoalertalertid-notifierid-options)             |
| `/shodan/alert/{id}/notifier/{notifier_id}`             | `DELETE` | `client.removeNotifierFromAlert(alertId, notifierId, options?)`         | [View Docs](./Core.md#removenotifierfromalertalertid-notifierid-options)        |


### Notifiers Methods

| Official Shodan Endpoint |   HTTP   | `shodan-ts` Method                                     | Reference                                                       |
|:-------------------------|:--------:|:-------------------------------------------------------|:----------------------------------------------------------------|
| `/notifier`              |  `GET`   | `client.getNotifiers(options?)`                        | [View Docs](./Core.md#getnotifiersoptions)                      |
| `/notifier/provider`     |  `GET`   | `client.getNotificationProviders(options?)`            | [View Docs](./Core.md#getnotificationprovidersoptions)          |
| `/notifier`              |  `POST`  | `client.createNotifier(payload, options?)`             | [View Docs](./Core.md#createnotifierpayload-options)            |
| `/notifier/{id}`         | `DELETE` | `client.deleteNotifier(notifierId, options?)`          | [View Docs](./Core.md#deletenotifiernotifierid-options)         |
| `/notifier/{id}`         |  `GET`   | `client.getNotifier(notifierId, options?)`             | [View Docs](./Core.md#getnotifiernotifierid-options)            |
| `/notifier/{id}`         |  `PUT`   | `client.modifyNotifier(notifierId, payload, options?)` | [View Docs](./Core.md#modifynotifiernotifierid-payload-options) |

### Directory Methods
> **Note:** As of recent testing, Shodan's query directory endpoints appear to be deprecated or disabled on their backend and may consistently return `503 Service Unavailable` errors.

| Official Shodan Endpoint | HTTP  | `shodan-ts` Method                      | Reference                                         |
|:-------------------------|:-----:|:----------------------------------------|:--------------------------------------------------|
| `/shodan/query`          | `GET` | `client.getQueries(options?)`           | [View Docs](./Core.md#getqueriesoptions)          |
| `/shodan/query/search`   | `GET` | `client.searchQueries(query, options?)` | [View Docs](./Core.md#searchqueriesquery-options) |
| `/shodan/query/tags`     | `GET` | `client.getTags(options)`               | [View Docs](./Core.md#gettagsoptions)             |

### Bulk Data (Enterprise)

| Official Shodan Endpoint | HTTP  | `shodan-ts` Method                      | Reference                                          |
|:-------------------------|:-----:|:----------------------------------------|:---------------------------------------------------|
| `/shodan/data`           | `GET` | `client.getAvailableDatasets(options?)` | [View Docs](./Core.md#getavailabledatasetsoptions) |
| `/shodan/data/{dataset}` | `GET` | `client.getDataset(dataset, options?)`  | [View Docs](./Core.md#getdatasetdataset-options)   |

### Manage Organization (Enterprise)

| Official Shodan Endpoint |   HTTP   | `shodan-ts` Method                                  | Reference                                                     |
|:-------------------------|:--------:|:----------------------------------------------------|:--------------------------------------------------------------|
| `/org`                   |  `GET`   | `client.getOrganization(options?)`                  | [View Docs](./Core.md#getorganizationoptions)                 |
| `/org/member/{user}`     |  `PUT`   | `client.addUserToOrganization(user, options?)`      | [View Docs](./Core.md#addusertoorganizationuser-options)      |
| `/org/member/{user}`     | `DELETE` | `client.deleteUserFromOrganization(user, options?)` | [View Docs](./Core.md#deleteuserfromorganizationuser-options) |

### Account Methods

| Official Shodan Endpoint | HTTP  | `shodan-ts` Method            | Reference                                |
|:-------------------------|:-----:|:------------------------------|:-----------------------------------------|
| `/account/profile`       | `GET` | `client.getProfile(options?)` | [View Docs](./Core.md#getprofileoptions) |

### DNS Methods

| Official Shodan Endpoint | HTTP  | `shodan-ts` Method                         | Reference                                            |
|:-------------------------|:-----:|:-------------------------------------------|:-----------------------------------------------------|
| `/dns/domain/{domain}`   | `GET` | `client.dnsInfo(hostname, options?)`       | [View Docs](./Core.md#dnsinfohostname-options)       |
| `/dns/resolve`           | `GET` | `client.dnsResolve(hostnames, options?)`   | [View Docs](./Core.md#dnsresolvehostnames-options)   |
| `/dns/reverse`           | `GET` | `client.dnsReverse(ipAddresses, options?)` | [View Docs](./Core.md#dnsreverseipaddresses-options) |

### Utility Methods

| Official Shodan Endpoint | HTTP  | `shodan-ts` Method                       | Reference                                           |
|:-------------------------|:-----:|:-----------------------------------------|:----------------------------------------------------|
| `/tools/httpheaders`     | `GET` | `client.showClientHttpHeaders(options?)` | [View Docs](./Core.md#showclienthttpheadersoptions) |
| `/tools/myip`            | `GET` | `client.showMyIp(options?)`              | [View Docs](./Core.md#showmyipoptions)              |

### API Status Methods

| Official Shodan Endpoint | HTTP  | `shodan-ts` Method            | Reference                                |
|:-------------------------|:-----:|:------------------------------|:-----------------------------------------|
| `/api-info`              | `GET` | `client.getApiInfo(options?)` | [View Docs](./Core.md#getapiinfooptions) |


### Historical Data / Trends (Enterprise)
> **Base URL:** `https://trends.shodan.io`

| Official Shodan Endpoint | HTTP  | `shodan-ts` Method                                  | Reference                                                       |
|:-------------------------|:-----:|:----------------------------------------------------|:----------------------------------------------------------------|
| `/api/v1/search`         | `GET` | `client.searchHistoricalData(filterType, options?)` | [View Docs](./Trends.md#searchhistoricaldatafiltertype-options) |
| `/api/v1/search/filters` | `GET` | `client.getTrendFilters(options?)`                  | [View Docs](./Trends.md#gettrendfiltersoptions)                 |
| `/api/v1/search/facets`  | `GET` | `client.getTrendFacets(options?)`                   | [View Docs](./Trends.md#gettrendfacetsoptions)                  |