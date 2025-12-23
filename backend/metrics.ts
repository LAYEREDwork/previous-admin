/**
 * Metrics collection and system performance utilities
 * Handles CPU load, memory, disk IO, and network traffic monitoring
 * 
 * Platform-aware metrics collection with support for:
 * - Linux: /proc filesystem-based metrics
 * - macOS: BSD-style system commands (iostat, netstat, vm_stat)
 */

import * as os from 'os';

interface DiskStats {
  read: number;
  write: number;
}

interface NetworkStats {
  received: number;
  sent: number;
}

interface CpuLoadEntry {
  timestamp: number;
  oneMin: number;
  fiveMin: number;
  fifteenMin: number;
}

interface MemoryEntry {
  timestamp: number;
  value: number;
}

interface DiskIOEntry {
  timestamp: number;
  read: number;
  write: number;
}

interface NetworkTrafficEntry {
  timestamp: number;
  received: number;
  sent: number;
}
import { exec, execSync } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Platform detection and configuration
 * @constant {string}
 */
const PLATFORM = os.platform(); // 'darwin' or 'linux'
const IS_MACOS = PLATFORM === 'darwin';
const IS_LINUX = PLATFORM === 'linux';

/**
 * @typedef {Object} MetricsHistory
 * @property {Array<{timestamp: number, value: number}>} cpuLoad - CPU load history
 * @property {Array<{timestamp: number, value: number}>} memory - Memory usage history
 * @property {Array<{timestamp: number, received: number, sent: number}>} networkTraffic - Network traffic history
 * @property {Array<{timestamp: number, read: number, write: number}>} diskIO - Disk IO history
 */

export const metricsHistory = {
  cpuLoad: [] as CpuLoadEntry[],
  memory: [] as MemoryEntry[],
  networkTraffic: [] as NetworkTrafficEntry[],
  diskIO: [] as DiskIOEntry[]
};

let lastDiskStats: DiskStats | null = null;
let lastNetworkStats: NetworkStats | null = null;
const MAX_HISTORY = 60;

/**
 * Get current CPU load averages
 * 
 * Platform-aware implementation:
 * - Linux: Attempts /proc/loadavg, falls back to os.loadavg()
 * - macOS: Uses os.loadavg() directly (BSD-style)
 * - Others: Uses os.loadavg()
 *
 * @returns {Promise<{oneMin: number, fiveMin: number, fifteenMin: number}>} CPU load averages
 * @throws {Error} May catch and suppress errors from exec command
 *
 * @example
 * const cpuLoad = await getCpuLoad();
 * console.log(`CPU Load: ${cpuLoad.oneMin}, ${cpuLoad.fiveMin}, ${cpuLoad.fifteenMin}`);
 */
export async function getCpuLoad() {
  try {
    let loadavg;
    
    if (IS_LINUX) {
      const { stdout } = await execAsync('cat /proc/loadavg 2>/dev/null || uptime 2>/dev/null');
      if (stdout) {
        const values = stdout.trim().split(/\s+/);
        loadavg = [
          parseFloat(values[0]) || 0,
          parseFloat(values[1]) || 0,
          parseFloat(values[2]) || 0
        ];
      }
    }
    
    // macOS and other platforms: use Node.js built-in
    if (!loadavg) {
      loadavg = os.loadavg();
    }

    return {
      oneMin: loadavg[0] || 0,
      fiveMin: loadavg[1] || 0,
      fifteenMin: loadavg[2] || 0
    };
  } catch {
    const loadavg = os.loadavg();
    return {
      oneMin: loadavg[0] || 0,
      fiveMin: loadavg[1] || 0,
      fifteenMin: loadavg[2] || 0
    };
  }
}

/**
 * Get disk IO statistics - Linux implementation
 * 
 * Reads /proc/diskstats and calculates delta since last call.
 * First call returns {read: 0, write: 0} to establish baseline.
 *
 * @returns {Promise<{read: number, write: number}>} Disk IO rates in MB
 * @private
 */
async function getDiskIOLinux() {
  try {
    const { stdout } = await execAsync('cat /proc/diskstats 2>/dev/null || echo ""');
    if (!stdout) return { read: 0, write: 0 };

    const lines = stdout.trim().split('\n');
    let totalRead = 0;
    let totalWrite = 0;

    lines.forEach(line => {
      const parts = line.split(/\s+/);
      if (parts.length >= 10) {
        totalRead += parseInt(parts[6]) || 0;
        totalWrite += parseInt(parts[10]) || 0;
      }
    });

    if (lastDiskStats === null) {
      lastDiskStats = { read: totalRead, write: totalWrite };
      return { read: 0, write: 0 };
    }

    const diffRead = (totalRead - lastDiskStats.read) * 512;
    const diffWrite = (totalWrite - lastDiskStats.write) * 512;

    lastDiskStats = { read: totalRead, write: totalWrite };

    return {
      read: Math.max(0, diffRead),
      write: Math.max(0, diffWrite)
    };
  } catch {
    return { read: 0, write: 0 };
  }
}

