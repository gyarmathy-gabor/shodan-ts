import { request } from '../../utils/fetcher';
import {
  AddUserToOrganizationOptions,
  ShodanClientOptions,
  ShodanRequestOptions,
} from '../../types/options';

export const buildOrganizationMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * Get information about your organization such as the list of its members, upgrades, authorized domains, and more.
   * @param options - Optional configuration for this request.
   */
  getOrganization: async (options?: ShodanRequestOptions) => {
    return request(baseUrl, 'org', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
  /**
   * Add a Shodan user to the organization and upgrade them.
   * @param user - Username or email of the Shodan user.
   * @param options - Optional configuration for this request.
   */
  addUserToOrganization: async (user: string, options?: AddUserToOrganizationOptions) => {
    const notify = options?.notify ?? true;

    return request(baseUrl, `org/member/${user}`, apiKey, {
      method: 'PUT',
      params: { notify: notify },
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
  /**
   * Remove and downgrade the provided member from the organization.
   * @param user - Username or email of the Shodan user
   * @param options - Optional configuration for this request.
   */
  deleteUserFromOrganization: async (user: string, options?: ShodanRequestOptions) => {
    return request(baseUrl, `org/member/${user}`, apiKey, {
      method: 'DELETE',
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
});
