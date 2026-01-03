/**
 * Database maintenance and utilities module
 *
 * Handles database export/import, statistics, and maintenance operations.
 *
 * @module backend/database/maintenance
 */

import { existsSync, statSync } from 'fs';
import type { Configuration } from '@backend/types';
import { DATABASE_PATH, getDatabase } from './core';
import * as configurations from './configurations';

export interface DatabaseExport {
  version: string;
  exportedAt: string;
  configurations: Configuration[];
}

export interface ImportStatistics {
  configurations: { imported: number; skipped: number; errors: number };
}

export interface DatabaseStatistics {
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
  const allConfigurations = configurations.getConfigurations();

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
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
  };

  const database = getDatabase();

  // Disable foreign key checks during import
  database.prepare('PRAGMA foreign_keys = OFF').run();

  database.prepare('BEGIN TRANSACTION').run();

  try {
    // Handle configurations
    if (!shouldMerge) {
      database.prepare('DELETE FROM configurations').run();
    }

    if (dump.configurations && Array.isArray(dump.configurations)) {
      const insertStatement = database.prepare(`
        INSERT OR REPLACE INTO configurations 
        (id, name, description, config_data, is_active, created_at, updated_at, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const config of dump.configurations) {
        try {
          if (!config.config_data) {
            console.warn(`Skipping configuration "${config.name}": no config data found`);
            statistics.configurations.skipped++;
            continue;
          }

          insertStatement.run(
            config.id,
            config.name,
            config.description || '',
            typeof config.config_data === 'string' ? config.config_data : JSON.stringify(config.config_data),
            config.is_active ? 1 : 0,
            config.created_at || new Date().toISOString(),
            config.updated_at || new Date().toISOString(),
            config.sort_order || 0
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
 * Get database statistics and information
 *
 * @returns Database statistics object
 */
export function getDatabaseStatistics(): DatabaseStatistics {
  const database = getDatabase();
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
