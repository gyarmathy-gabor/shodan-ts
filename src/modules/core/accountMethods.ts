import { request } from '../../utils/fetcher';

export const buildAccountMethods = (baseUrl: string, apiKey: string) => ({
  /**
   * Returns information about the Shodan account linked to this API key.
   */
  getProfile: async () => {
    return await request(baseUrl, 'account/profile', apiKey);
  },
});
