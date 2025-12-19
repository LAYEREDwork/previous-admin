import type { PreviousConfig } from './types';
import { API_BASE_URL } from './constants';
import { ApiEndpoints } from '../../shared/constants';

/**
 * Check if system setup is required
 *
 * Verifies if the admin user has been initialized.
 * Returns false on network errors (safe default).
 *
 * @returns {Promise<boolean>} true if setup is required, false otherwise
 * @throws {void} Does not throw, catches all errors and returns false
 *
 * @example
 * const setupNeeded = await checkSetupRequired();
 * if (setupNeeded) {
 *   // Show setup form
 * }
 */
export async function checkSetupRequired(): Promise<boolean> {
  console.log('[API] Checking if setup is required...');
  try {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.AUTH_SETUP_REQUIRED}`, {
      credentials: 'include',
    });
    const data = await response.json();
    console.log('[API] Setup required check result:', data.setupRequired);
    return data.setupRequired;
  } catch (error) {
    console.error('[API] Error checking setup required:', error);
    return false;
  }
}

/**
 * API client for backend communication
 *
 * Provides methods for authentication, configuration management, and session handling.
 * All methods include credentials and handle JSON responses automatically.
 * Throws on non-OK HTTP status or JSON parse errors.
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
   *
   * @returns {Promise<{success: boolean, username: string}>} Setup confirmation
   * @throws {Error} On setup failure (already setup, invalid credentials, network error)
   *
   * @example
   * try {
   *   const result = await api.setup('admin', 'password123');
   *   console.log('Setup complete:', result.username);
   * } catch (error) {
   *   console.error('Setup failed:', error.message);
   * }
   */
  async setup(username: string, password: string) {
    console.log('[API] Setup: Starting setup for user:', username);
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.AUTH_SETUP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[API] Setup: Setup failed with response:', error);
      throw new Error(error.error || 'Setup failed');
    }

    const result = await response.json();
    console.log('[API] Setup: Setup completed successfully:', result);
    return result;
  },

  /**
   * Authenticate user with credentials
   *
   * Logs in user and establishes authenticated session.
   *
   * @param {string} username - Username
   * @param {string} password - Password
   *
   * @returns {Promise<{username: string}>} Authenticated user info
   * @throws {Error} On authentication failure (invalid credentials, network error)
   *
   * @example
   * try {
   *   const user = await api.login('admin', 'password');
   *   console.log('Logged in as:', user.username);
   * } catch (error) {
   *   if (error.message.includes('401')) {
   *     console.error('Invalid credentials');
   *   }
   * }
   */
  async login(username: string, password: string) {
    console.log('[API] Login: Starting login for user:', username);
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.AUTH_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[API] Login: Login failed with response:', error);
      throw new Error(error.error || 'Login failed');
    }

    const result = await response.json();
    console.log('[API] Login: Login completed successfully:', result);
    return result;
  },

  /**
   * Terminate user session
   *
   * Logs out current user and destroys session.
   *
   * @returns {Promise<{success: boolean}>} Logout confirmation
   * @throws {Error} On logout failure (network error)
   *
   * @example
   * await api.logout();
   * // Redirect to login page
   */
  async logout() {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.AUTH_LOGOUT}`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  },

  /**
   * Get current session information
   *
   * Retrieves authentication status and setup requirement.
   * Can be called without authentication.
   *
   * @returns {Promise<{authenticated: boolean, username?: string, setupRequired: boolean}>}
   *   - authenticated {boolean}: true if user has valid session
   *   - username {string}: Current username (only if authenticated)
   *   - setupRequired {boolean}: true if system setup is needed
   *
   * @throws {Error} On network failure
   *
   * @example
   * const session = await api.getSession();
   * if (session.authenticated) {
   *   console.log('User:', session.username);
   * } else if (session.setupRequired) {
   *   // Show setup form
   * } else {
   *   // Show login form
   * }
   */
  async getSession() {
    console.log('[API] Session: Checking current session...');
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.AUTH_SESSION}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('[API] Session: Failed to get session, response status:', response.status);
      throw new Error('Failed to get session');
    }

    const result = await response.json();
    console.log('[API] Session: Session check result:', result);
    return result;
  },

  /**
   * Retrieve user configuration
   *
   * Gets the current user's configuration file.
   * Requires authentication.
   *
   * @returns {Promise<{config: PreviousConfig}>} User configuration object
   * @throws {Error} If not authenticated or retrieval fails
   *
   * @example
   * const { config } = await api.getConfig();
   * console.log(config.settings);
   */
  async getConfig() {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.CONFIG}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get configuration');
    }

    return response.json();
  },

  /**
   * Update user configuration
   *
   * Persists configuration changes to server and broadcasts to other clients.
   * Requires authentication.
   *
   * @param {PreviousConfig} config - Complete configuration object
   *
   * @returns {Promise<{success: boolean, config: PreviousConfig}>} Update confirmation
   * @throws {Error} If not authenticated or update fails
   *
   * @side-effects
   *   - Saves config to disk
   *   - Broadcasts update to other connected clients via WebSocket
   *
   * @example
   * const newConfig = { ...oldConfig, theme: 'dark' };
   * const { success } = await api.updateConfig(newConfig);
   */
  async updateConfig(config: PreviousConfig) {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.CONFIG}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ config }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update configuration');
    }

    return response.json();
  },
};

/**
 * Construct WebSocket URL for current connection
 *
 * Determines correct WebSocket protocol (ws: or wss:) based on
 * current page protocol and connects to backend on port 3001.
 *
 * @returns {string} WebSocket URL (e.g., 'wss://example.com:3001')
 *
 * @example
 * const wsUrl = getWebSocketUrl();
 * const ws = new WebSocket(wsUrl);
 */
export function getWebSocketUrl(): string {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${wsProtocol}//${window.location.hostname}:3001`;
}
