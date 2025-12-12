import type { PreviousConfig } from './types';
import { DEFAULT_CONFIG, API_BASE_URL } from './constants';

/**
 * Default path to configuration file on emulator system
 *
 * @type {string}
 */
const CONFIG_FILE_PATH = '/home/next/.config/previous/previous.cfg';

/**
 * Convert internal config object to Previous INI file format
 *
 * Transforms PreviousConfig JavaScript object to INI format string
 * compatible with Previous emulator configuration files.
 * Handles all sections: System, Screen, SCSI, Ethernet, Sound, ROM, Keyboard, Mouse.
 *
 * @param {PreviousConfig} config - Internal configuration object
 *
 * @returns {string} INI-formatted configuration file content
 *
 * @example
 * const configText = convertToConfigFile(config);
 * // Returns: [System]\nnCpuLevel = 4\nnCpuFreq = 25\n...
 */
export function convertToConfigFile(config: PreviousConfig): string {
  const lines: string[] = [];

  lines.push('[System]');
  lines.push(`nCpuLevel = ${getCpuLevel(config.system.cpu_type)}`);
  lines.push(`nCpuFreq = ${config.system.cpu_frequency}`);
  lines.push(`nMemorySize = ${config.system.memory_size}`);
  lines.push(`bTurbo = ${config.system.turbo ? 'TRUE' : 'FALSE'}`);
  lines.push(`bFPU = ${config.system.fpu ? 'TRUE' : 'FALSE'}`);
  lines.push('');

  lines.push('[Screen]');
  lines.push(`bColor = ${config.display.type === 'color' ? 'TRUE' : 'FALSE'}`);
  lines.push(`nFrameSkips = ${config.display.frameskip}`);
  lines.push(`nMonitorType = ${config.display.color_depth}`);
  lines.push('');

  lines.push('[SCSI]');
  for (let i = 0; i < 7; i++) {
    const key = `hd${i}` as keyof typeof config.scsi;
    const path = config.scsi[key];
    if (path) {
      lines.push(`szHardDiskImage[${i}] = ${path}`);
    }
  }
  if (config.scsi.cd) {
    lines.push(`szCDRomImage = ${config.scsi.cd}`);
  }
  lines.push('');

  lines.push('[Ethernet]');
  lines.push(`bEthernetConnected = ${config.network.enabled ? 'TRUE' : 'FALSE'}`);
  lines.push(`nEthernetType = ${config.network.type === 'ethernet' ? '0' : '1'}`);
  lines.push('');

  lines.push('[Sound]');
  lines.push(`bEnableSound = ${config.sound.enabled ? 'TRUE' : 'FALSE'}`);
  lines.push('');

  lines.push('[ROM]');
  if (config.boot.rom_file) {
    lines.push(`szRomImagePath = ${config.boot.rom_file}`);
  }
  lines.push(`nBootDevice = ${config.boot.scsi_id}`);
  lines.push('');

  lines.push('[Keyboard]');
  lines.push(`nKeyboardLayout = ${getKeyboardLayout(config.keyboard.type)}`);
  lines.push('');

  lines.push('[Mouse]');
  lines.push(`bEnableMouse = ${config.mouse.enabled ? 'TRUE' : 'FALSE'}`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Parse Previous INI configuration file to internal config object
 *
 * Reads INI-formatted configuration string and converts to PreviousConfig object.
 * Handles section parsing, boolean conversion, and numeric parsing.
 * Starts with DEFAULT_CONFIG as base and merges parsed values.
 *
 * @param {string} content - INI file content (multiple sections with key=value pairs)
 *
 * @returns {Partial<PreviousConfig>} Parsed configuration object
 *
 * @example
 * const config = parseConfigFile(iniContent);
 * // Handles comments (lines starting with # or ;)
 * // Returns merged config with defaults for missing values
 */
export function parseConfigFile(content: string): Partial<PreviousConfig> {
  const lines = content.split('\n');
  const config: Partial<PreviousConfig> = { ...DEFAULT_CONFIG };

  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentSection = trimmed.slice(1, -1).toLowerCase();
      continue;
    }

    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';')) {
      continue;
    }

    const [key, value] = trimmed.split('=').map((s) => s.trim());
    if (!key || value === undefined) continue;

    const boolValue = value.toUpperCase() === 'TRUE';
    const numValue = parseInt(value, 10);

    switch (currentSection) {
      case 'system':
        if (key === 'nCpuLevel' && config.system) {
          config.system.cpu_type = getCpuType(numValue);
        } else if (key === 'nCpuFreq' && config.system) {
          config.system.cpu_frequency = numValue;
        } else if (key === 'nMemorySize' && config.system) {
          config.system.memory_size = numValue;
        } else if (key === 'bTurbo' && config.system) {
          config.system.turbo = boolValue;
        } else if (key === 'bFPU' && config.system) {
          config.system.fpu = boolValue;
        }
        break;

      case 'screen':
        if (key === 'bColor' && config.display) {
          config.display.type = boolValue ? 'color' : 'monochrome';
        } else if (key === 'nFrameSkips' && config.display) {
          config.display.frameskip = numValue;
        } else if (key === 'nMonitorType' && config.display) {
          config.display.color_depth = numValue;
        }
        break;

      case 'scsi':
        if (key.startsWith('szHardDiskImage[') && config.scsi) {
          const match = key.match(/\[(\d)\]/);
          if (match) {
            const index = parseInt(match[1], 10);
            const hdKey = `hd${index}` as keyof typeof config.scsi;
            config.scsi[hdKey] = value;
          }
        } else if (key === 'szCDRomImage' && config.scsi) {
          config.scsi.cd = value;
        }
        break;

      case 'ethernet':
        if (key === 'bEthernetConnected' && config.network) {
          config.network.enabled = boolValue;
        } else if (key === 'nEthernetType' && config.network) {
          config.network.type = numValue === 0 ? 'ethernet' : 'slirp';
        }
        break;

      case 'sound':
        if (key === 'bEnableSound' && config.sound) {
          config.sound.enabled = boolValue;
        }
        break;

      case 'rom':
        if (key === 'szRomImagePath' && config.boot) {
          config.boot.rom_file = value;
        } else if (key === 'nBootDevice' && config.boot) {
          config.boot.scsi_id = numValue;
        }
        break;

      case 'keyboard':
        if (key === 'nKeyboardLayout' && config.keyboard) {
          config.keyboard.type = getKeyboardType(numValue);
        }
        break;

      case 'mouse':
        if (key === 'bEnableMouse' && config.mouse) {
          config.mouse.enabled = boolValue;
        }
        break;
    }
  }

  return config;
}

