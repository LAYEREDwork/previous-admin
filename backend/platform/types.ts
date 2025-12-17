/**
 * Platform-agnostic type definitions
 *
 * Defines interfaces for platform-specific functionality.
 *
 * @module server/platform/types
 */

/**
 * Disk information
 */
export interface DiskInfo {
  filesystem: string;
  size: string;
  used: string;
  available: string;
  usePercent: string;
  mountpoint: string;
}

/**
 * Network interface information
 */
export interface NetworkInterface {
  interface: string;
  address: string;
}

/**
 * Monitor resolution information
 */
export interface MonitorResolution {
  width: number;
  height: number;
  source: string;
}

/**
 * CPU information
 */
export interface CPUInfo {
  model: string;
  cores: number;
  speed: number;
}

/**
 * Memory information
 */
export interface MemoryInfo {
  total: number;
  free: number;
  used: number;
}

/**
 * Host model information
 */
export interface HostModel {
  name: string;
  serial?: string;
  vendor?: string;
}

/**
 * Platform-specific system information module
 */
export interface PlatformModule {
  /**
   * Get GPU information
   * @returns Promise<string[]> Array of GPU descriptions
   */
  getGPUInfo(): Promise<string[]>;

  /**
   * Get host/machine model information
   * @returns Promise<HostModel> Host model details
   */
  getHostModel(): Promise<HostModel>;

  /**
   * Get disk information
   * @returns Promise<DiskInfo[]> Array of disk information
   */
  getDiskInfo(): Promise<DiskInfo[]>;

  /**
   * Get monitor resolution
   * @returns Promise<MonitorResolution | null> Resolution or null if not available
   */
  getMonitorResolution(): Promise<MonitorResolution | null>;

  /**
   * Get system command execution helper
   * @returns Function to execute system commands
   */
  getExecAsync(): (command: string, options?: any) => Promise<{ stdout: string; stderr: string }>;

  /**
   * Get platform-specific paths
   * @returns Object with common paths for this platform
   */
  getPaths(): {
    configDir: string;
    logsDir: string;
    cacheDir: string;
  };
}
