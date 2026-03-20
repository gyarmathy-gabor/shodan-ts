import { buildCoreModule } from './modules/core';
//import { buildStreamModule } from './modules/stream';
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
    //...buildStreamModule(apiKey),
    ...buildTrendsModule(apiKey, finalOptions),
  };
};
