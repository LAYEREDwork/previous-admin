/**
 * Database core module - Connection and initialization
 *
 * Manages SQLite database connection and schema initialization.
 * Uses better-sqlite3 for synchronous operations.
 *
 * @module backend/database/core
 */

import { existsSync, mkdirSync, chmodSync } from 'fs';
import { createRequire } from 'module';
import os from 'os';
import { join } from 'path';

const require = createRequire(import.meta.url);
 
const Database = require('better-sqlite3');

const DATA_DIRECTORY = join(os.homedir(), '.previous-admin');
const DATABASE_PATH = join(DATA_DIRECTORY, 'previous-admin.db');

/**
 * Initialize data directory
 */
function initializeDataDirectory(): void {
  try {
    if (!existsSync(DATA_DIRECTORY)) {
      console.log(`Creating data directory: ${DATA_DIRECTORY}`);
      mkdirSync(DATA_DIRECTORY, { recursive: true, mode: 0o755 });
    }
    
    // Ensure directory is writable (chmod 755)
    chmodSync(DATA_DIRECTORY, 0o755);
    console.log(`Directory permissions set for: ${DATA_DIRECTORY}`);
  } catch (error) {
    console.error('Failed to create data directory:', error);
    throw error;
  }
}

/**
 * Initialize database connection
 */
function initializeDatabaseConnection(): any {
  try {
    // Open database with proper options to ensure write access
    const connection = new Database(DATABASE_PATH, {
      readonly: false,
      fileMustExist: false,
      timeout: 5000
    });
    
    // Enable foreign keys and optimize for better performance
    connection.pragma('foreign_keys = ON');
    connection.pragma('journal_mode = WAL');
    
    console.log(`Database initialized at: ${DATABASE_PATH}`);
    return connection;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Initialize database schema
 */
function initializeDatabaseSchema(database: any): void {
  try {
    // Configurations table
    database.exec(`
      CREATE TABLE IF NOT EXISTS configurations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        config_data TEXT NOT NULL,
        is_active INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        sort_order INTEGER DEFAULT 0
      )
    `);

    // Indexes for performance
    database.exec(`CREATE INDEX IF NOT EXISTS idx_configurations_sort ON configurations(sort_order, created_at)`);
    database.exec(`CREATE INDEX IF NOT EXISTS idx_configurations_active ON configurations(is_active)`);
    
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
}

// Initialize on module load
initializeDataDirectory();
let databaseConnection = initializeDatabaseConnection();
initializeDatabaseSchema(databaseConnection);

console.log(`✅ Database initialized: ${DATABASE_PATH}`);

/**
 * Get database connection instance
 */
export function getDatabase(): any {
  // Check if database file exists, if not reinitialize
  if (!existsSync(DATABASE_PATH)) {
    console.log('Database file missing, reinitializing...');
    reinitializeDatabase();
  }
  return databaseConnection;
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  databaseConnection.close();
}

/**
 * Reinitialize database connection
 * Used after database file is modified to create fresh connection
 */
export function reinitializeDatabase(): void {
  try {
    // Close the old connection first
    if (databaseConnection) {
      try {
        databaseConnection.close();
        console.log('Old database connection closed');
      } catch (closeError) {
        console.warn('Warning closing old connection:', closeError);
      }
    }
    
    // Open new connection
    databaseConnection = initializeDatabaseConnection();
    initializeDatabaseSchema(databaseConnection);
    console.log('Database connection reinitialized successfully');
  } catch (error) {
    console.error('Failed to reinitialize database:', error);
    throw error;
  }
}

export { DATA_DIRECTORY, DATABASE_PATH };
