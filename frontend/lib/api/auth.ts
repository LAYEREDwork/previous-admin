/**
 * Authentication API client
 *
 * Provides methods for user authentication, session management, and setup.
 * Uses the centralized HTTP client for all requests.
 *
 * @module frontend/lib/api/auth
 */

import { http, ApiError } from '../http/client';
import { apiPaths } from '../../../shared/constants';

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
    const data = await http.get<SetupRequiredResponse>(apiPaths.Auth.setupRequired.full);
    return data.setupRequired;
  } catch {
    return false;
  }
}

/**
 * Authentication API client
 *
 * Provides methods for user authentication and session management.
 * All methods include credentials and handle JSON responses automatically.
 * Throws ApiError on non-OK HTTP status or network errors.
 */
export const authApi = {
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
    return http.post<SetupResponse>(apiPaths.Auth.setup.full, { username, password });
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
    return http.post<LoginResponse>(apiPaths.Auth.login.full, { username, password });
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
    return http.post<LogoutResponse>(apiPaths.Auth.logout.full);
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
    return http.get<SessionResponse>(apiPaths.Auth.session.full);
  },
};