import { request } from '../../utils/fetcher';
import { ShodanClientOptions, ShodanRequestOptions } from '../../types/options';
import { ApiInfo } from '../../types/apiStatus';

export const buildApiStatusMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * Returns information about the API plan belonging to the given API key.
   * @param options - Optional configuration for this request.
   */
  getApiInfo: async (options?: ShodanRequestOptions): Promise<ApiInfo> =>
    request(baseUrl, 'api-info', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    }),
});