/**
 * Get disk IO statistics - macOS implementation
 * 
 * Uses vm_stat for page in/out statistics as proxy for disk activity.
 * Note: macOS doesn't provide easy access to disk I/O stats without admin rights.
 * This provides page statistics which correlate with disk activity.
 *
 * @returns {Promise<{read: number, write: number}>} Disk IO rates in MB/s
 * @private
 */
async function getDiskIOMacOS() {
  try {
    // vm_stat provides page statistics (pages in/out from disk)
    const { stdout } = await execAsync('vm_stat 2>/dev/null || echo ""');
    if (!stdout) return { read: 0, write: 0 };

    // Extract page size from first line
    const pageSizeMatch = stdout.match(/page size of (\d+) bytes/);
    const pageSize = pageSizeMatch ? parseInt(pageSizeMatch[1]) : 4096;

    // Parse vm_stat output for pageins/pageouts
    const pageinsMatch = stdout.match(/Pageins:\s+(\d+)/);
    const pageoutsMatch = stdout.match(/Pageouts:\s+(\d+)/);
    
    if (!pageinsMatch || !pageoutsMatch) {
      return { read: 0, write: 0 };
    }

    const pagesIn = parseInt(pageinsMatch[1]) || 0;
    const pagesOut = parseInt(pageoutsMatch[1]) || 0;

    if (lastDiskStats === null) {
      lastDiskStats = { read: pagesIn, write: pagesOut };
      return { read: 0, write: 0 };
    }

    const diffRead = (pagesIn - lastDiskStats.read) * pageSize;
    const diffWrite = (pagesOut - lastDiskStats.write) * pageSize;

    lastDiskStats = { read: pagesIn, write: pagesOut };

    return {
      read: Math.max(0, diffRead),
      write: Math.max(0, diffWrite)
    };
  } catch {
    return { read: 0, write: 0 };
  }
}

/**
 * Get disk IO statistics (read/write rates in MB)
 * 
 * Platform-aware dispatcher for disk IO metrics.
 * Delegates to platform-specific implementation.
 *
 * @returns {Promise<{read: number, write: number}>} Disk IO rates in MB
 *   - read {number}: Megabytes read per interval (default: 0 on first call)
 *   - write {number}: Megabytes written per interval (default: 0 on first call)
 *
 * @example
 * const diskIO = await getDiskIO();
 * console.log(`Read: ${diskIO.read} MB, Write: ${diskIO.write} MB`);
 */
export async function getDiskIO() {
  if (IS_MACOS) {
    return getDiskIOMacOS();
  }
  if (IS_LINUX) {
    return getDiskIOLinux();
  }
  // Unsupported platform
  return { read: 0, write: 0 };
}

/**
 * Get network traffic statistics - Linux implementation
 * 
 * Reads /proc/net/dev and calculates delta since last call.
 * Excludes loopback interface (lo).
 * First call returns {received: 0, sent: 0} to establish baseline.
 *
 * @returns {{received: number, sent: number}} Network traffic rates in MB
 * @private
 */
function getNetworkTrafficLinux() {
  try {
    let totalReceived = 0;
    let totalSent = 0;

    const stdout = execSync('cat /proc/net/dev 2>/dev/null || echo ""', { encoding: 'utf-8' });
    const lines = stdout.trim().split('\n');

    lines.forEach(line => {
      const match = line.match(/^\s*(\w+):\s+([\d\s]+)/);
      if (match && !match[1].match(/^lo$/)) {
        const parts = match[2].split(/\s+/).filter(p => p.length > 0);
        totalReceived += parseInt(parts[0]) || 0;
        totalSent += parseInt(parts[8]) || 0;
      }
    });

    if (lastNetworkStats === null) {
      lastNetworkStats = { received: totalReceived, sent: totalSent };
      return { received: 0, sent: 0 };
    }

    const diffReceived = (totalReceived - lastNetworkStats.received) * 1;
    const diffSent = (totalSent - lastNetworkStats.sent) * 1;

    lastNetworkStats = { received: totalReceived, sent: totalSent };

    return {
      received: Math.max(0, diffReceived),
      sent: Math.max(0, diffSent)
    };
  } catch {
    return { received: 0, sent: 0 };
  }
}

/**
 * Get network traffic statistics - macOS implementation
 * 
 * Uses async netstat to retrieve network interface statistics.
 * Excludes loopback interface.
 * First call returns {received: 0, sent: 0} to establish baseline.
 *
 * @returns {Promise<{received: number, sent: number}>} Network traffic rates in MB
 * @private
 */
