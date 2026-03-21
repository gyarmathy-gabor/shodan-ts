/**
 * Represents a dataset available for bulk download.
 */
export interface Dataset {
  /** The frequency at which the dataset is generated (e.g., "monthly", "daily"). */
  scope: string;

  /** The unique name of the dataset. */
  name: string;

  /** A brief description of what data is contained within the dataset. */
  description: string;
}

/**
 * Represents a specific file available for download within a dataset.
 */
export interface DatasetFile {
  /** The direct URL to download the dataset file. */
  url: string;

  /** Unix timestamp (in milliseconds) of when the file was generated. */
  timestamp: number;

  /** The SHA1 checksum of the file for verification. */
  sha1: string;

  /** The filename (e.g., "2021-01-26.json.gz"). */
  name: string;

  /** The size of the file in bytes. */
  size: number;
}
