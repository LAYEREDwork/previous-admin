/**
 * Configuration Database API Client
 *
 * Provides client-side interface for configuration CRUD operations via Backend API.
 * All operations communicate with the server database.
 *
 * @module frontend/lib/database/configurations
 */

import type { Configuration, PreviousConfig } from '../types/config';
import { apiBaseUrl } from '../constants';
import { apiPaths } from '../../../shared/constants';

export { type Configuration, type PreviousConfig };

/**
 * API client for configuration database operations
 *
 * Provides methods for CRUD operations on configurations.
 * All methods communicate with backend API and handle authentication automatically.
 */
export const configurations = {
  /**
   * Retrieve all configurations
   *
   * @returns {Promise<Configuration[]>} Array of all configurations sorted by order
   * @throws {Error} If API request fails
   */
  async getConfigurations(): Promise<Configuration[]> {
    const response = await fetch(`${apiBaseUrl}${apiPaths.Configuration.list.full}`, {
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
    const response = await fetch(`${apiBaseUrl}${apiPaths.Configuration.list.full}/${id}`, {
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
   * @returns {Promise<Configuration>} Created configuration with assigned ID
   * @throws {Error} If API request fails
   */
  async createConfiguration(
    name: string,
    description: string,
    config_data: PreviousConfig,
    is_active: boolean
  ): Promise<Configuration> {
    const response = await fetch(`${apiBaseUrl}${apiPaths.Configuration.list.full}`, {
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
    const response = await fetch(`${apiBaseUrl}${apiPaths.Configuration.list.full}/${id}`, {
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
    const response = await fetch(`${apiBaseUrl}${apiPaths.Configuration.list.full}/${id}`, {
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
    const response = await fetch(`${apiBaseUrl}${apiPaths.Configuration.list.full}/${id}/activate`, {
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
    const response = await fetch(`${apiBaseUrl}${apiPaths.Configuration.getActive.full}`, {
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
    const response = await fetch(`${apiBaseUrl}${apiPaths.Configuration.updateOrder.full}`, {
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
};