async function getNetworkTrafficMacOS() {
  try {
    let totalReceived = 0;
    let totalSent = 0;

    // Use async execAsync instead of blocking execSync
    const { stdout } = await execAsync('netstat -ib 2>/dev/null || echo ""');
    if (!stdout) return { received: 0, sent: 0 };
    
    const lines = stdout.trim().split('\n');

    // Skip header line
    lines.slice(1).forEach(line => {
      const parts = line.split(/\s+/).filter(p => p.length > 0);
      // Column 0: interface name, Column 6: Ibytes, Column 9: Obytes
      if (parts.length >= 10 && parts[0] && !parts[0].match(/^lo\d*$/)) {
        const ibytes = parseInt(parts[6]) || 0;
        const obytes = parseInt(parts[9]) || 0;
        if (!isNaN(ibytes) && !isNaN(obytes)) {
          totalReceived += ibytes;
          totalSent += obytes;
        }
      }
    });

    if (lastNetworkStats === null) {
      lastNetworkStats = { received: totalReceived, sent: totalSent };
      return { received: 0, sent: 0 };
    }

    const diffReceived = totalReceived - lastNetworkStats.received;
    const diffSent = totalSent - lastNetworkStats.sent;

    lastNetworkStats = { received: totalReceived, sent: totalSent };

    return {
      received: Math.max(0, diffReceived),
      sent: Math.max(0, diffSent)
    };
  } catch {
    return { received: 0, sent: 0 };
  }
}

/**
 * Get network traffic statistics (sent/received in MB)
 * 
 * Platform-aware dispatcher for network traffic metrics.
 * Delegates to platform-specific implementation.
 * Excludes loopback interface.
 * First call returns {received: 0, sent: 0} to establish baseline.
 *
 * @returns {Promise<{received: number, sent: number}>} Network traffic rates in MB
 *   - received {number}: Megabytes received per interval (default: 0 on first call)
 *   - sent {number}: Megabytes sent per interval (default: 0 on first call)
 *
 * @example
 * const traffic = await getNetworkTraffic();
 * console.log(`Received: ${traffic.received} MB, Sent: ${traffic.sent} MB`);
 */
export async function getNetworkTraffic() {
  if (IS_MACOS) {
    return await getNetworkTrafficMacOS();
  }
  if (IS_LINUX) {
    return getNetworkTrafficLinux();
  }
  // Unsupported platform
  return { received: 0, sent: 0 };
}

/**
 * Collect and store metrics history
 *
 * Gathers current metrics and appends to metricsHistory.
 * Maintains rolling history with MAX_HISTORY (60 entries) limit.
 * Call regularly via setInterval() for continuous monitoring.
 *
 * @returns {Promise<void>}
 * @throws {Error} May catch and suppress errors from metric collection
 *
 * @example
 * setInterval(collectMetrics, 500); // Collect every 500ms
 */
export async function collectMetrics() {
  const timestamp = Date.now();
  const cpuLoad = await getCpuLoad();
  const memory = {
    total: os.totalmem(),
    used: os.totalmem() - os.freemem(),
    free: os.freemem()
  };
  const diskIO = await getDiskIO();
  const networkTraffic = await getNetworkTraffic(); // Now async

  metricsHistory.cpuLoad.push({ 
    timestamp, 
    oneMin: cpuLoad.oneMin,
    fiveMin: cpuLoad.fiveMin,
    fifteenMin: cpuLoad.fifteenMin
  });
  metricsHistory.memory.push({ timestamp, value: Math.round((memory.used / memory.total) * 100) });
  metricsHistory.diskIO.push({ timestamp, read: diskIO.read, write: diskIO.write });
  metricsHistory.networkTraffic.push({ timestamp, received: networkTraffic.received, sent: networkTraffic.sent });

  if (metricsHistory.cpuLoad.length > MAX_HISTORY) metricsHistory.cpuLoad.shift();
  if (metricsHistory.memory.length > MAX_HISTORY) metricsHistory.memory.shift();
  if (metricsHistory.diskIO.length > MAX_HISTORY) metricsHistory.diskIO.shift();
  if (metricsHistory.networkTraffic.length > MAX_HISTORY) metricsHistory.networkTraffic.shift();
}

/**
 * Format current metrics snapshot
 *
 * Retrieves current system metrics combined with historical data.
 * Used for API responses and WebSocket updates.
 *
 * @returns {Promise<Object>} Metrics snapshot object
 *   - cpuLoad {Object}
 *     - current {number}: Current CPU load average
 *     - history {Array}: Historical CPU load data
 *   - memory {Object}
 *     - current {number}: Current memory usage percentage
 *     - used {number}: Used memory in bytes
 *     - total {number}: Total memory in bytes
 *     - history {Array}: Historical memory data
 *   - diskIO {Object}
 *     - history {Array}: Historical disk IO data
 *   - networkTraffic {Object}
 *     - history {Array}: Historical network traffic data
 * @throws {Error} From getCpuLoad() if command execution fails
 *
 * @example
 * const snapshot = await getMetricsSnapshot();
 * console.log(snapshot.memory.current); // e.g., 45 (percentage)
 */
export async function getMetricsSnapshot() {
  const currentCpuLoad = await getCpuLoad();
  const memory = {
    total: os.totalmem(),
    used: os.totalmem() - os.freemem(),
    free: os.freemem()
  };
  const memoryPercent = Math.round((memory.used / memory.total) * 100);

  return {
    cpuLoad: {
      current: currentCpuLoad,
      history: metricsHistory.cpuLoad
    },
    memory: {
      current: memoryPercent,
      used: memory.used,
      total: memory.total,
      history: metricsHistory.memory
    },
    diskIO: {
      history: metricsHistory.diskIO
    },
    networkTraffic: {
      history: metricsHistory.networkTraffic
    }
  };
}
