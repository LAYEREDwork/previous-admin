/**
 * Shared types for Previous Admin
 * Used across frontend and backend
 */

/**
 * Previous emulator configuration structure
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
  ethernet: {
    // Add ethernet specific fields if needed
  };
}

/**
 * API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Configuration metadata
 */
export interface Configuration {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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