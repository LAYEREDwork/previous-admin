/**
 * Configuration management API routes
 *
 * Handles reading, writing, and broadcasting configuration changes.
 * Uses platform-specific configuration managers for file paths.
 *
 * Endpoints:
 *   - GET /api/config: Retrieve user configuration
 *   - PUT /api/config: Update user configuration
 *
 * @requires express - HTTP framework
 * @requires config - Unified config manager
 */

import express, { Request } from 'express';
import { getConfigManager, getDefaultConfig, PreviousConfig } from '../config/index';
import { apiPaths } from '../../shared/constants';
import { TypedResponse } from '../types';

const router = express.Router();
const configManager = getConfigManager();

/**
 * GET /api/config
 *
 * Retrieve user's configuration file
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
    res.status(500).json({ error: 'Failed to read configuration' });
  }
});

/**
 * PUT /api/config
 *
 * Update user's configuration file
 *
 * Writes updated config to disk and broadcasts changes to all
 * connected WebSocket clients for real-time synchronization.
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
      return res.status(400).json({ error: 'Config data required' });
    }

    await configManager.writeConfig(config);

    // Broadcast update to connected clients
    if (req.app.locals.broadcastConfigUpdate) {
      req.app.locals.broadcastConfigUpdate(config);
    }

    res.json({ success: true, config });
  } catch (error) {
    console.error('Error writing config:', error);
    res.status(500).json({ error: 'Failed to write configuration' });
  }
});

export default router;
