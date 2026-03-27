<div align="center">
  <h1>shodan-ts</h1>
  <p>A modern, zero-dependency, strongly-typed Node.js client for the Shodan API with native ESM and CommonJS support.</p>

[![CI Pipeline](https://github.com/gyarmathy-gabor/shodan-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/gyarmathy-gabor/shodan-ts/actions/workflows/ci.yml)
[![CodeQL Analysis](https://github.com/gyarmathy-gabor/shodan-ts/actions/workflows/codeql.yml/badge.svg)](https://github.com/gyarmathy-gabor/shodan-ts/actions/workflows/codeql.yml)
[![npm downloads](https://img.shields.io/npm/dy/shodan-ts.svg)](https://www.npmjs.com/package/shodan-ts)
[![npm version](https://img.shields.io/npm/v/shodan-ts.svg?color=success)](https://www.npmjs.com/package/shodan-ts)
[![Node version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

</div>

---

## Features
- **Zero Dependencies:** Uses the native Node.js `fetch` API.
- **TypeScript:** Includes type definitions for all Shodan API requests and responses.
- **Dual Support:** Works with both ESM (`import`) and CommonJS (`require`).
- **Full REST API Coverage:** Implements the complete Shodan REST API (Core and Trends).

## Prerequisites
* **Node.js**: `v18.0.0` or higher (Required for native `fetch` support).

## Installation

```bash
# Using npm
npm install shodan-ts

# Using yarn
yarn add shodan-ts

# Using pnpm
pnpm add shodan-ts
```

## Quick Start

### Basic Example
Initialize the client and fetch your account profile. `shodan-ts` supports both ESM and CommonJS.

```typescript
import { createShodanClient } from 'shodan-ts';

// 1. Initialize the client
const client = createShodanClient(process.env.SHODAN_API_KEY!);

// 2. Make your request
const profile = await client.getProfile();
console.log(`Hello ${profile.username}! You have ${profile.credits} credits.`);
```

### Client Configuration
You can pass an optional configuration object to manage timeouts and retries.

```typescript
const client = createShodanClient(process.env.SHODAN_API_KEY!, {
  timeout: 15000, // Abort the request if it takes longer than 15 seconds
  retries: 2,     // Automatically retry failed server-side requests
});
```

### Search and Error Handling
For production scripts, you can use the custom error classes to handle API errors.

```typescript
import { createShodanClient, ShodanApiError } from 'shodan-ts';

const client = createShodanClient(process.env.SHODAN_API_KEY!);

async function searchNginx() {
  try {
    const result = await client.searchHosts('product:nginx country:DE', {
      minify: true, // Only fetch essential data to save bandwidth
      timeout: 10000, // Can even override global timeout for any specific request
    });
    
    console.log(`Found ${result.total.toLocaleString()} NGINX servers in Germany.`);

    const hostInfo = await client.getHostInformation('8.8.8.8');
    console.log(hostInfo ? `Host Org: ${hostInfo.org}` : 'No info found for 8.8.8.8');

  } catch (error) {
    if (error instanceof ShodanApiError) {
      console.error(`Shodan Error [${error.status}]: ${error.message}`);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

searchNginx();
```

## API Documentation
For a complete list of available methods, configuration options, and TypeScript interfaces, please refer to the full documentation:
- **[Library API Documentation](./docs/API.md)**
- **[Advanced Examples](./examples)**
- **[Official Shodan API Developer Docs](https://developer.shodan.io/api)**

## Error Handling
The library provides custom error classes to help you easily distinguish between configuration issues and API failures:
### ShodanConfigError
Thrown when the API key is missing/invalid, or when initializing the client with invalid parameters.

### ShodanApiError
Thrown when the Shodan API returns a non-200 HTTP status code.
- **status**: The HTTP status code (e.g., `401`, `429`, `500`).
- **statusText**: The status message from the server (e.g., "Too Many Requests").
- **url**: The specific API endpoint that failed.
- **message**: The error description provided by Shodan or the fetch agent.

> **Important:** The Shodan API allows one request per second. If you exceed this multiple times consecutively, the API will return a `429` response that typically persists for 5–10 minutes for your IP. This library does not internally throttle requests therefore, users should implement their own delays for bulk operations.

---

## Contributing
Contributions are welcome! Please read the [Contribution Guidelines](./CONTRIBUTING.md) before submitting a pull request.

## License
This project is licensed under the ISC license.
