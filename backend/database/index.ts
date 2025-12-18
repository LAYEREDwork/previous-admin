/**
 * Database module index
 *
 * Central export point for all database operations.
 * Provides access to users, configurations, and maintenance functions.
 *
 * @module backend/database
 */

// Core database functions
export { getDatabase, closeDatabase, reinitializeDatabase, DATA_DIRECTORY, DATABASE_PATH } from './core';

// User management
export {
  hasAnyUsers,
  createUser,
  authenticateUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
  deleteUser,
} from './users';

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
  getConfigurationCount,
} from './configurations';

// Database maintenance
export {
  exportDatabase,
  importDatabase,
  getConfigFilePath,
  getDatabaseStatistics,
  cleanupExpiredData,
  verifyDatabaseIntegrity,
  type DatabaseExport,
  type ImportStatistics,
  type DatabaseStatistics,
} from './maintenance';

// Re-export types for convenience
export type { User, Configuration, CreateUserRequest, UpdateConfigurationRequest } from '../types';

/**
 * Backward compatibility: getConfigPath
 * Maps to getConfigFilePath with proper path
 */
export function getConfigPath(username: string): string {
  return getConfigFilePath(username, DATA_DIRECTORY);
}
