import { buildHistoricalDataMethods } from './historicalData';
import { SHODAN_TRENDS_URL } from '../../constants';
import { ShodanClientOptions } from '../../types/options';

export const buildTrendsModule = (apiKey: string, options: Required<ShodanClientOptions>) => ({
  ...buildHistoricalDataMethods(SHODAN_TRENDS_URL, apiKey, options),
});
