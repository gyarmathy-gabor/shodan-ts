/**
 * An object specifying the criteria that an alert should trigger.
 * The only supported option at the moment is the "ip" filter.
 */
export interface AlertFilters {
  /**
   * A list of IPs or network ranges defined using CIDR notation.
   */
  ip: string[];
}

/**
 * The payload required to create a new Network Alert.
 */
export interface CreateAlertPayload {
  /**
   * The name to describe the network alert.
   */
  name: string;

  /**
   * An object specifying the criteria that an alert should trigger.
   */
  filters: AlertFilters;

  /**
   * (Optional) Number of seconds that the alert should be active.
   * If omitted, the alert never expires (0).
   */
  expires?: number;
}

export interface ModifyAlertPayload {
  filters: AlertFilters;
}

export interface NetworkAlert {
  name: string;
  created: string;
  triggers: unknown;
  has_triggers: boolean;
  expires: number;
  expiration: string | null;
  filters: AlertFilters;
  id: string;
  size: number;
}

/**
 * The response returned when successfully deleting a network alert.
 * @note Currently, the Shodan API returns an empty object `{}`, but their
 * documentation states it should return `{"success": true}`. This interface
 * safely handles both the current reality and any future API corrections.
 */
export interface DeleteAlertResponse {
  success?: boolean;
  [key: string]: unknown;
}

export interface ShodanTrigger {
  name: string;
  rule: string;
  description: string;
}

/**
 * The standard response returned by Shodan for successful state-changing actions
 * (e.g., enabling or disabling a trigger).
 */
export interface AlertActionResponse {
  success: boolean;
  [key: string]: unknown;
}
