/**
 * macOS-specific configuration management
 *
 * Configuration location: ~/.config/previous/previous.cfg
 * Uses standard XDG-like structure on macOS.
 *
 * @module server/config/macos-config-manager
 */

import fs from 'fs/promises';
import path from 'path';
import { BaseConfigManager } from './base-config-manager';

/**
 * Configuration subdirectory path (relative to home)
 * @type {string}
 */
const CONFIG_SUBPATH = '.config/previous';

/**
 * macOS configuration manager
 */
export class MacOSConfigManager extends BaseConfigManager {
  /**
   * Get configuration directory path
   *
   * @returns {string} ~/.config/previous/
   */
  getConfigDir(): string {
    return path.join(this.homeDir, CONFIG_SUBPATH);
  }

  /**
   * Get configuration file path
   *
   * @returns {string} ~/.config/previous/previous.cfg
   */
  getConfigPath(): string {
    return path.join(this.getConfigDir(), 'previous.cfg');
  }

  /**
   * Ensure configuration directory exists
   *
   * Creates ~/.config/previous/ with proper permissions.
   *
   * @returns {Promise<void>}
   * @throws {Error} If directory creation fails
   */
  async ensureConfigDir(): Promise<void> {
    try {
      const configDir = this.getConfigDir();
      await fs.mkdir(configDir, { recursive: true });
    } catch (error: any) {
      throw new Error('Failed to create macOS config directory: ' + error.message);
    }
  }
}

/**
 * Factory function to create macOS config manager
 *
 * @param {string} homeDir - User home directory
 * @returns {MacOSConfigManager}
 */
export function createMacOSConfigManager(homeDir: string): MacOSConfigManager {
  return new MacOSConfigManager(homeDir);
}
