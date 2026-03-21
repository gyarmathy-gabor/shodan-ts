import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildApiStatusMethods } from '../../../src/modules/core/apiStatus';
import { mockApiInfoResponse } from '../../test-data/apiStatus.data';

const fetchMock = vi.fn();

describe('apiStatusMethods', () => {
  const apiStatusMethods = buildApiStatusMethods('https://api.shodan.io', 'API_KEY', {
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

  it('getApiInfo should send the correct URL and return api info data', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockApiInfoResponse,
    });

    const result = await apiStatusMethods.getApiInfo();

    expect(result.plan).toBe('dev');
    expect(result.usage_limits.scan_credits).toBe(100);
    expect(result.scan_credits).toBe(96);
    expect(result.https).toBe(false);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/api-info?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
