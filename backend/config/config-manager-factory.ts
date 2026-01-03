/**
 * Unified configuration manager factory
 *
 * Creates platform-specific config managers.
 * Abstracts platform detection and manager creation.
 *
 * @module backend/config/config-manager-factory
 */

import os from 'os';

import { BaseConfigManager } from './base-config-manager';
import { LinuxConfigManager } from './linux-config-manager';
import { MacOSConfigManager } from './macos-config-manager';

/**
 * Create platform-specific configuration manager
 *
 * Automatically detects the current platform and creates
 * the appropriate configuration manager.
 *
 * @param {string} homeDir - User home directory (optional, defaults to os.homedir())
 *
 * @returns {BaseConfigManager} Platform-specific config manager
 *
 * @throws {Error} If platform is not supported
 *
 * @example
 * const configManager = createConfigManager();
 * const configPath = configManager.getConfigPath();
 */
export function createConfigManager(homeDir: string = os.homedir()): BaseConfigManager {
  const platform = os.platform();

  switch (platform) {
    case 'darwin':
      return new MacOSConfigManager(homeDir);

    case 'linux':
      return new LinuxConfigManager(homeDir);

    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Get platform name
 *
 * @returns {string} Platform identifier: 'macos' or 'linux'
 */
export function getPlatformName(): string {
  const platform = os.platform();
  switch (platform) {
    case 'darwin':
      return 'macos';
    case 'linux':
      return 'linux';
    default:
      return 'unknown';
  }
}

export { BaseConfigManager, MacOSConfigManager, LinuxConfigManager };
