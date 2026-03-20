import { request } from '../../utils/fetcher';
import { ShodanClientOptions, ShodanRequestOptions } from '../../types/options';

export const buildAccountMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * Returns information about the Shodan account linked to this API key.
   * @param options - Optional configuration for this request.
   */
  getProfile: async (options?: ShodanRequestOptions) => {
    return request(baseUrl, 'account/profile', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
});
