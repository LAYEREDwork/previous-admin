/**
 * Shared types for Previous Admin
 * Used across frontend and backend
 */

/**
 * Previous emulator configuration structure
 *
 * Complete system configuration including CPU, memory, display, storage,
 * network, sound, boot, keyboard, and mouse settings.
 * This is the SINGLE SOURCE OF TRUTH for config structure.
 *
 * Optional fields (ethernet, printer) are UI-specific extensions used
 * by the frontend for managing additional network and printer configurations.
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
  // Optional UI-specific network extension
  ethernet?: {
    enabled: boolean;
    type: string;
  };
  sound: {
    enabled: boolean;
    output: string;
  };
  // Optional UI-specific printer extension
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
 * API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Configuration metadata
 *
 * Represents a stored configuration profile with metadata.
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

/**
 * Drag and drop state interface
 */
export interface DragState {
  draggedIndex: number | null;
  dragOverIndex: number | null;
}

/**
 * Drag and drop actions interface
 */
export interface DragActions {
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDragEnd: () => void;
  handleDragLeave: () => void;
}

/**
 * System information interface
 */
export interface SystemInfo {
  os: string;
  hostname: string;
  hostModel: { name: string };
  kernel: string;
  uptime: number;
  cpu: {
    model: string;
    cores: number;
    speed: number;
  };
  memory: {
    total: number;
    free: number;
    used: number;
  };
  gpu: string[];
  ipAddresses: Array<{ interface: string; address: string }>;
  disks: Array<{
    filesystem: string;
    size: string;
    used: string;
    available: string;
    usePercent: string;
    mountpoint: string;
  }>;
  platform: string;
  arch: string;
  monitorResolution?: {
    width: number;
    height: number;
    source: string;
  };
}