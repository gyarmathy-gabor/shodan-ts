export class ShodanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShodanError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShodanError);
    }
  }
}

export class ShodanConfigError extends ShodanError {
  constructor(message: string) {
    super(message);
    this.name = 'ShodanConfigError';
  }
}

export class ShodanApiError extends ShodanError {
  public readonly status: number;
  public readonly statusText: string;
  public readonly url: string;
  constructor(message: string, status: number, statusText: string, url: string) {
    super(message);
    this.name = 'ShodanApiError';
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }
}
