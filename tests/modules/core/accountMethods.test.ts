import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildAccountMethods } from '../../../src/modules/core/accountMethods';
import { mockAccountProfileResponse } from '../../test-data/account.data';

const fetchMock = vi.fn();

describe('accountMethods', () => {
  const accountMethods = buildAccountMethods('https://api.shodan.io', 'API_KEY', {
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

  it('getProfile should send the correct URL and return account data', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockAccountProfileResponse,
    });

    const result = await accountMethods.getProfile();

    expect(result.member).toBe(true);
    expect(result.credits).toBe(20);
    expect(result.username).toBe('shodan_user_123');
    expect(result.display_name).toBeNull();
    expect(result.created).toBe('2020-07-16T17:59:52.856000');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/account/profile?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
