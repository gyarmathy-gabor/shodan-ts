import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildDirectoryMethods } from '../../../src/modules/core/directoryMethods';
import {
  mockGetQueriesResponse,
  mockGetTagsResponse,
  mockSearchQueriesResponse,
} from '../../test-data/directory.data';

const fetchMock = vi.fn();

describe('directoryMethods', () => {
  const directoryMethods = buildDirectoryMethods('https://api.shodan.io', 'API_KEY', {
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

  it('getQueries should send the correct URL and return parsed data', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockGetQueriesResponse,
    });

    const result = await directoryMethods.getQueries();

    expect(result.total).toBe(6746);
    expect(result.matches[0]?.title).toBe('ip camera');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/query?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('getQueries should append query parameters when provided', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockGetQueriesResponse,
    });

    await directoryMethods.getQueries({ page: 2, sort: 'votes', order: 'desc' });

    const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(lastCallUrl).toContain('page=2');
    expect(lastCallUrl).toContain('sort=votes');
    expect(lastCallUrl).toContain('order=desc');
  });

  it('searchQueries should send the correct URL with search term', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockSearchQueriesResponse,
    });

    const result = await directoryMethods.searchQueries('webcam', { page: 1 });

    expect(result.total).toBe(309);

    const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(lastCallUrl).toContain('query=webcam');
    expect(lastCallUrl).toContain('page=1');
    expect(lastCallUrl).toContain('/shodan/query/search');
  });

  it('getTags should send the correct URL and return tags', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockGetTagsResponse,
    });

    const result = await directoryMethods.getTags({ size: 10 });

    expect(result.matches).toHaveLength(3);
    expect(result.matches[0]?.value).toBe('webcam');

    const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(lastCallUrl).toContain('size=10');
    expect(lastCallUrl).toContain('/shodan/query/tags');
  });
});
