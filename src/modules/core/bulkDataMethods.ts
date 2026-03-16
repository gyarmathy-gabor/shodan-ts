import { request } from '../../utils/fetcher';
import { ShodanClientOptions, ShodanRequestOptions } from '../../types/options';

export const buildBulkDataMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * Use this method to see a list of the datasets that are available for download.
   * @param options - Optional configuration for this request.
   */
  getAvailableDatasets: async (options?: ShodanRequestOptions) => {
    return await request(baseUrl, '/shodan/data', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
  /**
   * Get a list of files that are available for download from the provided dataset.
   * @param dataset - Name of the dataset
   * @param options - Optional configuration for this request.
   */
  getDataset: async (dataset: string, options?: ShodanRequestOptions) => {
    return await request(baseUrl, `shodan/data/${dataset}`, apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
});
