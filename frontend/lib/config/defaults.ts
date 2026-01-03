import type { PreviousConfig } from '@shared/previous-config/types';
import { CpuType, DisplayType, NetworkType, SoundOutput, PrinterType, KeyboardType } from '@shared/previous-config/enums';

/**
 * Default system configuration
 *
 * Used when creating new configurations or resetting to defaults.
 * Features moderate system specifications suitable for general use.
 * All hard drives and CD-ROM paths are empty by default.
 *
 * @type {PreviousConfig}
 *
 * @example
 * const config = structuredClone(defaultConfig);
 * config.system.memory_size = 64; // Upgrade memory to 64MB
 */
export const defaultConfig: PreviousConfig = {
  system: {
    cpu_type: CpuType.cpu68040,
    cpu_frequency: 25,
    memory_size: 32,
    turbo: false,
    fpu: true,
  },
  display: {
    type: DisplayType.color,
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
    type: NetworkType.ethernet,
  },
  ethernet: {
    enabled: false,
    type: NetworkType.ethernet,
  },
  sound: {
    enabled: true,
    output: SoundOutput.sdl,
  },
  printer: {
    enabled: false,
    type: PrinterType.parallel,
  },
  boot: {
    rom_file: '',
    scsi_id: 0,
  },
  keyboard: {
    type: KeyboardType.us,
  },
  mouse: {
    enabled: true,
  },
};
