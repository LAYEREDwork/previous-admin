/**
 * Platform detection and module loader
 *
 * Detects the current platform and loads the appropriate module.
 *
 * @module backend/platform/platform-detector
 */

import os from 'os';

import type { PlatformModule } from './types';

let cachedModule: PlatformModule | null = null;

/**
 * Get the platform-specific module
 *
 * Lazy-loads and caches the module for the current platform.
 *
 * @returns {PlatformModule} Platform implementation
 * @throws {Error} If platform is not supported
 */
export async function getPlatformModule(): Promise<PlatformModule> {
  if (cachedModule) {
    return cachedModule;
  }

  const platform = os.platform();

  switch (platform) {
    case 'darwin': {
      const module = await import('./macos/index');
      cachedModule = module.default;
      return cachedModule;
    }

    case 'linux': {
      const module = await import('./linux/index');
      cachedModule = module.default;
      return cachedModule;
    }

    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Invalidate cached module (for testing)
 *
 * @internal
 */
export function invalidateCache(): void {
  cachedModule = null;
}
