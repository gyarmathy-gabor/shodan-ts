import { request } from '../../utils/fetcher';
import { ShodanClientOptions, ShodanRequestOptions } from '../../types/options';

export const buildUtilityMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * Shows the HTTP headers that your client sends when connecting to a webserver.
   */
  showClientHttpHeaders: async (options?: ShodanRequestOptions) =>
    await request(baseUrl, '/tools/httpheaders', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    }),

  /**
   * Get your current IP address as seen from the Internet.
   */
  showMyIp: async (options?: ShodanRequestOptions) =>
    await request(baseUrl, '/tools/myip', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    }),
});
