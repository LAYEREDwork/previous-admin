/**
 * Database maintenance and utilities module
 *
 * Handles database export/import, statistics, and maintenance operations.
 *
 * @module backend/database/maintenance
 */

import { existsSync, statSync } from 'fs';
import type { Configuration } from '../types';
import { DATABASE_PATH, getDatabase } from './core';
import * as configurations from './configurations';
import * as users from './users';

export interface DatabaseExport {
  version: string;
  exportedAt: string;
  users: Array<{ id: string; username: string; password_hash: string; createdAt: string }>;
  configurations: Configuration[];
}

export interface ImportStatistics {
  configurations: { imported: number; skipped: number; errors: number };
  users: { imported: number; skipped: number; errors: number };
}

export interface DatabaseStatistics {
  totalUsers: number;
  totalConfigurations: number;
  activeConfigurations: number;
  databasePath: string;
  databaseSizeBytes: number;
}

/**
 * Export entire database as JSON
 *
 * @returns Database dump object
 */
export function exportDatabase(): DatabaseExport {
  const allUsers = users.getAllUsers();
  const allConfigurations = configurations.getConfigurations();

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    users: allUsers.map((user) => ({
      id: user.id,
      username: user.username,
      password_hash: user.password_hash,
      createdAt: user.created_at,
    })),
    configurations: allConfigurations,
  };
}

/**
 * Import database dump
 *
 * @param dump - Database dump object
 * @param shouldMerge - If true, merge with existing; if false, replace configurations
 * @returns Import statistics
 */
export function importDatabase(
  dump: Partial<DatabaseExport>,
  shouldMerge: boolean = true
): ImportStatistics {
  if (!dump || typeof dump !== 'object') {
    throw new Error('Invalid database dump format');
  }

  const statistics: ImportStatistics = {
    configurations: { imported: 0, skipped: 0, errors: 0 },
    users: { imported: 0, skipped: 0, errors: 0 },
  };

  const database = getDatabase();

  // Disable foreign key checks during import
  database.prepare('PRAGMA foreign_keys = OFF').run();

  database.prepare('BEGIN TRANSACTION').run();

  try {
    // Handle users first
    if (!shouldMerge) {
      database.prepare('DELETE FROM users').run();
    }

    if (dump.users && Array.isArray(dump.users)) {
      const userInsertStatement = database.prepare(`
        INSERT OR REPLACE INTO users (id, username, password_hash, created_at)
        VALUES (?, ?, ?, ?)
      `);

      for (const user of dump.users) {
        try {
          const passwordHash = user.passwordHash || '';
          console.log(`Importing user "${user.username}" with passwordHash length: ${passwordHash.length}`);
          
          userInsertStatement.run(
            user.id,
            user.username,
            passwordHash,
            user.createdAt || new Date().toISOString()
          );
          statistics.users.imported++;
        } catch (error) {
          console.error(`Error importing user "${user.username}":`, error instanceof Error ? error.message : error);
          statistics.users.errors++;
        }
      }
    }

    // Handle configurations
    if (!shouldMerge) {
      database.prepare('DELETE FROM configurations').run();
    }

    if (dump.configurations && Array.isArray(dump.configurations)) {
      const insertStatement = database.prepare(`
        INSERT OR REPLACE INTO configurations 
        (id, name, description, config_data, is_active, created_at, updated_at, created_by, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const config of dump.configurations) {
        try {
          insertStatement.run(
            config.id,
            config.name,
            config.description || '',
            JSON.stringify(config.configContent),
            config.isActive ? 1 : 0,
            config.createdAt || new Date().toISOString(),
            config.updatedAt || new Date().toISOString(),
            config.userId || null,
            0 // sort_order
          );
          statistics.configurations.imported++;
        } catch (error) {
          console.error(`Error importing configuration "${config.name}":`, error instanceof Error ? error.message : error);
          statistics.configurations.errors++;
        }
      }
    }

    database.prepare('COMMIT').run();
    return statistics;
  } catch (error) {
    database.prepare('ROLLBACK').run();
    console.error('Database import transaction failed:', error);
    throw error;
  } finally {
    // Re-enable foreign key checks
    database.prepare('PRAGMA foreign_keys = ON').run();
  }
}

/**
 * Get configuration file path for user
 *
 * @param username - Username
 * @param baseDirectory - Base directory for config files
 * @returns Full path to user's config file
 */
export function getConfigFilePath(username: string, baseDirectory: string): string {
  // Remove unsafe characters from filename
  const safeUsername = username.replace(/[^a-zA-Z0-9_-]/g, '');
  return `${baseDirectory}/${safeUsername}-previous.conf`;
}

/**
 * Get database statistics and information
 *
 * @returns Database statistics object
 */
export function getDatabaseStatistics(): DatabaseStatistics {
  const database = getDatabase();

  const userCountResult = database
    .prepare('SELECT COUNT(*) as count FROM users')
    .get();
  const configCountResult = database
    .prepare('SELECT COUNT(*) as count FROM configurations')
    .get();
  const activeConfigResult = database
    .prepare('SELECT COUNT(*) as count FROM configurations WHERE is_active = 1')
    .get();

  let databaseSizeBytes = 0;
  if (existsSync(DATABASE_PATH)) {
    try {
      databaseSizeBytes = statSync(DATABASE_PATH).size;
    } catch (error) {
      console.warn('Failed to get database file size:', error);
    }
  }

  return {
    totalUsers: (userCountResult as { count: number }).count,
    totalConfigurations: (configCountResult as { count: number }).count,
    activeConfigurations: (activeConfigResult as { count: number }).count,
    databasePath: DATABASE_PATH,
    databaseSizeBytes,
  };
}

/**
 * Clear old sessions or data (cleanup operation)
 * Useful for maintenance
 *
 * @returns Number of items cleaned up
 */
export function cleanupExpiredData(): number {
  const database = getDatabase();
  
  try {
    // Could add logic here for cleaning up old configurations
    // For now, this is a placeholder for future maintenance operations
    database.prepare('PRAGMA vacuum').run();
    console.log('Database vacuum completed');
    return 0;
  } catch (error) {
    console.error('Cleanup operation failed:', error);
    throw error;
  }
}

/**
 * Verify database integrity
 *
 * @returns true if database is valid, false otherwise
 */
export function verifyDatabaseIntegrity(): boolean {
  const database = getDatabase();

  try {
    const result = database.prepare('PRAGMA integrity_check').get() as { integrity_check: string };
    const isValid = result.integrity_check === 'ok';

    if (!isValid) {
      console.error('Database integrity check failed:', result.integrity_check);
    }

    return isValid;
  } catch (error) {
    console.error('Failed to verify database integrity:', error);
    return false;
  }
}
