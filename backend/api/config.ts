/**
 * Configuration management API routes
 *
 * Handles reading, writing, and broadcasting configuration changes.
 * Uses platform-specific configuration managers for file paths.
 *
 * Endpoints:
 *   - GET /api/config: Retrieve emulator configuration
 *   - PUT /api/config: Update emulator configuration
 *
 * @requires express - HTTP framework
 * @requires config - Unified config manager
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import express, { Request } from 'express';

import { apiPaths } from '@shared/api/constants';
import type { ConfigSchema } from '@shared/previous-config/schema-types';
import type { PreviousConfig } from '@shared/previous-config/types';

import { getConfigManager, getDefaultConfig } from '@backend/config/index';
import { jsonToCfg } from '@backend/config-schema/converter';
import { TypedResponse } from '@backend/types';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cache for schema (loaded once on startup)
let schemaCache: ConfigSchema | null = null;

/**
 * Load schema from generated JSON file
 * 
 * @returns {ConfigSchema} The loaded configuration schema
 * @throws {Error} If schema file cannot be found or parsed
 */
function loadSchema(): ConfigSchema {
  if (schemaCache) {
    return schemaCache;
  }

  try {
    // Try multiple paths to handle both development and production
    let schemaPath = join(__dirname, '../../shared/previous-config/schema.json');
    try {
      const schemaContent = readFileSync(schemaPath, 'utf-8');
      schemaCache = JSON.parse(schemaContent) as ConfigSchema;
      return schemaCache;
    } catch {
      // Try alternative path for built app
      schemaPath = join(process.cwd(), 'shared/previous-config/schema.json');
      const schemaContent = readFileSync(schemaPath, 'utf-8');
      schemaCache = JSON.parse(schemaContent) as ConfigSchema;
      return schemaCache;
    }
  } catch (error) {
    console.error('Failed to load config schema:', error);
    throw new Error('Config schema not found. Run "npm run generate:schema" first.');
  }
}

const router = express.Router();
const configManager = getConfigManager();

/**
 * GET /api/config
 *
 * Retrieve emulator configuration file
 *
 * Fetches config from disk.
 * Returns default config if file doesn't exist and creates it.
 *
 * @route GET /api/config
 *
 * @returns {Object}
 *   - config {PreviousConfig}: Configuration object
 *
 * @throws {500} If config file reading or creation fails
 *
 * @example
 * const res = await fetch('/api/config');
 * const { config } = await res.json();
 */
router.get(apiPaths.Config.get.relative, async (req: Request, res: TypedResponse<{ config: PreviousConfig }>) => {
  try {
    let config = await configManager.readConfig();

    if (!config) {
      config = getDefaultConfig();
      await configManager.writeConfig(config);
    }

    res.json({ config });
  } catch (error) {
    console.error('Error reading config:', error);
    res.status(500).json({ error: 'Failed to read configuration' } as any);
  }
});

/**
 * PUT /api/config
 *
 * Update emulator configuration file
 *
 * Writes updated config to disk.
 *
 * @route PUT /api/config
 *
 * @param {PreviousConfig} config - New configuration object
 *
 * @returns {Object}
 *   - success {boolean}: true on success
 *   - config {PreviousConfig}: Updated configuration object
 *
 * @throws {400} If config data is missing
 * @throws {500} If config file writing fails
 *
 * @example
 * const res = await fetch('/api/config', {
 *   method: 'PUT',
 *   body: JSON.stringify({ config: { setting: 'value' } })
 * });
 * const { success, config } = await res.json();
 */
router.put(apiPaths.Config.put.relative, async (req: Request, res: TypedResponse<{ success: boolean; config: PreviousConfig }>) => {
  try {
    const { config }: { config: PreviousConfig } = req.body;

    if (!config) {
      res.status(400).json({ error: 'Config data required' } as any);
      return;
    }

    await configManager.writeConfig(config);

    res.json({ success: true, config });
  } catch (error) {
    console.error('Error writing config:', error);
    res.status(500).json({ error: 'Failed to write configuration' } as any);
  }
});

/**
 * POST /api/config/convert-to-cfg
 *
 * Convert JSON configuration to CFG file format
 *
 * Takes a configuration object and converts it to the Previous emulator's
 * native CFG format. Used by the config editor to show the raw file preview.
 *
 * @route POST /api/config/convert-to-cfg
 *
 * @param {Object} req.body
 *   - config {PreviousConfig}: Configuration object to convert
 *
 * @returns {Object}
 *   - cfgContent {string}: Configuration in CFG file format
 *
 * @throws {400} If config data is missing
 * @throws {500} If conversion fails
 *
 * @example
 * const res = await fetch('/api/config/convert-to-cfg', {
 *   method: 'POST',
 *   body: JSON.stringify({ config: { system: { cpu_type: '68040' } } })
 * });
 * const { cfgContent } = await res.json();
 */
router.post(apiPaths.Config.convertToCfg.relative, async (req: Request, res: TypedResponse<{ cfgContent: string }>) => {
  try {
    const { config }: { config: PreviousConfig } = req.body;

    if (!config) {
      res.status(400).json({ error: 'Config data required' } as any);
      return;
    }

    // Get schema for proper type conversion
    const schema = loadSchema();

    // Get application version from package.json
    const appVersion = '1.0.1';

    // Convert to CFG format using backend converter with version info
    const cfgContent = jsonToCfg(config as any, schema, appVersion);

    res.json({ cfgContent });
  } catch (error) {
    console.error('Error converting config to CFG:', error);
    res.status(500).json({ error: 'Failed to convert configuration' } as any);
  }
});

export default router;
