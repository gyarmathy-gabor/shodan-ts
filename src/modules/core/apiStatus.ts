import { request } from '../../utils/fetcher';
import { ShodanClientOptions, ShodanRequestOptions } from '../../types/options';

export const buildApiStatusMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * Returns information about the API plan belonging to the given API key.
   */
  getApiInfo: async (options?: ShodanRequestOptions) =>
    request(baseUrl, 'api-info', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    }),
});
