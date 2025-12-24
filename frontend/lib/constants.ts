import type { PreviousConfig } from './types';
import { CpuType, DisplayType, NetworkType, SoundOutput, PrinterType, KeyboardType } from '../../shared/enums';

/**
 * Application name
 */
export const appName = 'Previous Admin';

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

/**
 * Backend server port
 *
 * The port on which the backend Express server runs.
 * Used for both HTTP API requests and WebSocket connections.
 *
 * @type {number}
 */
export const backendPort = 3001;

/**
 * Base URL for API requests
 *
 * Dynamically constructs API endpoint based on current hostname.
 * Backend server must be running on the configured backendPort.
 * Uses HTTP protocol (browser may upgrade to HTTPS automatically).
 *
 * @type {string}
 *
 * @example
 * // If accessing from 'example.com':
 * // apiBaseUrl = 'http://example.com:3001'
 *
 * // If accessing from 'localhost':
 * // apiBaseUrl = 'http://localhost:3001'
 */
export const apiBaseUrl = `http://${window.location.hostname}:${backendPort}`;

/**
 * WebSocket URL for real-time metrics
 *
 * Dynamically constructs WebSocket endpoint based on current hostname and protocol.
 * Uses secure WebSocket (wss:) when page is served over HTTPS.
 *
 * @type {string}
 */
export const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:${backendPort}`;

/**
 * Available metrics update frequencies (in seconds)
 *
 * Provides user selectable options for real-time metrics polling.
 * Smaller values provide more frequent updates but use more bandwidth.
 *
 * @type {number[]}
 *
 * @example
 * metricsUpdateFrequencies // [0.5, 0.75, 1.0, 1.5, 2.0]
 */
export const metricsUpdateFrequencies = [0.25, 0.5, 1.0, 1.5, 1.75];

/**
 * Default metrics update frequency (in seconds)
 *
 * Used when user hasn't explicitly selected a frequency.
 * Updates metrics 2 times per second for responsive real-time data.
 *
 * @type {number}
 */
export const defaultMetricsUpdateFrequency = 0.5;
