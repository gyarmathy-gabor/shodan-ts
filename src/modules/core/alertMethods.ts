import { request } from '../../utils/fetcher';
import { ShodanClientOptions, ShodanRequestOptions } from '../../types/options';
import {
  AlertActionResponse,
  CreateAlertPayload,
  DeleteAlertResponse,
  ModifyAlertPayload,
  NetworkAlert,
  ShodanTrigger,
} from '../../types/alerts';

export const buildAlertMethods = (
  baseUrl: string,
  apiKey: string,
  globalOptions: Required<ShodanClientOptions>,
) => ({
  /**
   * Creates a new network alert to monitor changes to a specified set of IPs or netblocks.
   * @param payload - The alert configuration (name, IPs to monitor, expiration time).
   * @param options - Optional configuration for this request.
   */
  createAlert: async (
    payload: CreateAlertPayload,
    options?: ShodanRequestOptions,
  ): Promise<NetworkAlert> => {
    return request(baseUrl, 'shodan/alert', apiKey, {
      method: 'POST',
      body: payload,
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Returns the information about a specific network alert.
   * @param alertId - The ID of the alert.
   * @param options - Optional configuration for this request.
   */
  getAlert: async (alertId: string, options?: ShodanRequestOptions): Promise<NetworkAlert> => {
    return request(baseUrl, `shodan/alert/${alertId}/info`, apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Remove the specified network alert.
   * @param alertId - The ID of the alert.
   * @param options - Optional configuration for this request.
   */
  deleteAlert: async (
    alertId: string,
    options?: ShodanRequestOptions,
  ): Promise<DeleteAlertResponse> => {
    return request(baseUrl, `shodan/alert/${alertId}`, apiKey, {
      method: 'DELETE',
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Use this method to edit a network alert with a new list of IPs/ networks to keep track of.
   * @param alertId - The ID of the alert.
   * @param payload - The new configuration for the alert (e.g., an updated list of IPs/networks to monitor).
   * @param options - Optional configuration for this request.
   */
  modifyAlert: async (
    alertId: string,
    payload: ModifyAlertPayload,
    options?: ShodanRequestOptions,
  ): Promise<NetworkAlert> => {
    return request(baseUrl, `shodan/alert/${alertId}`, apiKey, {
      method: 'POST',
      body: payload,
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Returns a listing of all the network alerts that are currently active on the account.
   * @param options - Optional configuration for this request.
   */
  getAlerts: async (options?: ShodanRequestOptions): Promise<NetworkAlert[]> => {
    return request(baseUrl, 'shodan/alert/info', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Returns a list of all the triggers that can be enabled on network alerts.
   * @param options - Optional configuration for this request.
   */
  getTriggers: async (options?: ShodanRequestOptions): Promise<ShodanTrigger[]> => {
    return request(baseUrl, 'shodan/alert/triggers', apiKey, {
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Get notifications when the specified trigger is met.
   * @param alertId - The ID of the alert.
   * @param triggers - A single trigger name or an array of trigger names to enable (e.g., 'vulnerable' or ['new_service', 'vulnerable']).
   * @param options - Optional configuration for this request.
   */
  enableTriggerForAlert: async (
    alertId: string,
    triggers: string[] | string,
    options?: ShodanRequestOptions,
  ): Promise<AlertActionResponse> => {
    const triggersString: string = Array.isArray(triggers) ? triggers.join(',') : triggers;
    return request(baseUrl, `shodan/alert/${alertId}/trigger/${triggersString}`, apiKey, {
      method: 'PUT',
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Stop getting notifications for the specified trigger.
   * @param alertId - The ID of the alert.
   * @param triggers - A single trigger name or an array of trigger names to disable.
   * @param options - Optional configuration for this request.
   */
  disableTriggerForAlert: async (
    alertId: string,
    triggers: string[] | string,
    options?: ShodanRequestOptions,
  ): Promise<AlertActionResponse> => {
    const triggersString: string = Array.isArray(triggers) ? triggers.join(',') : triggers;
    return request(baseUrl, `shodan/alert/${alertId}/trigger/${triggersString}`, apiKey, {
      method: 'DELETE',
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Ignores a specific service (IP:Port) when it matches a specific trigger.
   * Useful for whitelisting known issues so they stop generating alert notifications.
   * @param alertId - The ID of the alert.
   * @param trigger - The specific trigger name to ignore (e.g., 'vulnerable').
   * @param service - The specific service (IP:Port) to ignore (e.g., '198.51.100.45:443' or '1.1.1.1:80').
   * @param options - Optional configuration for this request.
   */
  ignoreServiceForTrigger: async (
    alertId: string,
    trigger: string,
    service: string,
    options?: ShodanRequestOptions,
  ): Promise<AlertActionResponse> => {
    return request(
      baseUrl,
      `shodan/alert/${alertId}/trigger/${trigger}/ignore/${service}`,
      apiKey,
      {
        method: 'PUT',
        timeout: options?.timeout ?? globalOptions.timeout,
        retries: options?.retries ?? globalOptions.retries,
      },
    );
  },

  /**
   * Removes a service from the trigger's whitelist (un-ignores it),
   * meaning it will generate alert notifications again if matched.
   * @param alertId - The ID of the alert.
   * @param trigger - The specific trigger name to un-ignore (e.g., 'vulnerable').
   * @param service - The specific service (IP:Port) to ignore (e.g., '198.51.100.45:443' or '1.1.1.1:80').
   * @param options - Optional configuration for this request.
   */
  unignoreServiceForTrigger: async (
    alertId: string,
    trigger: string,
    service: string,
    options?: ShodanRequestOptions,
  ): Promise<AlertActionResponse> => {
    return request(
      baseUrl,
      `shodan/alert/${alertId}/trigger/${trigger}/ignore/${service}`,
      apiKey,
      {
        method: 'DELETE',
        timeout: options?.timeout ?? globalOptions.timeout,
        retries: options?.retries ?? globalOptions.retries,
      },
    );
  },

  /**
   * Add the specified notifier to the network alert.
   * Notifications are only sent if triggers have also been enabled.
   * For each created user, there is a default notifier that will send via email.
   * @param alertId - The ID of the alert.
   * @param notifierId - The ID of the notification.
   * @param options - Optional configuration for this request.
   */
  addNotifierToAlert: async (
    alertId: string,
    notifierId: string,
    options?: ShodanRequestOptions,
  ): Promise<AlertActionResponse> => {
    return request(baseUrl, `shodan/alert/${alertId}/notifier/${notifierId}`, apiKey, {
      method: 'PUT',
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },

  /**
   * Remove the notification service from the alert.
   * Notifications are only sent if triggers have also been enabled.
   * @param alertId - The ID of the alert.
   * @param notifierId - The ID of the notification.
   * @param options - Optional configuration for this request.
   */
  removeNotifierFromAlert: async (
    alertId: string,
    notifierId: string,
    options?: ShodanRequestOptions,
  ): Promise<AlertActionResponse> => {
    return request(baseUrl, `shodan/alert/${alertId}/notifier/${notifierId}`, apiKey, {
      method: 'DELETE',
      timeout: options?.timeout ?? globalOptions.timeout,
      retries: options?.retries ?? globalOptions.retries,
    });
  },
});
