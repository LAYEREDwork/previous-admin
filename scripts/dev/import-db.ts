/**
 * Import Example Database Script
 *
 * Loads the example database directly into the SQLite database.
 * This is useful for setting up a consistent database state before running tests or generating screenshots.
 *
 * Usage:
 *   npm run import-example-db
 *   npx ts-node scripts/import-example-database.ts
 */

import fs from 'fs';
import os from 'os';
import path from 'path';

import Database from 'better-sqlite3';

import type { DatabaseExport } from '../../backend/database/maintenance';

/**
 * Get the database path
 */
function getDatabasePath(): string {
  const homeDir = os.homedir();
  const dbDir = path.join(homeDir, '.previous-admin');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  return path.join(dbDir, 'previous-admin.db');
}

/**
 * Initialize database schema
 */
function initializeSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS configurations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      config_data TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    )
  `);
}

/**
 * Import example database directly
 */
function importExampleDatabase(): void {
  const exampleDbPath = path.join(process.cwd(), '.github', 'assets', 'db', 'previous-admin-example-database.json');

  // Verify file exists
  if (!fs.existsSync(exampleDbPath)) {
    console.error(`❌ Example database file not found at: ${exampleDbPath}`);
    process.exit(1);
  }

  try {
    // Read the example database
    console.log(`📂 Reading example database from: ${exampleDbPath}`);
    const databaseContent = fs.readFileSync(exampleDbPath, 'utf-8');
    const databaseDump: DatabaseExport = JSON.parse(databaseContent);

    // Validate structure
    if (!databaseDump.configurations || !Array.isArray(databaseDump.configurations)) {
      throw new Error('Invalid database dump format: missing configurations array');
    }

    console.log(`📦 Loaded ${databaseDump.configurations.length} configuration(s)`);

    // Open database
    const dbPath = getDatabasePath();
    console.log(`🗄️  Opening database at: ${dbPath}`);
    const database = new Database(dbPath);

    // Initialize schema
    initializeSchema(database);

    // Clear existing configurations
    database.prepare('DELETE FROM configurations').run();

    // Import configurations
    const insertStatement = database.prepare(`
      INSERT OR REPLACE INTO configurations 
      (id, name, description, config_data, is_active, created_at, updated_at, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const statistics = {
      imported: 0,
      skipped: 0,
      errors: 0,
    };

    for (const config of databaseDump.configurations) {
      try {
        if (!config.config_data) {
          console.warn(`⚠️  Skipping configuration "${config.name}": no config data found`);
          statistics.skipped++;
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
        statistics.imported++;
      } catch (error) {
        console.error(`❌ Error importing configuration "${config.name}":`, error instanceof Error ? error.message : error);
        statistics.errors++;
      }
    }

    // Close database
    database.close();

    console.log('\n✅ Database import successful!');
    console.log(`   Imported: ${statistics.imported} configuration(s)`);
    console.log(`   Skipped: ${statistics.skipped}`);
    console.log(`   Errors: ${statistics.errors}`);
  } catch (error) {
    console.error('\n❌ Failed to import example database:');
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Run import
importExampleDatabase();
