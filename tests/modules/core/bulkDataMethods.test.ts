import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildBulkDataMethods } from '../../../src/modules/core/bulkDataMethods';
import {
  mockGetAvailableDatasetsResponse,
  mockGetDatasetResponse,
} from '../../test-data/bulkData.data';

const fetchMock = vi.fn();

describe('bulkDataMethods', () => {
  const bulkDataMethods = buildBulkDataMethods('https://api.shodan.io', 'API_KEY', {
    timeout: 5000,
    retries: 0,
  });

  beforeEach(() => {
    fetchMock.mockClear();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getAvailableDatasets should send the correct URL and return an array of datasets', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockGetAvailableDatasetsResponse,
    });

    const result = await bulkDataMethods.getAvailableDatasets();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(5);
    expect(result[0]?.name).toBe('country');
    expect(result[0]?.scope).toBe('monthly');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/data?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('getDataset should send the correct URL and return an array of dataset files', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockGetDatasetResponse,
    });

    const result = await bulkDataMethods.getDataset('raw-daily');

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    expect(result[0]?.name).toBe('2021-01-26.json.gz');
    expect(result[0]?.size).toBe(104650655998);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/data/raw-daily?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
