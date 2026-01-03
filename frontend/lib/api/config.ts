/**
 * Configuration API client
 *
 * Provides methods for configuration management.
 * Uses the centralized HTTP client for all requests.
 *
 * @module frontend/lib/api/config
 */

import type { PreviousConfig } from '@shared/previous-config/types';
import { http, ApiError } from '../http/client';
import { apiPaths } from '@shared/api/constants';

// Re-export ApiError for consumers
export { ApiError };

// Response types
interface ConfigResponse {
  config: PreviousConfig;
}

interface UpdateConfigResponse {
  success: boolean;
  config: PreviousConfig;
}

/**
 * Configuration API client
 *
 * Provides methods for configuration retrieval and updates.
 * All methods include credentials and handle JSON responses automatically.
 * Throws ApiError on non-OK HTTP status or network errors.
 */
export const configApi = {
  /**
   * Retrieve user configuration
   *
  * Gets the current configuration file from the backend.
   *
   * @returns {Promise<ConfigResponse>} User configuration object
  * @throws {ApiError} On failure
   */
  async getConfig(): Promise<ConfigResponse> {
    return http.get<ConfigResponse>(apiPaths.Config.get.full);
  },

  /**
   * Update user configuration
   *
  * Persists configuration changes to server and broadcasts to other clients.
   *
   * @param {PreviousConfig} config - Complete configuration object
   * @returns {Promise<UpdateConfigResponse>} Update confirmation
  * @throws {ApiError} On failure
   */
  async updateConfig(config: PreviousConfig): Promise<UpdateConfigResponse> {
    return http.put<UpdateConfigResponse>(apiPaths.Config.get.full, { config });
  },
};