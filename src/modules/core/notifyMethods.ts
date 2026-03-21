import { ShodanClientOptions, ShodanRequestOptions } from '../../types/options';
import { request } from '../../utils/fetcher';
import {
  ActionSuccessResponse,
  CreateNotifierPayload,
  SaveNotifierResponse,
  GetNotificationProviderResponse,
  GetNotifiersResponse,
  Notifier,
} from '../../types/notifiers';

export const buildNotifyMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * Get a list of all the notifiers that the user has created.
   * @param options - Optional configuration for this request.
   */
  getNotifiers: async (options?: ShodanRequestOptions): Promise<GetNotifiersResponse> => {
    return request(baseUrl, '/notifier', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Get a list of all the notification providers that are available
   * and the parameters to submit when creating them.
   * @param options - Optional configuration for this request.
   */
  getNotificationProviders: async (
    options?: ShodanRequestOptions,
  ): Promise<GetNotificationProviderResponse> => {
    return request(baseUrl, '/notifier/provider', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Use this method to create a new notification service endpoint that Shodan services can send notifications through.
   * @param payload - The configuration payload specifying the provider and its required arguments.
   * @param options - Optional configuration for this request.
   */
  createNotifier: async (
    payload: CreateNotifierPayload,
    options?: ShodanRequestOptions,
  ): Promise<SaveNotifierResponse> => {
    const formBody = new URLSearchParams(payload);
    return request(baseUrl, '/notifier', apiKey, {
      method: 'POST',
      body: formBody,
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Remove the notification service created for the user.
   * @param notifierId - The ID of the notifier to delete.
   * @param options - Optional configuration for this request.
   */
  deleteNotifier: async (
    notifierId: string,
    options?: ShodanRequestOptions,
  ): Promise<ActionSuccessResponse> => {
    return request(baseUrl, `/notifier/${notifierId}`, apiKey, {
      method: 'DELETE',
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Get the detailed information about a specific configured notifier.
   * @param notifierId - The ID of the notifier to get.
   * @param options - Optional configuration for this request.
   */
  getNotifier: async (notifierId: string, options?: ShodanRequestOptions): Promise<Notifier> => {
    return request(baseUrl, `/notifier/${notifierId}`, apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Use this method to update the parameters of a notifier.
   * @param notifierId - The ID of the notifier to update.
   * @param payload - The updated configuration payload for the notifier.
   * @param options - Optional configuration for this request.
   */
  modifyNotifier: async (
    notifierId: string,
    payload: CreateNotifierPayload,
    options?: ShodanRequestOptions,
  ): Promise<SaveNotifierResponse> => {
    const formBody = new URLSearchParams(payload);

    return request(baseUrl, `/notifier/${notifierId}`, apiKey, {
      method: 'PUT',
      body: formBody,
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
});
