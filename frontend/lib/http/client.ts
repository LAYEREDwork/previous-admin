/**
 * HTTP Client for API requests
 *
 * Provides a centralized, type-safe HTTP client for backend communication.
 * Handles common concerns like credentials, headers, and error handling.
 *
 * @module frontend/lib/httpClient
 */

import { apiBaseUrl } from '../constants';
import { apiPaths } from '~shared/constants';

/**
 * Custom API error with status code
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public type: 'auth' | 'validation' | 'server' | 'network' = 'server'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * HTTP request options
 */
interface RequestOptions<T = unknown> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: T;
  headers?: Record<string, string>;
}

/**
 * Parse error response from API
 */
async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.error || data.message || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

/**
 * Determine error type from status code
 */
function getErrorType(statusCode: number): ApiError['type'] {
  if (statusCode === 401 || statusCode === 403) return 'auth';
  if (statusCode === 400 || statusCode === 422) return 'validation';
  if (statusCode >= 500) return 'server';
  return 'server';
}

/**
 * Make an HTTP request to the API
 *
 * @param endpoint - API endpoint from ApiPaths object
 * @param options - Request options (method, body, headers)
 * @returns Promise resolving to parsed JSON response
 * @throws {ApiError} On non-OK response or network failure
 *
 * @example
 * // GET request
 * const data = await request(ApiPaths.Auth.session.full);
 *
 * // POST request with body
 * const result = await request(ApiPaths.Auth.login.full, {
 *   method: 'POST',
 *   body: { username: 'admin', password: 'secret' }
 * });
 */
export async function request<TResponse, TBody = unknown>(
  endpoint: keyof typeof apiPaths | string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = 'GET', body, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  // Add Content-Type for requests with body
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${apiBaseUrl}${String(endpoint)}`, {
      method,
      headers: requestHeaders,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      throw new ApiError(errorMessage, response.status, getErrorType(response.status));
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return {} as TResponse;
    }

    return JSON.parse(text) as TResponse;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap network errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0,
      'network'
    );
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const http = {
  /**
   * Make a GET request
   */
  get<T>(endpoint: keyof typeof apiPaths | string): Promise<T> {
    return request<T>(endpoint, { method: 'GET' });
  },

  /**
   * Make a POST request
   */
  post<T, B = unknown>(endpoint: keyof typeof apiPaths | string, body?: B): Promise<T> {
    return request<T, B>(endpoint, { method: 'POST', body });
  },

  /**
   * Make a PUT request
   */
  put<T, B = unknown>(endpoint: keyof typeof apiPaths | string, body?: B): Promise<T> {
    return request<T, B>(endpoint, { method: 'PUT', body });
  },

  /**
   * Make a DELETE request
   */
  delete<T>(endpoint: keyof typeof apiPaths | string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' });
  },

  /**
   * Make a PATCH request
   */
  patch<T, B = unknown>(endpoint: keyof typeof apiPaths | string, body?: B): Promise<T> {
    return request<T, B>(endpoint, { method: 'PATCH', body });
  },
};

export default http;
