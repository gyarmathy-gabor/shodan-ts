import { buildCoreModule } from './modules/core';
import { buildTrendsModule } from './modules/trends';
import { ShodanClientOptions } from './types/options';
import { ShodanConfigError } from './errors';

export * from './errors';
export * from './types/options';
export * from './types/facets';
export * from './types/filters';
export * from './types/scan';
export * from './types/search';
export * from './types/alerts';
export * from './types/directory';
export * from './types/account';
export * from './types/apiStatus';
export * from './types/bulkData';
export * from './types/dns';
export * from './types/historical';
export * from './types/organization';
export * from './types/notifiers';

/**
 * Creates a new Shodan client instance with the provided API key and options.
 * @param apiKey - Your official Shodan API key.
 * @param options - Global configuration options for the client.
 */
export const createShodanClient = (apiKey: string, options?: ShodanClientOptions) => {
  if (!apiKey) {
    throw new ShodanConfigError('A Shodan API key is required to initialize the client.');
  }

  const finalOptions: Required<ShodanClientOptions> = {
    timeout: options?.timeout ?? 10000,
    retries: options?.retries ?? 0,
  };

  if (finalOptions.retries < 0) {
    throw new ShodanConfigError('Retries must be a non-negative number');
  }

  if (finalOptions.timeout < 0) {
    throw new ShodanConfigError('Timeout must be a non-negative number');
  }

  return {
    ...buildCoreModule(apiKey, finalOptions),
    ...buildTrendsModule(apiKey, finalOptions),
  };
};
