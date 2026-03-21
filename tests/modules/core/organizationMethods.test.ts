import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildOrganizationMethods } from '../../../src/modules/core/organizationMethods';
import {
  mockGetOrganizationResponse,
  mockOrganizationActionResponse,
} from '../../test-data/organization.data';

const fetchMock = vi.fn();

describe('organizationMethods', () => {
  const organizationMethods = buildOrganizationMethods('https://api.shodan.io', 'API_KEY', {
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

  it('getOrganization should send the correct URL and return parsed data', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockGetOrganizationResponse,
    });

    const result = await organizationMethods.getOrganization();

    expect(result.id).toBe('p3cEAmoDapAPeP7w');
    expect(result.admins[0]?.username).toBe('admin');
    expect(result.domains).toContain('shodan.io');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/org?key=API_KEY',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('addUserToOrganization should send PUT request with default notify param', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockOrganizationActionResponse,
    });

    const result = await organizationMethods.addUserToOrganization('new_member');

    expect(result.success).toBe(true);

    const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(lastCallUrl).toContain('org/member/new_member');
    expect(lastCallUrl).toContain('notify=true');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('addUserToOrganization should allow custom notify parameter', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockOrganizationActionResponse,
    });

    await organizationMethods.addUserToOrganization('silent_member', { notify: false });

    const lastCallUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(lastCallUrl).toContain('notify=false');
  });

  it('deleteUserFromOrganization should send DELETE request to correct URL', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockOrganizationActionResponse,
    });

    const result = await organizationMethods.deleteUserFromOrganization('old_member');

    expect(result.success).toBe(true);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.shodan.io/org/member/old_member?key=API_KEY',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
