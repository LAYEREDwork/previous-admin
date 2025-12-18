/**
 * Previous system configuration object
 *
 * Represents complete system configuration including CPU, memory,
 * display, storage, network, sound, boot, keyboard, and mouse settings.
 * Used for emulator or virtual machine configuration.
 *
 * @interface PreviousConfig
 *
 * @property {Object} system - CPU and memory settings
 *   - cpu_type {string}: CPU model/type identifier
 *   - cpu_frequency {number}: CPU frequency in MHz
 *   - memory_size {number}: Total memory size in MB
 *   - turbo {boolean}: Enable CPU turbo mode
 *   - fpu {boolean}: Enable floating point unit
 *
 * @property {Object} display - Video/display configuration
 *   - type {string}: Display type (e.g., 'VGA', 'SVGA')
 *   - width {number}: Display width in pixels
 *   - height {number}: Display height in pixels
 *   - color_depth {number}: Color depth in bits per pixel
 *   - frameskip {number}: Frame skip interval (0 = no skip)
 *
 * @property {Object} scsi - SCSI/disk configuration
 *   - hd0...hd6 {string}: Hard disk paths/identifiers
 *   - cd {string}: CD-ROM path/identifier
 *
 * @property {Object} network - Network settings
 *   - enabled {boolean}: Enable network interface
 *   - type {string}: Network type (e.g., 'ethernet')
 *
 * @property {Object} sound - Audio configuration
 *   - enabled {boolean}: Enable sound output
 *   - output {string}: Audio output device
 *
 * @property {Object} boot - Boot configuration
 *   - rom_file {string}: Boot ROM file path
 *   - scsi_id {number}: Boot device SCSI ID
 *
 * @property {Object} keyboard - Keyboard settings
 *   - type {string}: Keyboard layout/type
 *
 * @property {Object} mouse - Mouse settings
 *   - enabled {boolean}: Enable mouse emulation
 *
 * @example
 * const config: PreviousConfig = {
 *   system: { cpu_type: '68040', cpu_frequency: 40, memory_size: 64, turbo: true, fpu: true },
 *   display: { type: 'VGA', width: 1024, height: 768, color_depth: 32, frameskip: 0 },
 *   // ... other properties
 * };
 */
export interface PreviousConfig {
  system: {
    cpu_type: string;
    cpu_frequency: number;
    memory_size: number;
    turbo: boolean;
    fpu: boolean;
  };
  display: {
    type: string;
    width: number;
    height: number;
    color_depth: number;
    frameskip: number;
  };
  scsi: {
    hd0: string;
    hd1: string;
    hd2: string;
    hd3: string;
    hd4: string;
    hd5: string;
    hd6: string;
    cd: string;
  };
  network: {
    enabled: boolean;
    type: string;
  };
  ethernet?: {
    enabled: boolean;
    type: string;
  };
  sound: {
    enabled: boolean;
    output: string;
  };
  printer?: {
    enabled: boolean;
    type: string;
  };
  boot: {
    rom_file: string;
    scsi_id: number;
  };
  keyboard: {
    type: string;
  };
  mouse: {
    enabled: boolean;
  };
}

/**
 * Stored configuration metadata
 *
 * Represents a configuration profile stored in the system.
 * Tracks ownership, creation time, and activation status.
 *
 * @interface Configuration
 *
 * @property {string} id - Unique configuration identifier (UUID)
 * @property {string} name - Human-readable configuration name
 * @property {string} description - Configuration description/notes
 * @property {PreviousConfig} config_data - Complete system configuration
 * @property {boolean} is_active - Whether this is the currently active configuration
 * @property {number} sort_order - Display order in configuration list
 * @property {string} created_at - Creation timestamp (ISO 8601 format)
 * @property {string} updated_at - Last modification timestamp (ISO 8601 format)
 * @property {string | null} created_by - Username of configuration creator (null if auto-created)
 *
 * @example
 * const config: Configuration = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   name: 'Gaming Setup',
 *   description: 'Optimized for gaming performance',
 *   config_data: PreviousConfig,
 *   is_active: true,
 *   sort_order: 1,
 *   created_at: '2024-01-15T10:30:00Z',
 *   updated_at: '2024-01-20T14:45:30Z',
 *   created_by: 'admin'
 * };
 */
export interface Configuration {
  id: string;
  name: string;
  description: string;
  config_data: PreviousConfig;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}
