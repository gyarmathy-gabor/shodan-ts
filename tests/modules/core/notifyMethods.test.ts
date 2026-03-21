import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildNotifyMethods } from '../../../src/modules/core/notifyMethods';
import {
  mockActionSuccessResponse,
  mockGetNotificationProviderResponse,
  mockGetNotifiersResponse,
  mockSaveNotifierResponse,
} from '../../test-data/notifiers.data';

const fetchMock = vi.fn();

describe('notifyMethods', () => {
  const notifyMethods = buildNotifyMethods('https://api.shodan.io', 'API_KEY', {
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

  it('getNotifiers should send the correct URL and return parsed data', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockGetNotifiersResponse,
    });

    const result = await notifyMethods.getNotifiers();

    expect(result.total).toBe(2);
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0]?.id).toBe('default');
    expect(result.matches[1]?.provider).toBe('email');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/notifier?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('getNotificationProviders should send the correct URL and return parsed data', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockGetNotificationProviderResponse,
    });

    const result = await notifyMethods.getNotificationProviders();

    expect(result.email?.required).toContain('to');
    expect(result.slack?.required).toContain('webhook_url');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/notifier/provider?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('createNotifier should send the correct URL with Form Data and return parsed data', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockSaveNotifierResponse,
    });

    const result = await notifyMethods.createNotifier({
      provider: 'email',
      to: 'test@example.com',
    });

    expect(result.id).toBe('BCAp3Yk1NrLTDxgR');
    expect(result.success).toBe(true);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/notifier?key=API_KEY',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(URLSearchParams),
      }),
    );
    const passedBody = fetchMock.mock.calls[0]?.[1]?.body as URLSearchParams;
    expect(passedBody.toString()).not.toBe('');
  });

  it('deleteNotifier should send the correct URL and return parsed data', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockActionSuccessResponse,
    });

    const result = await notifyMethods.deleteNotifier('default');

    expect(result.success).toBe(true);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/notifier/default?key=API_KEY',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('getNotifier should send the correct URL and return parsed data', async () => {
    const singleNotifierMock = mockGetNotifiersResponse.matches[0];

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => singleNotifierMock,
    });

    const result = await notifyMethods.getNotifier('default');

    expect(result?.id).toBe('default');
    expect(result?.provider).toBe('email');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/notifier/default?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('modifyNotifier should send the correct URL with Form Data and return parsed data', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockSaveNotifierResponse,
    });

    const result = await notifyMethods.modifyNotifier('default', {
      provider: 'email',
      to: 'new-email@example.com',
    });

    expect(result.id).toBe('BCAp3Yk1NrLTDxgR');
    expect(result.success).toBe(true);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/notifier/default?key=API_KEY',
      expect.objectContaining({
        method: 'PUT',
        body: expect.any(URLSearchParams),
      }),
    );
  });
});
