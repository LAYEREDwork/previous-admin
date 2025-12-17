/**
 * Linux platform-specific implementation
 *
 * Provides Linux-specific system information gathering using:
 * - lspci: GPU information
 * - df: Disk information
 * - /proc/device-tree: Raspberry Pi detection
 * - dmidecode: System board information
 * - tvservice/xrandr: Display resolution
 *
 * @module server/platform/linux
 */

import { execAsync } from '../../api/helpers';
import type { PlatformModule, DiskInfo, HostModel, MonitorResolution } from '../types';

/**
 * Linux platform module
 */
const linuxModule: PlatformModule = {
  /**
   * Get GPU information on Linux
   *
   * Uses lspci to query PCI devices for video controllers.
   *
   * @returns {Promise<string[]>} Array of GPU descriptions
   */
  async getGPUInfo(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('lspci | grep -i vga || echo "N/A"');
      const gpuInfo = stdout.trim().split('\n').filter((line: string) => line.length > 0);
      return gpuInfo.length > 0 ? gpuInfo : ['N/A'];
    } catch {
      return ['N/A'];
    }
  },

  /**
   * Get host model information on Linux
   *
   * Attempts to detect:
   * 1. Raspberry Pi (via /proc/device-tree/model)
   * 2. Generic board info (via DMI)
   *
   * @returns {Promise<HostModel>} Host model information
   */
  async getHostModel(): Promise<HostModel> {
    try {
      // Try Raspberry Pi detection
      try {
        const { stdout: rpiModel } = await execAsync(
          "tr -d '\\0' </proc/device-tree/model 2>/dev/null || echo ''"
        );
        if (rpiModel.trim()) {
          return { name: rpiModel.trim() };
        }
      } catch {
        // Fall through to DMI check
      }

      // Try DMI board detection
      try {
        const { stdout: dmiData } = await execAsync(
          'cat /sys/class/dmi/id/board_name 2>/dev/null || echo ""'
        );
        if (dmiData.trim()) {
          return { name: dmiData.trim() };
        }
      } catch {
        // Fall through to default
      }

      return { name: 'Unknown' };
    } catch {
      return { name: 'Unknown' };
    }
  },

  /**
   * Get disk information on Linux
   *
   * Uses df to query filesystem disk usage for root and home directories.
   *
   * @returns {Promise<DiskInfo[]>} Array of disk information
   */
  async getDiskInfo(): Promise<DiskInfo[]> {
    try {
      const { stdout } = await execAsync('df -h / /home 2>/dev/null | tail -n +2 || echo "N/A"');
      const diskLines = stdout.trim().split('\n').filter((line: string) => line.length > 0);

      const disks: DiskInfo[] = diskLines.map((line: string) => {
        const parts = line.split(/\s+/);
        return {
          filesystem: parts[0],
          size: parts[1],
          used: parts[2],
          available: parts[3],
          usePercent: parts[4],
          mountpoint: parts[5]
        };
      });

      return disks;
    } catch (error) {
      console.error('Linux getDiskInfo error:', error);
      return [];
    }
  },

  /**
   * Get monitor resolution on Linux
   *
   * Attempts to detect resolution using:
   * 1. tvservice (Raspberry Pi)
   * 2. xrandr (X11 systems)
   *
   * @returns {Promise<MonitorResolution | null>} Resolution or null if not available
   */
  async getMonitorResolution(): Promise<MonitorResolution | null> {
    try {
      // Try tvservice first (Raspberry Pi)
      try {
        const { stdout: tvInfo } = await execAsync('tvservice -s 2>/dev/null || echo ""');
        if (tvInfo.trim()) {
          const match = tvInfo.match(/([0-9]+)x([0-9]+)/);
          if (match) {
            return {
              width: parseInt(match[1], 10),
              height: parseInt(match[2], 10),
              source: 'tvservice'
            };
          }
        }
      } catch {
        // Fall through to xrandr
      }

      // Try xrandr (X11)
      try {
        const { stdout: xrandrInfo } = await execAsync(
          'xrandr --current 2>/dev/null | grep -E "^[^ ].*connected" | head -1 || echo ""'
        );
        if (xrandrInfo.trim()) {
          const match = xrandrInfo.match(/([0-9]+)x([0-9]+)/);
          if (match) {
            return {
              width: parseInt(match[1], 10),
              height: parseInt(match[2], 10),
              source: 'xrandr'
            };
          }
        }
      } catch {
        // No display detected
      }

      return null;
    } catch {
      return null;
    }
  },

  /**
   * Get execution helper
   *
   * @returns {Function} execAsync function
   */
  getExecAsync() {
    return execAsync;
  },

  /**
   * Get platform-specific paths
   *
   * @returns {Object} Common paths for Linux
   */
  getPaths() {
    const home = process.env.HOME || '/tmp';
    return {
      configDir: `${home}/.config/previous-admin`,
      logsDir: `${home}/.local/share/previous-admin/logs`,
      cacheDir: `${home}/.cache/previous-admin`
    };
  }
};

export default linuxModule;
