/**
 * Represents the payload structure required to create a notifier configuration.
 * This type accommodates different providers, each having specific required properties.
 *
 * Supported Providers:
 * - `jira`: Requires details for integrating with a Jira server.
 * - `pagerduty`: Configures a routing key for PagerDuty notifications.
 * - `slack`: Provides a webhook URL for Slack notifications.
 * - `telegram`: Allows integration with Telegram using a chat ID and token.
 * - `webhook`: Specifies a URL for general webhook notifications.
 * - `phone`: Targets a specific phone number for notifications.
 * - `email`: Targets a specific email address for notifications.
 * - `gitter`: Requires integration details for Gitter room notifications.
 * - Custom Providers: Allows integration with any provider by specifying custom fields and their values.
 *
 * Each notifier payload must include a `provider` field and can optionally include `description`. Other required properties depend on the provider type.
 */
export type CreateNotifierPayload =
  | {
      provider: 'jira';
      description?: string;
      server: string;
      username: string;
      token: string;
      project: string;
      issue_type: string;
    }
  | { provider: 'pagerduty'; description?: string; routing_key: string }
  | { provider: 'slack'; description?: string; webhook_url: string }
  | { provider: 'telegram'; description?: string; chat_id: string; token: string }
  | { provider: 'webhook'; description?: string; url: string }
  | { provider: 'phone'; description?: string; to: string }
  | { provider: 'email'; description?: string; to: string }
  | { provider: 'gitter'; description?: string; room_id: string; token: string }
  | { provider: string; description?: string; [key: string]: string };

/**
 * Represents a configured notification service belonging to the user.
 */
export interface Notifier {
  /** The name of the notification provider (e.g., "email", "slack", "jira"). */
  provider: string;

  /** A user-defined description of what this notifier is used for. (Optional) */
  description: string | null;

  /** The specific configuration arguments provided to the service (e.g., {"to": "email@example.com"}). */
  args: Record<string, string>;

  /** The unique identifier assigned to this notifier by Shodan. */
  id: string;
}

/**
 * The response returned when listing the user's configured notifiers.
 */
export interface GetNotifiersResponse {
  /** An array of the user's configured notifiers. */
  matches: Notifier[];

  /** The total number of notifiers the user has created. */
  total: number;
}

/**
 * Represents the required parameter keys needed to configure a specific provider.
 */
export interface ProviderRequirements {
  /** An array of string keys representing the required arguments (e.g., `["webhook_url"]`). */
  required: string[];
}

export type GetNotificationProviderResponse = Record<string, ProviderRequirements>;

/**
 * The response returned by Shodan when a notifier is successfully created or updated.
 */
export interface SaveNotifierResponse {
  /** The ID of the created or modified notifier. */
  id: string;

  /** True if the operation was successful. */
  success: boolean;
}

/**
 * A generic response returned by Shodan for successful state-changing actions (like deleting a notifier).
 */
export interface ActionSuccessResponse {
  /** True if the operation was successful. */
  success: boolean;
}
