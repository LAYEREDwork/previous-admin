import type { PreviousConfig } from './types';
import { CpuType, DisplayType, NetworkType, SoundOutput, PrinterType, KeyboardType } from '../../../shared/enums';

/**
 * Application name
 */
export const APP_NAME = 'Previous Admin';

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
 * const config = structuredClone(DEFAULT_CONFIG);
 * config.system.memory_size = 64; // Upgrade memory to 64MB
 */
export const DEFAULT_CONFIG: PreviousConfig = {
  system: {
    cpu_type: CpuType.CPU_68040,
    cpu_frequency: 25,
    memory_size: 32,
    turbo: false,
    fpu: true,
  },
  display: {
    type: DisplayType.COLOR,
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
    type: NetworkType.ETHERNET,
  },
  ethernet: {
    enabled: false,
    type: NetworkType.ETHERNET,
  },
  sound: {
    enabled: true,
    output: SoundOutput.SDL,
  },
  printer: {
    enabled: false,
    type: PrinterType.PARALLEL,
  },
  boot: {
    rom_file: '',
    scsi_id: 0,
  },
  keyboard: {
    type: KeyboardType.US,
  },
  mouse: {
    enabled: true,
  },
};

/**
 * Backend server port
 *
 * The port on which the backend Express server runs.
 * Used for both HTTP API requests and WebSocket connections.
 *
 * @type {number}
 */
export const BACKEND_PORT = 3001;

/**
 * Base URL for API requests
 *
 * Dynamically constructs API endpoint based on current hostname.
 * Backend server must be running on the configured BACKEND_PORT.
 * Uses HTTP protocol (browser may upgrade to HTTPS automatically).
 *
 * @type {string}
 *
 * @example
 * // If accessing from 'example.com':
 * // API_BASE_URL = 'http://example.com:3001'
 *
 * // If accessing from 'localhost':
 * // API_BASE_URL = 'http://localhost:3001'
 */
export const API_BASE_URL = `http://${window.location.hostname}:${BACKEND_PORT}`;

/**
 * WebSocket URL for real-time metrics
 *
 * Dynamically constructs WebSocket endpoint based on current hostname and protocol.
 * Uses secure WebSocket (wss:) when page is served over HTTPS.
 *
 * @type {string}
 */
export const WS_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:${BACKEND_PORT}`;

/**
 * Available metrics update frequencies (in seconds)
 *
 * Provides user selectable options for real-time metrics polling.
 * Smaller values provide more frequent updates but use more bandwidth.
 *
 * @type {number[]}
 *
 * @example
 * METRICS_UPDATE_FREQUENCIES // [0.5, 0.75, 1.0, 1.5, 2.0]
 */
export const METRICS_UPDATE_FREQUENCIES = [0.25, 0.5, 1.0, 1.5, 1.75];

/**
 * Default metrics update frequency (in seconds)
 *
 * Used when user hasn't explicitly selected a frequency.
 * Updates metrics 2 times per second for responsive real-time data.
 *
 * @type {number}
 */
export const DEFAULT_METRICS_UPDATE_FREQUENCY = 0.5;
