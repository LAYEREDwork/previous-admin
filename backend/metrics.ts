/**
 * Metrics collection and system performance utilities
 * Handles CPU load, memory, disk IO, and network traffic monitoring
 * 
 * Platform-aware metrics collection with support for:
 * - Linux: /proc filesystem-based metrics
 * - macOS: BSD-style system commands (iostat, netstat, vm_stat)
 */

import { exec } from 'child_process';

import * as os from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Simple sleep helper used for short waits in serialization loops.
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  heuristic?: boolean;
}

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

const MAX_HISTORY = 60;

// New: background network sampler state
let networkSamplerRunning = false;
let networkPrevTotals: { received: number; sent: number; ts: number } | null = null;
let networkCurrentRaw: { received: number; sent: number; timestamp: number } | null = null;
let networkCurrentSmoothed: { received: number; sent: number; timestamp: number } | null = null;
const NETWORK_SAMPLER_INTERVAL_MS = 1000; // 1s sampler
const NETWORK_EMA_ALPHA = 0.4; // smoothing for server-side EMA

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
 * Lightweight disk IO accessor used as a safe fallback.
 * Returns the last cached disk IO result when available.
 */
export async function getDiskIO() {
  try {
    return (collectMetrics as any)._lastDiskIOResult || { read: 0, write: 0 };
  } catch {
    return { read: 0, write: 0 };
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
async function getNetworkTrafficLinux() {
  // Lightweight wrapper: prefer background sampler values when available
  try {
    if (networkCurrentRaw) return { received: networkCurrentRaw.received, sent: networkCurrentRaw.sent };
    // fallback to instant sample if sampler not ready
    const instant = await computeInstantNetworkRate(300);
    return { received: instant.received, sent: instant.sent };
  } catch {
    return { received: 0, sent: 0 };
  }
}

/**
 * Start a background sampler that reads interface counters every second,
 * computes bytes/sec deltas and updates `networkCurrentRaw` and `networkCurrentSmoothed`.
 * This decouples expensive reads from `collectMetrics()` and makes `getNetworkTraffic()` fast.
 */
async function startNetworkSampler() {
  if (networkSamplerRunning) return;
  networkSamplerRunning = true;

  const readTotalsLinux = async () => {
    try {
      const { stdout } = await execAsync('cat /proc/net/dev 2>/dev/null || echo ""');
      const lines = (stdout || '').trim().split('\n').filter(Boolean);
      const ifaceMap: Record<string, { received: number; sent: number }> = {};
      lines.forEach(line => {
        const match = line.match(/^\s*(\w+):\s+([\d\s]+)/);
        if (match) {
          const iface = match[1];
          if (iface.match(/^lo$/)) return;
          const parts = match[2].split(/\s+/).filter(p => p.length > 0);
          const ibytes = parseInt(parts[0]) || 0;
          const obytes = parseInt(parts[8]) || 0;
          ifaceMap[iface] = { received: ibytes, sent: obytes };
        }
      });
      return ifaceMap;
    } catch {
      return {} as Record<string, { received: number; sent: number }>;
    }
  };

  const readTotalsMac = async () => {
    try {
      const { stdout } = await execAsync('netstat -ib 2>/dev/null || echo ""');
      const lines = (stdout || '').trim().split('\n');
      const ifaceMap: Record<string, { received: number; sent: number }> = {};
      lines.slice(1).forEach(line => {
        const parts = line.split(/\s+/).filter(p => p.length > 0);
        if (parts.length >= 10 && parts[0] && !parts[0].match(/^lo\d*$/)) {
          const iface = parts[0];
          const ibytes = parseInt(parts[6]) || 0;
          const obytes = parseInt(parts[9]) || 0;
          ifaceMap[iface] = { received: ibytes, sent: obytes };
        }
      });
      return ifaceMap;
    } catch {
      return {} as Record<string, { received: number; sent: number }>;
    }
  };

  while (networkSamplerRunning) {
    try {
      const samplerTs = Date.now();
      let ifaceMap: Record<string, { received: number; sent: number }> = {};
      if (IS_LINUX) ifaceMap = await readTotalsLinux();
      else if (IS_MACOS) ifaceMap = await readTotalsMac();

      // prefer default interface when available
      let totalReceived = 0;
      let totalSent = 0;
      try {
        const platform = await (await import('./platform')).getPlatform();
        const defaultIface = platform.getDefaultNetworkInterface ? await platform.getDefaultNetworkInterface() : null;
        if (defaultIface && ifaceMap[defaultIface]) {
          totalReceived = ifaceMap[defaultIface].received;
          totalSent = ifaceMap[defaultIface].sent;
        } else {
          Object.values(ifaceMap).forEach(v => { totalReceived += v.received; totalSent += v.sent });
        }
      } catch {
        Object.values(ifaceMap).forEach(v => { totalReceived += v.received; totalSent += v.sent });
      }

      if (networkPrevTotals === null) {
        networkPrevTotals = { received: totalReceived, sent: totalSent, ts: samplerTs };
        // initialize raw and smoothed with zeros until next sample
        networkCurrentRaw = { received: 0, sent: 0, timestamp: samplerTs };
        networkCurrentSmoothed = { received: 0, sent: 0, timestamp: samplerTs };
      } else {
        const elapsedSec = Math.max(0.001, (samplerTs - networkPrevTotals.ts) / 1000);
        const diffReceived = Math.max(0, Math.round((totalReceived - networkPrevTotals.received) / elapsedSec));
        const diffSent = Math.max(0, Math.round((totalSent - networkPrevTotals.sent) / elapsedSec));

        // update raw and EMA-smoothed values
        networkCurrentRaw = { received: diffReceived, sent: diffSent, timestamp: samplerTs };
        const prevSm = networkCurrentSmoothed || { received: diffReceived, sent: diffSent, timestamp: samplerTs };
        const emaReceived = Math.round((NETWORK_EMA_ALPHA * diffReceived) + ((1 - NETWORK_EMA_ALPHA) * (prevSm.received || 0)));
        const emaSent = Math.round((NETWORK_EMA_ALPHA * diffSent) + ((1 - NETWORK_EMA_ALPHA) * (prevSm.sent || 0)));
        networkCurrentSmoothed = { received: emaReceived, sent: emaSent, timestamp: samplerTs };

        // keep a simple lastNetworkStats for compatibility (avoid other code breakage)
        lastNetworkStats = { received: totalReceived, sent: totalSent, timestamp: samplerTs };

        networkPrevTotals = { received: totalReceived, sent: totalSent, ts: samplerTs };
      }
    } catch (err) {
      // ignore sampler errors; next tick will retry
      try { console.warn('Network sampler error:', err); } catch {
        // ignore console errors
      }
    }

    await sleep(NETWORK_SAMPLER_INTERVAL_MS);
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
  // Lightweight wrapper: prefer background sampler values when available
  try {
    if (networkCurrentRaw) return { received: networkCurrentRaw.received, sent: networkCurrentRaw.sent };
    // fallback to instant sample if sampler not ready
    const instant = await computeInstantNetworkRate(300);
    return { received: instant.received, sent: instant.sent };
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
export async function getNetworkTraffic(updateBaseline: boolean = true) {
  // Prefer fast background-sampled values when available
  if (networkCurrentRaw) {
    return { received: networkCurrentRaw.received, sent: networkCurrentRaw.sent };
  }

  // Fallback to platform-specific immediate reader (retains compatibility)
  if (IS_MACOS) return await getNetworkTrafficMacOS(updateBaseline);
  if (IS_LINUX) return await getNetworkTrafficLinux(updateBaseline);
  return { received: 0, sent: 0 };
}

/**
 * Compute an instantaneous network rate by reading raw interface counters twice.
 * This bypasses the shared `lastNetworkStats` logic and is useful for startup seeding.
 * Returns bytes/sec for received and sent.
 */
export async function computeInstantNetworkRate(sampleMs: number = 400): Promise<{ received: number; sent: number }> {
  try {
    if (IS_LINUX) {
      const readTotals = async () => {
        const { stdout } = await execAsync('cat /proc/net/dev 2>/dev/null || echo ""');
        const lines = (stdout || '').trim().split('\n').filter(Boolean);
        const ifaceMap: Record<string, { received: number; sent: number }> = {};
        lines.forEach(line => {
          const match = line.match(/^\s*(\w+):\s+([\d\s]+)/);
          if (match) {
            const iface = match[1];
            if (iface.match(/^lo$/)) return;
            const parts = match[2].split(/\s+/).filter(p => p.length > 0);
            const ibytes = parseInt(parts[0]) || 0;
            const obytes = parseInt(parts[8]) || 0;
            ifaceMap[iface] = { received: ibytes, sent: obytes };
          }
        });
        return ifaceMap;
      };

      const first = await readTotals();
      await new Promise((r) => setTimeout(r, sampleMs));
      const second = await readTotals();

      // Prefer default interface when available
      try {
        const platform = await (await import('./platform')).getPlatform();
        const defaultIface = platform.getDefaultNetworkInterface ? await platform.getDefaultNetworkInterface() : null;
        let totalFirst = { received: 0, sent: 0 };
        let totalSecond = { received: 0, sent: 0 };
        if (defaultIface && first[defaultIface] && second[defaultIface]) {
          totalFirst = first[defaultIface];
          totalSecond = second[defaultIface];
        } else {
          Object.values(first).forEach(v => { totalFirst.received += v.received; totalFirst.sent += v.sent; });
          Object.values(second).forEach(v => { totalSecond.received += v.received; totalSecond.sent += v.sent; });
        }
        const elapsedSec = Math.max(0.001, sampleMs / 1000);
        const diffReceived = Math.max(0, Math.round((totalSecond.received - totalFirst.received) / elapsedSec));
        const diffSent = Math.max(0, Math.round((totalSecond.sent - totalFirst.sent) / elapsedSec));
        return { received: diffReceived, sent: diffSent };
      } catch {
        return { received: 0, sent: 0 };
      }
    }

    if (IS_MACOS) {
      const readTotalsMac = async () => {
        const { stdout } = await execAsync('netstat -ib 2>/dev/null || echo ""');
        const lines = (stdout || '').trim().split('\n');
        const ifaceMap: Record<string, { received: number; sent: number }> = {};
        lines.slice(1).forEach(line => {
          const parts = line.split(/\s+/).filter(p => p.length > 0);
          if (parts.length >= 10 && parts[0] && !parts[0].match(/^lo\d*$/)) {
            const iface = parts[0];
            const ibytes = parseInt(parts[6]) || 0;
            const obytes = parseInt(parts[9]) || 0;
            ifaceMap[iface] = { received: ibytes, sent: obytes };
          }
        });
        return ifaceMap;
      };

      const first = await readTotalsMac();
      await new Promise((r) => setTimeout(r, sampleMs));
      const second = await readTotalsMac();

      try {
        const platform = await (await import('./platform')).getPlatform();
        const defaultIface = platform.getDefaultNetworkInterface ? await platform.getDefaultNetworkInterface() : null;
        let totalFirst = { received: 0, sent: 0 };
        let totalSecond = { received: 0, sent: 0 };
        if (defaultIface && first[defaultIface] && second[defaultIface]) {
          totalFirst = first[defaultIface];
          totalSecond = second[defaultIface];
        } else {
          Object.values(first).forEach(v => { totalFirst.received += v.received; totalFirst.sent += v.sent; });
          Object.values(second).forEach(v => { totalSecond.received += v.received; totalSecond.sent += v.sent; });
        }
        const elapsedSec = Math.max(0.001, sampleMs / 1000);
        const diffReceived = Math.max(0, Math.round((totalSecond.received - totalFirst.received) / elapsedSec));
        const diffSent = Math.max(0, Math.round((totalSecond.sent - totalFirst.sent) / elapsedSec));
        return { received: diffReceived, sent: diffSent };
      } catch {
        return { received: 0, sent: 0 };
      }
    }

    return { received: 0, sent: 0 };
  } catch {
    return { received: 0, sent: 0 };
  }
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

  // Disk IO sampling policy
  const DISK_SAMPLE_MS = 5000; // sample disk IO every 5 seconds
  if (!(collectMetrics as any)._lastDiskSampleMs) (collectMetrics as any)._lastDiskSampleMs = 0;
  if (!(collectMetrics as any)._lastDiskIOResult) (collectMetrics as any)._lastDiskIOResult = { read: 0, write: 0 };

  const now = Date.now();
  const shouldSampleDisk = now - (collectMetrics as any)._lastDiskSampleMs >= DISK_SAMPLE_MS;

  // Prepare immediate lightweight snapshot from cached/cheap values
  const lastCpu = metricsHistory.cpuLoad.length > 0 ? metricsHistory.cpuLoad[metricsHistory.cpuLoad.length - 1] : null;
  const quickCpu = lastCpu ? { oneMin: lastCpu.oneMin, fiveMin: lastCpu.fiveMin, fifteenMin: lastCpu.fifteenMin } : { oneMin: os.loadavg()[0], fiveMin: os.loadavg()[1], fifteenMin: os.loadavg()[2] };

  const memoryTotal = os.totalmem();
  const memoryUsed = os.totalmem() - os.freemem();
  const quickMemoryPercent = Math.round((memoryUsed / memoryTotal) * 100);

  const quickDisk = (collectMetrics as any)._lastDiskIOResult || { read: 0, write: 0 };

  const quickNetwork = networkCurrentRaw
    ? { timestamp: Date.now(), received: networkCurrentRaw.received, sent: networkCurrentRaw.sent }
    : (metricsHistory.networkTraffic.length > 0 ? metricsHistory.networkTraffic[metricsHistory.networkTraffic.length - 1] : { timestamp: Date.now(), received: 0, sent: 0 });

  // Push lightweight entries immediately so API returns fresh data without waiting
  metricsHistory.cpuLoad.push({ timestamp, oneMin: quickCpu.oneMin, fiveMin: quickCpu.fiveMin, fifteenMin: quickCpu.fifteenMin });
  metricsHistory.memory.push({ timestamp, value: quickMemoryPercent });
  metricsHistory.diskIO.push({ timestamp, read: quickDisk.read, write: quickDisk.write });
  // Use sampled network quick value when available (no heuristic placeholders)
  metricsHistory.networkTraffic.push({ timestamp, received: quickNetwork.received, sent: quickNetwork.sent });

  if (metricsHistory.cpuLoad.length > MAX_HISTORY) metricsHistory.cpuLoad.shift();
  if (metricsHistory.memory.length > MAX_HISTORY) metricsHistory.memory.shift();
  if (metricsHistory.diskIO.length > MAX_HISTORY) metricsHistory.diskIO.shift();
  if (metricsHistory.networkTraffic.length > MAX_HISTORY) metricsHistory.networkTraffic.shift();

  // Start actual measurements in parallel and update the last entries when ready
  const cpuPromise = getCpuLoad();
  // Use fast non-blocking sampled values from background sampler when available
  const networkPromise = getNetworkTraffic(false).catch(() => ({ received: 0, sent: 0 }));
  const diskPromise = shouldSampleDisk ? getDiskIO() : Promise.resolve((collectMetrics as any)._lastDiskIOResult);

  Promise.all([cpuPromise, diskPromise, networkPromise])
    .then(async ([cpuLoad, diskIO, networkTraffic]) => {
      try {
        const updateTimestamp = Date.now();

        // update cached disk sampling
        if (shouldSampleDisk) {
          (collectMetrics as any)._lastDiskSampleMs = updateTimestamp;
          (collectMetrics as any)._lastDiskIOResult = diskIO;
        }

        // Append measured values as new entries (do not overwrite the quick preview)
        metricsHistory.cpuLoad.push({
          timestamp: updateTimestamp,
          oneMin: cpuLoad.oneMin,
          fiveMin: cpuLoad.fiveMin,
          fifteenMin: cpuLoad.fifteenMin
        });

        const memoryPercent = Math.round((os.totalmem() - os.freemem()) / os.totalmem() * 100);
        metricsHistory.memory.push({ timestamp: updateTimestamp, value: memoryPercent });

        metricsHistory.diskIO.push({ timestamp: updateTimestamp, read: diskIO.read, write: diskIO.write });

        // If networkTraffic is zero but we only have heuristic placeholders, try an instant sampler
        let finalNetworkTraffic = networkTraffic;
        const hasHeuristicOnly = metricsHistory.networkTraffic.some((entry) => entry.heuristic);
        if ((finalNetworkTraffic.received === 0 && finalNetworkTraffic.sent === 0) && hasHeuristicOnly) {
          // detected heuristic-only entries and zero network measurement; attempting instant sampler
          try {
            const instantSample = await computeInstantNetworkRate(300);
            // instant sampler result logged for debug during development
            if (instantSample && (instantSample.received > 0 || instantSample.sent > 0)) {
              finalNetworkTraffic = { received: instantSample.received, sent: instantSample.sent };
              // instant sampler produced non-zero network rate, using it to replace heuristic
            } else {
              // instant sampler returned zero, keeping heuristic for now
            }
          } catch (err) {
            console.warn('⚠️ collectMetrics: instant sampler failed:', err);
          }
        } else {
          // network measurement present or no heuristics
        }

        // If this is a real measurement (non-zero), remove any heuristic placeholders
        if ((finalNetworkTraffic.received && finalNetworkTraffic.received > 0) || (finalNetworkTraffic.sent && finalNetworkTraffic.sent > 0)) {
          metricsHistory.networkTraffic = metricsHistory.networkTraffic.filter((entry) => !entry.heuristic);
        }

        metricsHistory.networkTraffic.push({ timestamp: updateTimestamp, received: finalNetworkTraffic.received, sent: finalNetworkTraffic.sent });

        // Trim histories to MAX_HISTORY
        if (metricsHistory.cpuLoad.length > MAX_HISTORY) metricsHistory.cpuLoad.shift();
        if (metricsHistory.memory.length > MAX_HISTORY) metricsHistory.memory.shift();
        if (metricsHistory.diskIO.length > MAX_HISTORY) metricsHistory.diskIO.shift();
        if (metricsHistory.networkTraffic.length > MAX_HISTORY) metricsHistory.networkTraffic.shift();
      } catch (err) {
        console.error('Error updating metricsHistory after async collection:', err);
      }
    })
    .catch(err => {
      console.error('Background metrics collection failed:', err);
    });
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
  // Lightweight snapshot: return the most recent values from metricsHistory
  // This avoids running expensive system calls on-demand and keeps API responses fast.

  const lastCpu = metricsHistory.cpuLoad.length > 0
    ? metricsHistory.cpuLoad[metricsHistory.cpuLoad.length - 1]
    : { timestamp: Date.now(), oneMin: os.loadavg()[0], fiveMin: os.loadavg()[1], fifteenMin: os.loadavg()[2] };

  const memoryTotal = os.totalmem();
  const memoryUsed = os.totalmem() - os.freemem();
  const memoryPercent = Math.round((memoryUsed / memoryTotal) * 100);

  const lastDisk = metricsHistory.diskIO.length > 0
    ? metricsHistory.diskIO[metricsHistory.diskIO.length - 1]
    : { timestamp: Date.now(), read: 0, write: 0 };

  const lastNetwork = metricsHistory.networkTraffic.length > 0
    ? metricsHistory.networkTraffic[metricsHistory.networkTraffic.length - 1]
    : { timestamp: Date.now(), received: 0, sent: 0 };

  return {
    cpuLoad: {
      current: {
        oneMin: lastCpu.oneMin,
        fiveMin: lastCpu.fiveMin,
        fifteenMin: lastCpu.fifteenMin
      },
      history: metricsHistory.cpuLoad
    },
    memory: {
      current: memoryPercent,
      used: memoryUsed,
      total: memoryTotal,
      history: metricsHistory.memory
    },
    diskIO: {
      current: lastDisk,
      history: metricsHistory.diskIO
    },
    networkTraffic: {
      current: lastNetwork,
      history: metricsHistory.networkTraffic
    }
  };
}

// Start the background network sampler (non-blocking)
try {
  startNetworkSampler();
} catch {
  // ignore
}
