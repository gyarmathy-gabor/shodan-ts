/**
 * Represents a user within a Shodan organization.
 */
export interface OrganizationUser {
  /** The username of the Shodan user. */
  username: string;
  /** The email address of the Shodan user. */
  email: string;
}

/**
 * Detailed information about a Shodan organization.
 */
export interface Organization {
  /** The name of the organization. */
  name: string;
  /** ISO timestamp of when the organization was created. */
  created: string;
  /** List of administrators for the organization. */
  admins: OrganizationUser[];
  /** List of standard members in the organization. */
  members: OrganizationUser[];
  /** The type of account upgrade applied to members (e.g., "stream-100"). */
  upgrade_type: string;
  /** Authorized email domains for the organization. */
  domains: string[];
  /** Indicates if the organization has a custom logo set. */
  logo: boolean | string | null;
  /** The unique identifier of the organization. */
  id: string;
}

/**
 * The response returned for successful organization modification actions.
 */
export interface OrganizationActionResponse {
  /** True if the operation was successful. */
  success: boolean;
}
