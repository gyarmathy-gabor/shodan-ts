import { HistoricalDataResponse } from '../../src/types/historical';

export const mockHistoricalDataResponse: HistoricalDataResponse = {
  total: 1464808820,
  matches: [
    { month: '2017-06', count: 9038297 },
    { month: '2017-07', count: 9622979 },
  ],
  facets: {
    country: [
      {
        key: '2017-06',
        values: [
          { count: 3050586, value: 'US' },
          { count: 977320, value: 'CN' },
        ],
      },
      {
        key: '2017-07',
        values: [
          { count: 3212240, value: 'US' },
          { count: 1111340, value: 'CN' },
        ],
      },
    ],
  },
};

export const mockTrendFacetsResponse: string[] = ['asn', 'city', 'country', 'domain'];

export const mockTrendFiltersResponse: string[] = ['all', 'asn', 'city', 'country'];
