import { buildCoreModule } from './modules/core';
//import { buildStreamModule } from './modules/stream';
import { buildTrendsModule } from './modules/trends';
import { ShodanClientOptions } from './types/options';

export const createShodanClient = (apiKey: string, options?: ShodanClientOptions) => {
  if (!apiKey) {
    throw new Error('A Shodan API key is required to initialize the client.');
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
