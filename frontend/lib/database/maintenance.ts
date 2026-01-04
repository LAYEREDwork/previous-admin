/**
 * Database Maintenance API Client
 *
 * Provides client-side interface for database maintenance operations via Backend API.
 * Includes export/import and statistics functionality.
 *
 * @module frontend/lib/database/maintenance
 */

import { apiPaths } from '@shared/api/constants';

import { apiBaseUrl } from '../constants';

/**
 * API client for database maintenance operations
 *
 * Provides methods for database export/import and statistics.
 * All methods communicate with backend API and handle responses automatically.
 */
export const maintenance = {
  /**
   * Export entire database
   *
   * @returns {Promise<Object>} Complete database dump
   * @throws {Error} If API request fails
   */
  async exportDatabase() {
    const response = await fetch(`${apiBaseUrl}${apiPaths.Database.export.full}`, {
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
  async importDatabase(dump: unknown, merge: boolean = false) {
    const response = await fetch(`${apiBaseUrl}${apiPaths.Database.import.full}`, {
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
    const response = await fetch(`${apiBaseUrl}${apiPaths.Database.stats.full}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch database statistics');
    }

    return response.json();
  },

};