import type { PreviousConfig } from './types';

/**
 * Default system configuration
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
 * API server configuration
 */
export const API_CONFIG = {
  PORT: process.env.PORT || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  MAX_PAYLOAD_SIZE: '10mb',
};



/**
 * API base URL for internal requests
 */
export const API_BASE_URL = 'http://localhost:3001';
