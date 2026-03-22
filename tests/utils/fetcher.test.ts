import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { request } from '../../src/utils/fetcher';
import { ShodanApiError, ShodanConfigError } from '../../src/errors';

const fetchMock = vi.fn();

describe('fetcher retry logic', () => {
  beforeEach(() => {
    fetchMock.mockClear();
    vi.stubGlobal('fetch', fetchMock);

    // Hijack global timers (setTimeout)
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();

    vi.useRealTimers();
  });

  it('should retry on 500 errors and succeed on the next attempt', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server exploded' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

    const requestPromise = request('https://api.shodan.io', 'test', 'KEY', { retries: 1 });

    await vi.runAllTimersAsync();

    const result = await requestPromise;

    expect(fetchMock).toHaveBeenCalledTimes(2); // Initial try + 1 retry
    expect(result).toEqual({ success: true });
  });

  it('should throw an error after exhausting all retries', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      json: async () => ({ error: 'Gateway down' }),
    });

    const requestPromise = request('https://api.shodan.io', 'test', 'KEY', { retries: 2 });

    const expectPromise = expect(requestPromise).rejects.toThrow(ShodanApiError);

    await vi.runAllTimersAsync();

    await expectPromise;

    expect(fetchMock).toHaveBeenCalledTimes(3); // Initial try + 2 retries
  });

  it('should NOT retry on 4xx client errors', async () => {
    // Fail with a 401 Unauthorized
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: 'Invalid API Key' }),
    });

    const requestPromise = request('https://api.shodan.io', 'test', 'KEY', { retries: 3 });

    await expect(requestPromise).rejects.toThrow(ShodanApiError);

    // Even though retries = 3, it should abort immediately because 401 is not >= 500
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should throw ShodanConfigError if retries is a negative number', async () => {
    const requestPromise = request('https://api.shodan.io', 'test', 'KEY', {
      retries: -1,
    });

    await expect(requestPromise).rejects.toThrow(ShodanConfigError);
    await expect(requestPromise).rejects.toThrow(/Invalid retry count/);

    expect(fetchMock).toHaveBeenCalledTimes(0);
  });
});
