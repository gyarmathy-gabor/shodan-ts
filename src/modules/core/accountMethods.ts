import { request } from '../../utils/fetcher';

export const buildAccountMethods = (baseUrl: string, apiKey: string) => ({
  getProfile: async () => {
    return await request(baseUrl, 'account/profile', apiKey);
  },
});
