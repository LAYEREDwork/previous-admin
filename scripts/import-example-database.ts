/**
 * Import Example Database Script
 *
 * Loads the example database from .github/assets/db/ into the test backend.
 * This is useful for setting up a consistent database state before running tests or generating screenshots.
 *
 * Usage:
 *   npm run import-example-db
 *   npx ts-node scripts/import-example-database.ts
 */

import fs from 'fs';
import path from 'path';

/**
 * Import example database via API
 */
async function importExampleDatabase() {
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
    const databaseDump = JSON.parse(databaseContent);

    // Validate structure
    if (!databaseDump.configurations || !Array.isArray(databaseDump.configurations)) {
      throw new Error('Invalid database dump format: missing configurations array');
    }

    console.log(`📦 Loaded ${databaseDump.configurations.length} configuration(s)`);

    // Import via API
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    const importUrl = `${apiBaseUrl}/api/database/import`;

    console.log(`🔄 Importing to: ${importUrl}`);

    const response = await fetch(importUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dump: databaseDump,
        merge: false, // Replace existing data
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API request failed with status ${response.status}: ${errorData.error || errorData.message || 'Unknown error'}`
      );
    }

    const result = await response.json();

    console.log('\n✅ Database import successful!');
    console.log(`   Imported: ${result.stats?.configurations?.imported || 0} configuration(s)`);
    console.log(`   Skipped: ${result.stats?.configurations?.skipped || 0}`);
    console.log(`   Errors: ${result.stats?.configurations?.errors || 0}`);
  } catch (error) {
    console.error('\n❌ Failed to import example database:');
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Run import
importExampleDatabase();
