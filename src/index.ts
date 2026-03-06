import { buildCoreModule } from './modules/core';
//import { buildStreamModule } from './modules/stream';
import { buildTrendsModule } from './modules/trends';

export const createShodanClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error('A Shodan API key is required');
  }

  return {
    ...buildCoreModule(apiKey),
    //...buildStreamModule(apiKey),
    ...buildTrendsModule(apiKey),
  };
};
