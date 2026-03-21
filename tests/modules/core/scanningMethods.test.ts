import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildScanningMethods } from '../../../src/modules/core/scanningMethods';
import {
  mockActiveScansResponse,
  mockInternetScanResponse,
  mockListPortsResponse,
  mockListProtocolsResponse,
  mockRequestScanResponse,
  mockScanStatusResponse,
} from '../../test-data/scanning.data';

const fetchMock = vi.fn();

describe('scanningMethods', () => {
  const scanningMethods = buildScanningMethods('https://api.shodan.io', 'API_KEY', {
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

  it('listPorts should return an array of port numbers', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockListPortsResponse,
    });

    const result = await scanningMethods.listPorts();

    expect(result).toContain(80);
    expect(result).toContain(443);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/ports?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('listProtocols should return a dictionary of protocols', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockListProtocolsResponse,
    });

    const result = await scanningMethods.listProtocols();

    expect(result.afp).toBeDefined();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/protocols?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  describe('requestScan', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockRequestScanResponse,
      });
    });

    it('should handle a comma-separated string of IPs', async () => {
      await scanningMethods.requestScan('8.8.8.8,1.1.1.1');
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.shodan.io/shodan/scan?key=API_KEY',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ ips: '8.8.8.8,1.1.1.1' }),
        }),
      );
    });

    it('should handle an array of IP strings', async () => {
      await scanningMethods.requestScan(['8.8.8.8', '1.1.1.1']);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.shodan.io/shodan/scan?key=API_KEY',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ ips: '8.8.8.8,1.1.1.1' }),
        }),
      );
    });

    it('should handle an object mapping IPs to services', async () => {
      const complexPayload = { '1.1.1.1': [[443, 'https']] as [number, string][] };
      await scanningMethods.requestScan(complexPayload);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.shodan.io/shodan/scan?key=API_KEY',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ ips: complexPayload }),
        }),
      );
    });
  });

  it('scanInternet should send POST with port and protocol body', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockInternetScanResponse,
    });

    const result = await scanningMethods.scanInternet(443, 'https');

    expect(result.id).toBe('TcjcsMfPcw4o7O84');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/scan/internet?key=API_KEY',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ port: 443, protocol: 'https' }),
      }),
    );
  });

  it('getScans should return a listing of active scans', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockActiveScansResponse,
    });

    const result = await scanningMethods.getScans();

    expect(result.total).toBe(19);
    expect(result.matches[0]?.status).toBe('PROCESSING');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/scans?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('getScan should return the status of a specific scan ID', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockScanStatusResponse,
    });

    const result = await scanningMethods.getScan('Mo8W7itcWumiy9Ay');

    expect(result.status).toBe('DONE');
    expect(result.id).toBe('Mo8W7itcWumiy9Ay');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/shodan/scan/Mo8W7itcWumiy9Ay?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
