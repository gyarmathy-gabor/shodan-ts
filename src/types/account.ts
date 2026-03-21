export interface AccountProfile {
  /** Whether the account has a Shodan membership. */
  member: boolean;

  /** The total number of search credits available. */
  credits: number;

  /** The username of the account */
  username?: string;

  /** The user-facing name, null if not set. */
  display_name: string | null;

  /** The date the account was created. */
  created: string;
}
