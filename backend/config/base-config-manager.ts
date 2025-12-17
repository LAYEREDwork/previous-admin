/**
 * Platform-specific config management base
 *
 * Abstract base for platform-specific configuration handling.
 * Defines common interface for all platforms.
 *
 * @module server/config/base-config-manager
 */

/**
 * Base configuration manager interface
 *
 * All platform-specific implementations must extend this class.
 */
export abstract class BaseConfigManager {
  protected homeDir: string;

  constructor(homeDir: string) {
    this.homeDir = homeDir;
  }

  /**
   * Get configuration file path for this platform
   * @returns {string} Full path to config file
   */
  abstract getConfigPath(): string;

  /**
   * Get configuration directory path for this platform
   * @returns {string} Full path to config directory
   */
  abstract getConfigDir(): string;

  /**
   * Ensure configuration directory exists
   * @returns {Promise<void>}
   */
  abstract ensureConfigDir(): Promise<void>;
}
