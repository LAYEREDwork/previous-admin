import type { PreviousConfig } from '@shared/previous-config/types';

/**
 * Converts a JSON configuration object to the Previous emulator's native configuration format (.cfg).
 *
 * @param config {PreviousConfig} - The configuration object to convert
 * @returns {string} - The formatted configuration file content
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
 * Maps CPU type string to the numeric level used by the emulator.
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
 * Maps keyboard type string to the numeric layout ID used by the emulator.
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
