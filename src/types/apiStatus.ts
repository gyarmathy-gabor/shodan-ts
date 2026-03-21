export interface ApiUsageLimits {
  /** The maximum number of scan credits allowed. */
  scan_credits: number;

  /** The maximum number of query credits allowed. */
  query_credits: number;

  /** The maximum number of IPs that can be monitored. */
  monitored_ips: number;
}

/**
 * Information about the API plan and current usage limits for the API key.
 */
export interface ApiInfo {
  /** Remaining scan credits. */
  scan_credits: number;

  /** The limits associated with the current API plan. */
  usage_limits: ApiUsageLimits;

  /** The name of the API plan (e.g., "dev"). */
  plan: string;

  /** Whether HTTPS is enabled for the account. */
  https: boolean;

  unlocked: boolean;

  /** Remaining query credits. */
  query_credits: number;

  /** Current number of IPs being monitored. */
  monitored_ips: number;

  /** Number of full search results remaining to be unlocked. */
  unlocked_left: number;

  /** Whether telnet is enabled for the account. */
  telnet: boolean;
}