/**
 * Convert CPU type string to level number
 *
 * @param {string} cpuType - CPU type ('68030', '68040', '68060')
 * @returns {number} CPU level (3, 4, or 5; defaults to 4)
 */
function getCpuLevel(cpuType: string): number {
  switch (cpuType) {
    case '68030':
      return 3;
    case '68040':
      return 4;
    case '68060':
      return 5;
    default:
      return 4;
  }
}

/**
 * Convert CPU level number to type string
 *
 * @param {number} level - CPU level (3, 4, or 5)
 * @returns {string} CPU type ('68030', '68040', '68060'; defaults to '68040')
 */
function getCpuType(level: number): string {
  switch (level) {
    case 3:
      return '68030';
    case 4:
      return '68040';
    case 5:
      return '68060';
    default:
      return '68040';
  }
}

/**
 * Convert keyboard type to layout number
 *
 * @param {string} type - Keyboard type ('us', 'de', 'fr', 'uk')
 * @returns {number} Layout code (0-3; defaults to 0)
 */
function getKeyboardLayout(type: string): number {
  switch (type) {
    case 'us':
      return 0;
    case 'de':
      return 1;
    case 'fr':
      return 2;
    case 'uk':
      return 3;
    default:
      return 0;
  }
}

/**
 * Convert keyboard layout number to type string
 *
 * @param {number} layout - Layout code (0-3)
 * @returns {string} Keyboard type ('us', 'de', 'fr', 'uk'; defaults to 'us')
 */
function getKeyboardType(layout: number): string {
  switch (layout) {
    case 0:
      return 'us';
    case 1:
      return 'de';
    case 2:
      return 'fr';
    case 3:
      return 'uk';
    default:
      return 'us';
  }
}

/**
 * Build HTTP headers for authenticated API requests
 *
 * Includes auth token from localStorage if available.
 *
 * @returns {Object} HTTP headers with Content-Type and optional Authorization
 */
function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Sync configuration to external file via API
 *
 * Converts config to INI format and sends to backend for file writing.
 *
 * @param {PreviousConfig} config - Configuration to save
 *
 * @returns {Promise<boolean>} true if sync succeeded, false on error
 * @throws {void} Catches all errors and returns false
 *
 * @example
 * const success = await syncConfigToFile(config);
 */
export async function syncConfigToFile(config: PreviousConfig): Promise<boolean> {
  try {
    const configContent = convertToConfigFile(config);
    const response = await fetch(`${API_BASE_URL}/api/sync-config`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content: configContent, path: CONFIG_FILE_PATH }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error syncing config to file:', error);
    return false;
  }
}

/**
 * Load configuration from external file via API
 *
 * Retrieves INI file from backend and parses to internal config object.
 *
 * @returns {Promise<Partial<PreviousConfig> | null>}
 *   Parsed config on success, null on error
 * @throws {void} Catches all errors and returns null
 *
 * @example
 * const config = await loadConfigFromFile();
 * if (config) {
 *   // Use loaded configuration
 * }
 */
export async function loadConfigFromFile(): Promise<Partial<PreviousConfig> | null> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(
      `${API_BASE_URL}/api/load-config?path=${encodeURIComponent(CONFIG_FILE_PATH)}`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    if (!response.ok) return null;

    const { content } = await response.json();
    return parseConfigFile(content);
  } catch (error) {
    console.error('Error loading config from file:', error);
    return null;
  }
}
