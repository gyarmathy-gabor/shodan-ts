import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildUtilityMethods } from '../../../src/modules/core/utilityMethods';
import { mockHttpHeadersResponse, mockMyIpResponse } from '../../test-data/utility.data';

const fetchMock = vi.fn();

describe('utilityMethods', () => {
  const utilityMethods = buildUtilityMethods('https://api.shodan.io', 'API_KEY', {
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

  it('showClientHttpHeaders should return header mapping', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockHttpHeadersResponse,
    });

    const result = await utilityMethods.showClientHttpHeaders();

    expect(result['Host']).toBe('api.shodan.io');
    expect(result['User-Agent']).toContain('shodan-ts');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/tools/httpheaders?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('showMyIp should return the IP address as a string', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockMyIpResponse,
    });

    const result = await utilityMethods.showMyIp();

    expect(typeof result).toBe('string');
    expect(result).toBe('192.168.1.1');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/tools/myip?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
