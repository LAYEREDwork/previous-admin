/**
 * Linux-specific configuration management
 *
 * Configuration location: ~/.config/previous/previous.cfg
 * Follows XDG Base Directory specification.
 *
 * @module backend/config/linux-config-manager
 */

import fs from 'fs/promises';
import path from 'path';

import { BaseConfigManager } from './base-config-manager';

/**
 * Configuration subdirectory path (relative to home)
 * Follows XDG spec: $XDG_CONFIG_HOME/previous
 * @type {string}
 */
const CONFIG_SUBPATH = '.config/previous';

/**
 * Linux configuration manager
 *
 * Follows XDG Base Directory specification:
 * https://specifications.freedesktop.org/basedir-spec/
 */
export class LinuxConfigManager extends BaseConfigManager {
  /**
   * Get configuration directory path
   *
   * Respects XDG_CONFIG_HOME environment variable if set.
   *
   * @returns {string} Configuration directory path
   */
  getConfigDir(): string {
    const xdgConfigHome = process.env.XDG_CONFIG_HOME;
    if (xdgConfigHome) {
      return path.join(xdgConfigHome, 'previous');
    }
    return path.join(this.homeDir, CONFIG_SUBPATH);
  }

  /**
   * Get configuration file path
   *
   * @returns {string} ~/.config/previous/previous.cfg or $XDG_CONFIG_HOME/previous/previous.cfg
   */
  getConfigPath(): string {
    return path.join(this.getConfigDir(), 'previous.cfg');
  }

  /**
   * Ensure configuration directory exists
   *
   * Creates config directory with proper permissions (0700).
   *
   * @returns {Promise<void>}
   * @throws {Error} If directory creation fails
   */
  async ensureConfigDir(): Promise<void> {
    try {
      const configDir = this.getConfigDir();
      await fs.mkdir(configDir, { recursive: true, mode: 0o700 });
    } catch (error: any) {
      throw new Error('Failed to create Linux config directory: ' + error.message);
    }
  }
}

/**
 * Factory function to create Linux config manager
 *
 * @param {string} homeDir - User home directory
 * @returns {LinuxConfigManager}
 */
export function createLinuxConfigManager(homeDir: string): LinuxConfigManager {
  return new LinuxConfigManager(homeDir);
}
