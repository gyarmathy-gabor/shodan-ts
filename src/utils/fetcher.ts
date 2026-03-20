import { ShodanApiError } from '../errors';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  retries?: number;
}

export async function request<T>(
  baseUrl: string,
  endpoint: string,
  apikey: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, params, timeout, retries = 0 } = options;

  const cleanEndpoint = endpoint.replace(/^\//, '');

  const url = new URL(`${baseUrl}/${cleanEndpoint}`);
  url.searchParams.append('key', apikey);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  let attempt = 0;
  while (attempt <= retries) {
    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (timeout) {
      timeoutId = setTimeout(() => controller.abort(), timeout);
    }
    try {
      const response = await fetch(url.toString(), {
        method,
        signal: controller.signal,
        ...(body
          ? {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            }
          : {}),
      });
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        let errorMessage = response.statusText || 'Unknown Shodan API Error';

        try {
          const errorBody = (await response.json()) as { error: string };
          if (errorBody && errorBody.error) {
            errorMessage = errorBody.error;
          }
        } catch {
          // Ignore parse error
        }

        throw new ShodanApiError(
          errorMessage,
          response.status,
          response.statusText,
          url.toString(),
        );
      }
      return (await response.json()) as T;
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (error instanceof ShodanApiError) {
        const isRetryable = error.status >= 500;
        if (!isRetryable) throw error;
      }

      attempt++;
      if (attempt > retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw new Error('Unreachable: Max retries reached');
}
