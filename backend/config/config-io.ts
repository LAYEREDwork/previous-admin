/**
 * Configuration file I/O operations
 *
 * Handles reading, writing, parsing, and serializing configuration files.
 * Uses INI format for configuration storage.
 * Platform-agnostic - works on all supported platforms.
 *
 * @module backend/config/config-io
 */

import fs from 'fs/promises';
import ini from 'ini';
import type { PreviousConfig } from '../../shared/types';

/**
 * Parse INI configuration file to config object
 *
 * Converts INI format string to PreviousConfig object.
 * Uses sensible defaults for missing values.
 *
 * @param {string} iniContent - INI file content
 *
 * @returns {PreviousConfig} Parsed configuration object
 *
 * @example
 * const config = parseConfig(iniFileContent);
 */
export function parseConfig(iniContent: string): PreviousConfig {
  const parsed = ini.parse(iniContent);

  return {
    system: {
      cpu_type: parsed.System?.CPUType || '68040',
      cpu_frequency: parseInt(parsed.System?.CPUFrequency) || 25,
      memory_size: parseInt(parsed.System?.MemorySize) || 32,
      turbo: parsed.System?.Turbo === 'true' || false,
      fpu: parsed.System?.FPU !== 'false',
    },
    display: {
      type: parsed.Display?.Type || 'color',
      width: parseInt(parsed.Display?.Width) || 1120,
      height: parseInt(parsed.Display?.Height) || 832,
      color_depth: parseInt(parsed.Display?.ColorDepth) || 24,
      frameskip: parseInt(parsed.Display?.Frameskip) || 0,
    },
    scsi: {
      hd0: parsed.SCSI?.HD0 || '',
      hd1: parsed.SCSI?.HD1 || '',
      hd2: parsed.SCSI?.HD2 || '',
      hd3: parsed.SCSI?.HD3 || '',
      hd4: parsed.SCSI?.HD4 || '',
      hd5: parsed.SCSI?.HD5 || '',
      hd6: parsed.SCSI?.HD6 || '',
      cd: parsed.SCSI?.CD || '',
    },
    network: {
      enabled: parsed.Network?.Enabled === 'true' || false,
      type: parsed.Network?.Type || 'ethernet',
    },
    sound: {
      enabled: parsed.Sound?.Enabled !== 'false',
      output: parsed.Sound?.Output || 'sdl',
    },
    boot: {
      rom_file: parsed.Boot?.ROMFile || '',
      scsi_id: parseInt(parsed.Boot?.SCSIID) || 0,
    },
    keyboard: {
      type: parsed.Keyboard?.Type || 'us',
    },
    mouse: {
      enabled: parsed.Mouse?.Enabled !== 'false',
    },
  };
}

/**
 * Convert config object to INI format string
 *
 * Transforms PreviousConfig object to INI format for file storage.
 *
 * @param {PreviousConfig} config - Configuration object
 *
 * @returns {string} INI-formatted configuration
 *
 * @example
 * const iniContent = serializeConfig(configObject);
 */
export function serializeConfig(config: PreviousConfig): string {
  const iniData = {
    System: {
      CPUType: config.system.cpu_type,
      CPUFrequency: config.system.cpu_frequency,
      MemorySize: config.system.memory_size,
      Turbo: config.system.turbo ? 'true' : 'false',
      FPU: config.system.fpu ? 'true' : 'false',
    },
    Display: {
      Type: config.display.type,
      Width: config.display.width,
      Height: config.display.height,
      ColorDepth: config.display.color_depth,
      Frameskip: config.display.frameskip,
    },
    SCSI: {
      HD0: config.scsi.hd0 || '',
      HD1: config.scsi.hd1 || '',
      HD2: config.scsi.hd2 || '',
      HD3: config.scsi.hd3 || '',
      HD4: config.scsi.hd4 || '',
      HD5: config.scsi.hd5 || '',
      HD6: config.scsi.hd6 || '',
      CD: config.scsi.cd || '',
    },
    Network: {
      Enabled: config.network.enabled ? 'true' : 'false',
      Type: config.network.type,
    },
    Sound: {
      Enabled: config.sound.enabled ? 'true' : 'false',
      Output: config.sound.output,
    },
    Boot: {
      ROMFile: config.boot.rom_file,
      SCSIID: config.boot.scsi_id,
    },
    Keyboard: {
      Type: config.keyboard.type,
    },
    Mouse: {
      Enabled: config.mouse.enabled ? 'true' : 'false',
    },
  };

  return ini.stringify(iniData);
}

/**
 * Read and parse configuration file from disk
 *
 * Reads INI file and parses to config object.
 * Returns null if file doesn't exist, throws on other errors.
 *
 * @param {string} configPath - Full path to config file
 *
 * @returns {Promise<PreviousConfig | null>} Configuration object or null if not found
 * @throws {Error} If file read or parse fails (except ENOENT)
 *
 * @example
 * const config = await readConfig('/path/to/config');
 */
export async function readConfig(configPath: string): Promise<PreviousConfig | null> {
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    return parseConfig(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw new Error('Failed to read config file: ' + error.message);
  }
}

/**
 * Write configuration to file
 *
 * Serializes config object to INI format and writes to disk.
 * Creates/overwrites file.
 *
 * @param {string} configPath - Full path to config file
 * @param {PreviousConfig} config - Configuration object to write
 *
 * @returns {Promise<void>}
 * @throws {Error} If write fails
 *
 * @example
 * await writeConfig('/path/to/config', configObject);
 */
export async function writeConfig(configPath: string, config: PreviousConfig): Promise<void> {
  try {
    const content = serializeConfig(config);
    await fs.writeFile(configPath, content, 'utf-8');
  } catch (error: any) {
    throw new Error('Failed to write config file: ' + error.message);
  }
}
