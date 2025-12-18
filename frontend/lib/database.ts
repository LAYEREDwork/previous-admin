/**
 * Database API Client
 *
 * Provides client-side interface for configuration management via Backend API.
 * All operations communicate with the server database.
 *
 * @module src/lib/database
 */

import type { Configuration, PreviousConfig } from './types';
import { API_BASE_URL } from './constants';
import { ApiEndpoints } from '../../shared/constants';

export { type Configuration, type PreviousConfig };

/**
 * API client for configuration database operations
 *
 * Provides methods for CRUD operations on configurations.
 * All methods communicate with backend API and handle authentication automatically.
 */
export const database = {
  /**
   * Retrieve all configurations
   *
   * @returns {Promise<Configuration[]>} Array of all configurations sorted by order
   * @throws {Error} If API request fails
   */
  async getConfigurations(): Promise<Configuration[]> {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.CONFIGURATIONS}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch configurations');
    }

    const data = await response.json();
    return data.configurations;
  },

  /**
   * Retrieve specific configuration by ID
   *
   * @param {string} id - Configuration ID (UUID)
   * @returns {Promise<Configuration | null>} Configuration object or null if not found
   * @throws {Error} If API request fails
   */
  async getConfiguration(id: string): Promise<Configuration | null> {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.CONFIGURATIONS}/${id}`, {
      credentials: 'include',
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch configuration');
    }

    const data = await response.json();
    return data.configuration;
  },

  /**
   * Create new configuration
   *
   * @param {string} name - Configuration name
   * @param {string} description - Configuration description
   * @param {PreviousConfig} config_data - System configuration object
   * @param {boolean} is_active - Set as active configuration
   * @param {number | null} created_by - Creator user ID (optional, handled by server)
   * @returns {Promise<Configuration>} Created configuration with assigned ID
   * @throws {Error} If API request fails
   */
  async createConfiguration(
    name: string,
    description: string,
    config_data: PreviousConfig,
    is_active: boolean,
    created_by: number | null = null
  ): Promise<Configuration> {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.CONFIGURATIONS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name,
        description,
        config_data,
        is_active,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create configuration');
    }

    const data = await response.json();
    return data.configuration;
  },

  /**
   * Update configuration properties
   *
   * @param {string} id - Configuration ID
   * @param {Object} updates - Properties to update (all optional)
   * @returns {Promise<void>}
   * @throws {Error} If API request fails
   */
  async updateConfiguration(
    id: string,
    updates: {
      name?: string;
      description?: string;
      config_data?: PreviousConfig;
      is_active?: boolean;
    }
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.CONFIGURATIONS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update configuration');
    }
  },

  /**
   * Delete configuration by ID
   *
   * @param {string} id - Configuration ID
   * @returns {Promise<void>}
   * @throws {Error} If API request fails
   */
  async deleteConfiguration(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.CONFIGURATIONS}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete configuration');
    }
  },

  /**
   * Set configuration as active (exclusive)
   *
   * @param {string} id - Configuration ID to activate
   * @returns {Promise<void>}
   * @throws {Error} If API request fails
   */
  async setActiveConfiguration(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.CONFIGURATIONS}/${id}/activate`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to activate configuration');
    }
  },

  /**
   * Retrieve currently active configuration
   *
   * @returns {Promise<Configuration | null>} Active configuration or null
   * @throws {Error} If API request fails
   */
  async getActiveConfiguration(): Promise<Configuration | null> {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.CONFIGURATIONS_ACTIVE}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch active configuration');
    }

    const data = await response.json();
    return data.configuration;
  },

  /**
   * Update display order of configurations
   *
   * @param {string[]} orderedIds - Configuration IDs in desired order
   * @returns {Promise<void>}
   * @throws {Error} If API request fails
   */
  async updateConfigurationsOrder(orderedIds: string[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.CONFIGURATIONS_ORDER_UPDATE}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ orderedIds }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update configurations order');
    }
  },

  /**
   * Export entire database
   *
   * @returns {Promise<Object>} Complete database dump
   * @throws {Error} If API request fails
   */
  async exportDatabase() {
    const response = await fetch(`${API_BASE_URL}/api/database/export`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to export database');
    }

    return response.json();
  },

  /**
   * Import database dump
   *
   * @param {Object} dump - Database dump object
   * @param {boolean} merge - If true, merge with existing data; if false, replace
   * @returns {Promise<Object>} Import statistics
   * @throws {Error} If API request fails
   */
  async importDatabase(dump: any, merge: boolean = false) {
    const response = await fetch(`${API_BASE_URL}/api/database/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ dump, merge }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to import database');
    }

    return response.json();
  },

  /**
   * Get database statistics
   *
   * @returns {Promise<Object>} Database statistics
   * @throws {Error} If API request fails
   */
  async getDatabaseStats() {
    const response = await fetch(`${API_BASE_URL}/api/database/stats`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch database statistics');
    }

    return response.json();
  },

  /**
   * Import database during initial setup (no authentication required)
   *
   * @param {Object} dump - Database dump object
   * @returns {Promise<Object>} Import statistics
   * @throws {Error} If API request fails or setup already completed
   */
  async setupImportDatabase(dump: any) {
    const response = await fetch(`${API_BASE_URL}/api/database/setup-import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ dump }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to import database');
    }

    return response.json();
  },

  /**
   * Legacy method for authentication (deprecated, moved to AuthContext)
   *
   * @deprecated Use AuthContext instead
   * @param {string} username - Username
   * @param {string} password - Password (plaintext)
   * @returns {Promise<Object | null>} User object or null
   */
  async authenticate(username: string, password: string): Promise<{ id: string; username: string } | null> {
    console.warn('database.authenticate() is deprecated. Use AuthContext instead.');
    return null;
  },
};
