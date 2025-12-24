/**
 * macOS platform-specific implementation
 *
 * Provides macOS-specific system information gathering using:
 * - system_profiler: GPU, display, host model
 * - diskutil: Disk information
 * - sysctl: System properties
 *
 * @module backend/platform/macos
 */

import { execAsync } from '../../api/helpers';
import type { PlatformModule, DiskInfo, HostModel, MonitorResolution } from '../types';

/**
 * macOS platform module
 */
const macosModule: PlatformModule = {
  /**
   * Get GPU information on macOS
   *
   * Uses system_profiler to query display chipset information.
   *
   * @returns {Promise<string[]>} Array of GPU model names
   */
  async getGPUInfo(): Promise<string[]> {
    try {
      const { stdout } = await execAsync(
        'system_profiler SPDisplaysDataType | grep "Chipset Model:" | cut -d":" -f2 | xargs || echo "N/A"'
      );
      const gpuInfo = stdout.trim().split('\n').filter((line: string) => line.length > 0);
      return gpuInfo.length > 0 ? gpuInfo : ['N/A'];
    } catch {
      return ['N/A'];
    }
  },

  /**
   * Get host model information on macOS
   *
   * Uses sysctl to get hardware model identifier.
   *
   * @returns {Promise<HostModel>} Host model information
   */
  async getHostModel(): Promise<HostModel> {
    try {
      const { stdout: model } = await execAsync('sysctl -n hw.model 2>/dev/null || echo "Unknown"');
      return {
        name: model.trim() || 'Unknown'
      };
    } catch {
      return { name: 'Unknown' };
    }
  },

  /**
   * Get disk information on macOS
   *
   * Uses diskutil to enumerate mounted volumes and their properties.
   * Includes both internal and external drives.
   *
   * @returns {Promise<DiskInfo[]>} Array of disk information
   */
  async getDiskInfo(): Promise<DiskInfo[]> {
    try {
      const script = `
        seen=()
        for v in / /Volumes/*; do
          info=$(diskutil info "$v" 2>/dev/null) || continue
          uuid=$(echo "$info" | grep -E "Volume UUID|Disk / Partition UUID" | head -1 | awk -F': *' '{print $2}')
          dev=$(echo "$info" | grep "Device Node" | awk -F': *' '{print $2}')
          key="\${uuid:-\$dev}" // eslint-disable-line no-useless-escape
          [ -z "$key" ] && continue
          [[ " \${seen[@]} " == *" \$key "* ]] && continue // eslint-disable-line no-useless-escape
          seen+=("$key")
          echo "$info"
          echo "---DISK_END---"
        done
      `.trim();

      const { stdout: diskInfo } = await execAsync(script, { maxBuffer: 10 * 1024 * 1024 });
      
      if (!diskInfo || !diskInfo.trim()) {
        console.warn('macOS getDiskInfo: No disk info returned from diskutil');
        return [];
      }

      const diskBlocks = diskInfo.trim().split('---DISK_END---').filter((block: string) => block.trim());

      const formatSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      const disks: DiskInfo[] = diskBlocks
        .map((block: string) => {
          const disk: any = {};

          // Parse all key-value pairs
          const lines = block.trim().split('\n');
          lines.forEach((line: string) => {
            const match = line.match(/^[\s]*(.*?):\s*(.*)$/);
            if (!match) return;

            const key = match[1].trim();
            const value = match[2].trim();

            if (key === 'Volume Name') disk.volumeName = value;
            if (key === 'Device Node') disk.deviceNode = value;
            if (key === 'Mount Point') disk.mountpoint = value;
            if (key === 'File System Personality') disk.fileSystem = value;

            // For Container-based volumes (APFS)
            if (key === 'Container Total Space') {
              const match = value.match(/\((\d+)\s*Bytes\)/);
              if (match) disk.containerTotalBytes = parseInt(match[1], 10);
            }
            if (key === 'Container Free Space') {
              const match = value.match(/\((\d+)\s*Bytes\)/);
              if (match) disk.containerFreeBytes = parseInt(match[1], 10);
            }
            // For standalone volumes
            if (key === 'Disk Size') {
              const match = value.match(/\((\d+)\s*Bytes\)/);
              if (match) disk.diskSizeBytes = parseInt(match[1], 10);
            }
            // Volume used space (for APFS)
            if (key === 'Volume Used Space') {
              const match = value.match(/\((\d+)\s*Bytes\)/);
              if (match) disk.volumeUsedBytes = parseInt(match[1], 10);
            }
          });

          // Determine total and used bytes
          const totalBytes = disk.containerTotalBytes || disk.diskSizeBytes;
          let usedBytes: number;

          if (disk.containerFreeBytes !== undefined && disk.containerTotalBytes) {
            usedBytes = disk.containerTotalBytes - disk.containerFreeBytes;
          } else if (disk.volumeUsedBytes !== undefined) {
            usedBytes = disk.volumeUsedBytes;
          } else {
            usedBytes = 0;
          }

          if (totalBytes && usedBytes !== undefined) {
            const availableBytes = totalBytes - usedBytes;
            
            // Extract friendly volume name from mount point if volume name is not available
            let displayName = disk.volumeName;
            if (!displayName && disk.mountpoint) {
              // Extract the last path component from mount point
              // e.g., "/Volumes/Sandisk" -> "Sandisk", "/" -> "System"
              if (disk.mountpoint === '/') {
                displayName = 'System';
              } else {
                displayName = disk.mountpoint.split('/').filter(Boolean).pop() || 'Unknown';
              }
            }
            
            return {
              filesystem: displayName || disk.deviceNode || 'Unknown',
              size: formatSize(totalBytes),
              used: formatSize(usedBytes),
              available: formatSize(availableBytes),
              usePercent: totalBytes > 0 ? `${Math.round((usedBytes / totalBytes) * 100)}%` : '0%',
              mountpoint: disk.mountpoint || '/'
            };
          }
          return null;
        })
        .filter((d: DiskInfo | null) => d !== null) as DiskInfo[];

      return disks;
    } catch (error) {
      console.error('macOS getDiskInfo error:', error);
      return [];
    }
  },

  /**
   * Get monitor resolution on macOS
   *
   * Uses system_profiler to query display resolution.
   *
   * @returns {Promise<MonitorResolution | null>} Resolution or null if not available
   */
  async getMonitorResolution(): Promise<MonitorResolution | null> {
    try {
      const { stdout } = await execAsync(
        'system_profiler SPDisplaysDataType | grep Resolution | head -1 || echo ""'
      );

      if (stdout.trim()) {
        const match = stdout.match(/([0-9]+)\s*x\s*([0-9]+)/);
        if (match) {
          return {
            width: parseInt(match[1], 10),
            height: parseInt(match[2], 10),
            source: 'system_profiler'
          };
        }
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
   * @returns {Object} Common paths for macOS
   */
  getPaths() {
    const home = process.env.HOME || '/tmp';
    return {
      configDir: `${home}/Library/Application Support/previous-admin`,
      logsDir: `${home}/Library/Logs/previous-admin`,
      cacheDir: `${home}/Library/Caches/previous-admin`
    };
  }
};

export default macosModule;
