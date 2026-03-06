import { request } from '../../utils/fetcher';
import { HostInformationOptions, HostInformationResponse } from '../../types/search';

export const buildSearchMethods = (baseUrl: string, apiKey: string) => ({
  /**
   * Returns all services that have been found on the given host IP.
   * @param ip - Host IP address
   * @param options - optional parameters:
   *  - history: True if all historical banners should be returned (default: False)
   *  - minify: True to only return the list of ports and the general host information, no banners. (default: False)
   * @remarks
   * Note: The official Shodan API returns a 404 error if you set history to true and the IP has no historical banners.
   * It also returns a 404 error when it can't find anything about the given ip.
   * To prevent crashes, this method catches 404 errors and returns `null` instead.
   */
  getHostInformation: async (
    ip: string,
    options?: HostInformationOptions,
  ): Promise<HostInformationResponse | null> => {
    try {
      return await request(baseUrl, `shodan/host/${ip}`, apiKey, {
        params: options as Record<string, boolean | undefined>,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  },
});
