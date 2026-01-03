/**
 * Platform abstraction layer
 *
 * Provides a unified interface for platform-specific operations.
 * Abstracts differences between macOS and Linux.
 *
 * @module backend/platform
 */

import os from 'os';

import { getPlatformModule } from './platform-detector';

export type { PlatformModule } from './types';
export * from './system-info';

/**
 * Get the current platform module
 *
 * Returns the appropriate implementation for the current operating system.
 * Supports macOS and Linux.
 *
 * @returns {Promise<PlatformModule>} Platform-specific module
 * @throws {Error} If platform is not supported
 *
 * @example
 * const platform = await getPlatform();
 * const gpuInfo = await platform.getGPUInfo();
 */
export async function getPlatform(): Promise<PlatformModule> {
  return getPlatformModule();
}

/**
 * Get current platform name
 *
 * @returns {string} Platform name: 'macos' or 'linux'
 */
export function getPlatformName(): string {
  const platform = os.platform();
  if (platform === 'darwin') return 'macos';
  if (platform === 'linux') return 'linux';
  throw new Error(`Unsupported platform: ${platform}`);
}

/**
 * Check if running on macOS
 *
 * @returns {boolean}
 */
export function isMacOS(): boolean {
  return os.platform() === 'darwin';
}

/**
 * Check if running on Linux
 *
 * @returns {boolean}
 */
export function isLinux(): boolean {
  return os.platform() === 'linux';
}
