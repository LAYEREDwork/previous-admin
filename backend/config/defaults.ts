/**
 * Default configuration values
 *
 * This module provides the default Previous emulator configuration.
 * Used when:
 * - Creating new configuration files
 * - Initializing the system with no prior config
 * - Resetting to defaults
 *
 * This is the SINGLE SOURCE OF TRUTH for default config values.
 *
 * @module backend/config/defaults
 */

import type { PreviousConfig } from '@shared/previous-config/types';

/**
 * Default system configuration
 *
 * Provides moderate system specifications suitable for general use.
 * All hard drives and CD-ROM paths are empty by default.
 *
 * @type {PreviousConfig}
 */
export const DEFAULT_CONFIG: PreviousConfig = {
  system: {
    cpu_type: '68040',
    cpu_frequency: 25,
    memory_size: 32,
    turbo: false,
    fpu: true,
  },
  display: {
    type: 'color',
    width: 1120,
    height: 832,
    color_depth: 24,
    frameskip: 0,
  },
  scsi: {
    hd0: '',
    hd1: '',
    hd2: '',
    hd3: '',
    hd4: '',
    hd5: '',
    hd6: '',
    cd: '',
  },
  network: {
    enabled: false,
    type: 'ethernet',
  },
  sound: {
    enabled: true,
    output: 'sdl',
  },
  boot: {
    rom_file: '',
    scsi_id: 0,
  },
  keyboard: {
    type: 'us',
  },
  mouse: {
    enabled: true,
  },
};

/**
 * Get default configuration object
 *
 * Returns a fresh copy of the default configuration.
 * Useful for resetting or initializing new configs.
 *
 * @returns {PreviousConfig} Default configuration object
 */
export function getDefaultConfig(): PreviousConfig {
  return structuredClone(DEFAULT_CONFIG);
}
