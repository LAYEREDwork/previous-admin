/**
 * Unified configuration manager
 *
 * High-level API for configuration management.
 * Handles reading, writing, and watching config files across macOS and Linux.
 *
 * @module backend/config/config-manager
 */

import fs from 'fs/promises';
import { createConfigManager } from './config-manager-factory';
import { readConfig as ioReadConfig, writeConfig as ioWriteConfig, getDefaultConfig } from './config-io';
import { BaseConfigManager } from './base-config-manager';

/**
 * Configuration object schema
 */
export interface PreviousConfig {
  system: {
    cpu_type: string;
    cpu_frequency: number;
    memory_size: number;
    turbo: boolean;
    fpu: boolean;
  };
  display: {
    type: string;
    width: number;
    height: number;
    color_depth: number;
    frameskip: number;
  };
  scsi: {
    hd0: string;
    hd1: string;
    hd2: string;
    hd3: string;
    hd4: string;
    hd5: string;
    hd6: string;
    cd: string;
  };
  network: {
    enabled: boolean;
    type: string;
  };
  sound: {
    enabled: boolean;
    output: string;
  };
  boot: {
    rom_file: string;
    scsi_id: number;
  };
  keyboard: {
    type: string;
  };
  mouse: {
    enabled: boolean;
  };
}

/**
 * Unified configuration manager
 *
 * Provides a consistent API for configuration management
 * across macOS, Linux, and Windows.
 */
export class ConfigManager {
  private platformManager: BaseConfigManager;

  constructor(homeDir?: string) {
    this.platformManager = createConfigManager(homeDir);
  }

  /**
   * Get configuration file path
   *
   * @returns {string} Full path to config file
   */
  getConfigPath(): string {
    return this.platformManager.getConfigPath();
  }

  /**
   * Get configuration directory path
   *
   * @returns {string} Full path to config directory
   */
  getConfigDir(): string {
    return this.platformManager.getConfigDir();
  }

  /**
   * Ensure configuration directory exists
   *
   * Creates directory if it doesn't exist.
   *
   * @returns {Promise<void>}
   * @throws {Error} If directory creation fails
   */
  async ensureConfigDir(): Promise<void> {
    return this.platformManager.ensureConfigDir();
  }

  /**
   * Read and parse configuration file
   *
   * Returns default config if file doesn't exist.
   * Throws error on parse failure.
   *
   * @returns {Promise<PreviousConfig>} Configuration object
   * @throws {Error} If reading or parsing fails
   */
  async readConfig(): Promise<PreviousConfig> {
    const configPath = this.getConfigPath();
    const config = await ioReadConfig(configPath);
    return config || getDefaultConfig();
  }

  /**
   * Write configuration to file
   *
   * Ensures directory exists before writing.
   *
   * @param {PreviousConfig} config - Configuration object to write
   *
   * @returns {Promise<void>}
   * @throws {Error} If writing fails
   */
  async writeConfig(config: PreviousConfig): Promise<void> {
    await this.ensureConfigDir();
    const configPath = this.getConfigPath();
    return ioWriteConfig(configPath, config);
  }

  /**
   * Check if configuration file exists
   *
   * @returns {Promise<boolean>}
   */
  async configExists(): Promise<boolean> {
    try {
      const configPath = this.getConfigPath();
      await fs.access(configPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get default configuration
   *
   * @returns {PreviousConfig}
   */
  getDefaultConfig(): PreviousConfig {
    return getDefaultConfig();
  }
}

/**
 * Export default configuration getter from config-io
 */
export { getDefaultConfig };

// Singleton instance
let configManagerInstance: ConfigManager | null = null;

/**
 * Get or create singleton configuration manager
 *
 * @returns {ConfigManager}
 */
export function getConfigManager(): ConfigManager {
  if (!configManagerInstance) {
    configManagerInstance = new ConfigManager();
  }
  return configManagerInstance;
}

/**
 * Reset singleton (for testing)
 *
 * @internal
 */
export function resetConfigManager(): void {
  configManagerInstance = null;
}
