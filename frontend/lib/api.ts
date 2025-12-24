/**
 * API client for backend communication
 *
 * Provides methods for authentication, configuration management, and session handling.
 * Uses the centralized httpClient for all requests.
 *
 * @module frontend/lib/api
 */

import type { PreviousConfig } from './types';
import { http, ApiError } from './httpClient';
import { ApiPaths } from '../../shared/constants';
import { wsUrl } from './constants';

// Re-export ApiError for consumers
export { ApiError };

// Response types
interface SetupResponse {
  success: boolean;
  username: string;
}

interface LoginResponse {
  username: string;
}

interface LogoutResponse {
  success: boolean;
}

interface SessionResponse {
  authenticated: boolean;
  username?: string;
  setupRequired: boolean;
}

interface SetupRequiredResponse {
  setupRequired: boolean;
}

interface ConfigResponse {
  config: PreviousConfig;
}

interface UpdateConfigResponse {
  success: boolean;
  config: PreviousConfig;
}

/**
 * Check if system setup is required
 *
 * Verifies if the admin user has been initialized.
 * Returns false on network errors (safe default).
 *
 * @returns {Promise<boolean>} true if setup is required, false otherwise
 *
 * @example
 * const setupNeeded = await checkSetupRequired();
 * if (setupNeeded) {
 *   // Show setup form
 * }
 */
export async function checkSetupRequired(): Promise<boolean> {
  try {
    const data = await http.get<SetupRequiredResponse>(ApiPaths.Auth.setupRequired.full);
    return data.setupRequired;
  } catch {
    return false;
  }
}

/**
 * API client for backend communication
 *
 * Provides methods for authentication, configuration management, and session handling.
 * All methods include credentials and handle JSON responses automatically.
 * Throws ApiError on non-OK HTTP status or network errors.
 */
export const api = {
  /**
   * Initialize admin user account (setup)
   *
   * Creates the first admin user during initial setup.
   * Only callable if no users exist in the system.
   *
   * @param {string} username - Admin username
   * @param {string} password - Admin password
   * @returns {Promise<SetupResponse>} Setup confirmation
   * @throws {ApiError} On setup failure
   */
  async setup(username: string, password: string): Promise<SetupResponse> {
    return http.post<SetupResponse>(ApiPaths.Auth.setup.full, { username, password });
  },

  /**
   * Authenticate user with credentials
   *
   * Logs in user and establishes authenticated session.
   *
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<LoginResponse>} Authenticated user info
   * @throws {ApiError} On authentication failure
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    return http.post<LoginResponse>(ApiPaths.Auth.login.full, { username, password });
  },

  /**
   * Terminate user session
   *
   * Logs out current user and destroys session.
   *
   * @returns {Promise<LogoutResponse>} Logout confirmation
   * @throws {ApiError} On logout failure
   */
  async logout(): Promise<LogoutResponse> {
    return http.post<LogoutResponse>(ApiPaths.Auth.logout.full);
  },

  /**
   * Get current session information
   *
   * Retrieves authentication status and setup requirement.
   * Can be called without authentication.
   *
   * @returns {Promise<SessionResponse>} Session information
   * @throws {ApiError} On network failure
   */
  async getSession(): Promise<SessionResponse> {
    return http.get<SessionResponse>(ApiPaths.Auth.session.full);
  },

  /**
   * Retrieve user configuration
   *
   * Gets the current user's configuration file.
   * Requires authentication.
   *
   * @returns {Promise<ConfigResponse>} User configuration object
   * @throws {ApiError} If not authenticated or retrieval fails
   */
  async getConfig(): Promise<ConfigResponse> {
    return http.get<ConfigResponse>(ApiPaths.Config.get.full);
  },

  /**
   * Update user configuration
   *
   * Persists configuration changes to server and broadcasts to other clients.
   * Requires authentication.
   *
   * @param {PreviousConfig} config - Complete configuration object
   * @returns {Promise<UpdateConfigResponse>} Update confirmation
   * @throws {ApiError} If not authenticated or update fails
   */
  async updateConfig(config: PreviousConfig): Promise<UpdateConfigResponse> {
    return http.put<UpdateConfigResponse>(ApiPaths.Config.get.full, { config });
  },
};

/**
 * Construct WebSocket URL for current connection
 *
 * Uses the centralized wsUrl constant for consistency.
 *
 * @returns {string} WebSocket URL
 * @deprecated Use wsUrl constant from './constants' instead
 */
export function getWebSocketUrl(): string {
  return wsUrl;
}
