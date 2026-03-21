import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildAlertMethods } from '../../../src/modules/core/alertMethods';
import {
  mockAlertActionResponse,
  mockNetworkAlert,
  mockNetworkAlerts,
  mockTriggers,
} from '../../test-data/alerts.data';

const fetchMock = vi.fn();

describe('alertMethods', () => {
  const alertMethods = buildAlertMethods('https://api.shodan.io', 'API_KEY', {
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

  it('createAlert should send POST with JSON body and return alert info', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockNetworkAlert,
    });

    const payload = {
      name: 'DNS Alert',
      filters: { ip: ['8.8.8.8', '1.1.1.1'] },
    };
    const result = await alertMethods.createAlert(payload);

    expect(result.id).toBe('OYPRB8IR9Z35AZPR');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert?key=API_KEY',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  });

  it('getAlert should request the correct URL', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockNetworkAlert });
    await alertMethods.getAlert('OYPRB8IR9Z35AZPR');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert/OYPRB8IR9Z35AZPR/info?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('deleteAlert should send a DELETE request', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockAlertActionResponse });
    const result = await alertMethods.deleteAlert('OYPRB8IR9Z35AZPR');
    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert/OYPRB8IR9Z35AZPR?key=API_KEY',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('modifyAlert should send POST with updated filters', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockNetworkAlert });
    const payload = { filters: { ip: ['1.1.1.1'] } };
    await alertMethods.modifyAlert('OYPRB8IR9Z35AZPR', payload);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert/OYPRB8IR9Z35AZPR?key=API_KEY',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  });

  it('getAlerts should return an array of active alerts', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockNetworkAlerts });
    const result = await alertMethods.getAlerts();
    expect(result).toHaveLength(2);
    expect(result[1]?.id).toBe('RIO8WNQZMI4ZQXW6');
  });

  it('getTriggers should return an array of available triggers', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockTriggers });
    const result = await alertMethods.getTriggers();
    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe('any');
  });

  it('enableTriggerForAlert should convert array of triggers to comma string (PUT)', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockAlertActionResponse });
    await alertMethods.enableTriggerForAlert('ALERT_ID', ['malware', 'any']);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert/ALERT_ID/trigger/malware,any?key=API_KEY',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('enableTriggerForAlert should keep single string of trigger (PUT)', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockAlertActionResponse });
    await alertMethods.enableTriggerForAlert('ALERT_ID', 'malware');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert/ALERT_ID/trigger/malware?key=API_KEY',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('disableTriggerForAlert should convert array of triggers to comma string (DELETE)', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockAlertActionResponse });
    await alertMethods.disableTriggerForAlert('ALERT_ID', ['malware,any']);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert/ALERT_ID/trigger/malware,any?key=API_KEY',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('disableTriggerForAlert should keep single string of trigger (DELETE)', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockAlertActionResponse });
    await alertMethods.disableTriggerForAlert('ALERT_ID', 'malware');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert/ALERT_ID/trigger/malware?key=API_KEY',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('ignoreServiceForTrigger should map trigger and service correctly (PUT)', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockAlertActionResponse });
    await alertMethods.ignoreServiceForTrigger('ALERT_ID', 'malware', '1.1.1.1:80');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert/ALERT_ID/trigger/malware/ignore/1.1.1.1:80?key=API_KEY',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('unignoreServiceForTrigger should map trigger and service correctly (DELETE)', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockAlertActionResponse });
    await alertMethods.unignoreServiceForTrigger('ALERT_ID', 'malware', '1.1.1.1:80');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert/ALERT_ID/trigger/malware/ignore/1.1.1.1:80?key=API_KEY',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('addNotifierToAlert should send a PUT request with notifier ID', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockAlertActionResponse });
    await alertMethods.addNotifierToAlert('ALERT_ID', 'NOTIFIER_ID');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert/ALERT_ID/notifier/NOTIFIER_ID?key=API_KEY',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('removeNotifierFromAlert should send a DELETE request with notifier ID', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => mockAlertActionResponse });
    await alertMethods.removeNotifierFromAlert('ALERT_ID', 'NOTIFIER_ID');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/alert/ALERT_ID/notifier/NOTIFIER_ID?key=API_KEY',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
