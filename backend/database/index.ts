/**
 * Database module index
 *
 * Central export point for all database operations.
 * Provides access to configurations and maintenance functions.
 *
 * @module backend/database
 */

// Core database functions
export { getDatabase, closeDatabase, reinitializeDatabase, DATA_DIRECTORY, DATABASE_PATH } from './core';

// Configuration management
export {
  getConfigurations,
  getConfiguration,
  getActiveConfiguration,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
  setActiveConfiguration,
  updateConfigurationsOrder,
} from './configurations';

// Database maintenance
export {
  exportDatabase,
  importDatabase,
  getDatabaseStatistics,
  cleanupExpiredData,
  verifyDatabaseIntegrity,
  type DatabaseExport,
  type ImportStatistics,
  type DatabaseStatistics,
} from './maintenance';
