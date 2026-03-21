import { Dataset, DatasetFile } from '../../src/types/bulkData';

export const mockGetAvailableDatasetsResponse: Dataset[] = [
  {
    scope: 'monthly',
    name: 'country',
    description: 'Data broken down by country of the device',
  },
  {
    scope: 'daily',
    name: 'ships',
    description: 'AIS data from public receivers',
  },
  {
    scope: 'daily',
    name: 'ping',
    description:
      'Ping sweeps of the entire IPv4 as well as statistical breakdown of devices by country',
  },
  {
    scope: 'monthly',
    name: 'dnsdb',
    description: 'DNS data for active domains on the Internet',
  },
  {
    scope: 'daily',
    name: 'raw-daily',
    description: 'Data files containing all the information collected during a day',
  },
];

export const mockGetDatasetResponse: DatasetFile[] = [
  {
    url: 'https://...',
    timestamp: 1611711401000,
    sha1: '5a91f49c90da5ab8856c83c84846941115c55441',
    name: '2021-01-26.json.gz',
    size: 104650655998,
  },
  {
    url: 'https://...',
    timestamp: 1611655444000,
    sha1: 'ea29acc25fc154ac64dde0ab294824ae7f1f64c9',
    name: '2021-01-25.json.gz',
    size: 152517565458,
  },
  {
    url: 'https://...',
    timestamp: 1611540775000,
    sha1: 'aed18f2a952df7731fec447d81ead8a96907000d',
    name: '2021-01-24.json.gz',
    size: 161275556509,
  },
];
