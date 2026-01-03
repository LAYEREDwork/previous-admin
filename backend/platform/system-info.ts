/**
 * Unified system information gathering
 *
 * Uses platform-specific modules to gather system information
 * in a consistent format across all platforms.
 *
 * @module backend/platform/system-info
 */

import os from 'os';

import type { DiskInfo, NetworkInterface, MonitorResolution, CPUInfo, MemoryInfo, HostModel } from './types';

import { getPlatform } from './index';

/**
 * System information object
 */
export interface SystemInfo {
  os: string;
  hostname: string;
  kernel: string;
  uptime: number;
  cpu: CPUInfo;
  memory: MemoryInfo;
  platform: string;
  arch: string;
  gpu: string[];
  hostModel: HostModel;
  disks: DiskInfo[];
  ipAddresses: NetworkInterface[];
  monitorResolution?: MonitorResolution;
}

/**
 * Gather complete system information
 *
 * Collects system information from both Node.js APIs and platform-specific
 * commands. Returns all information in a consistent format regardless of platform.
 *
 * @returns {Promise<SystemInfo>} Complete system information
 *
 * @example
 * const info = await getSystemInfo();
 * console.log(`CPU: ${info.cpu.model}`);
 * console.log(`RAM: ${info.memory.total} bytes`);
 */
export async function getSystemInfo(): Promise<SystemInfo> {
  const platform = await getPlatform();

  const systemInfo: SystemInfo = {
    os: `${os.type()} ${os.release()}`,
    hostname: os.hostname(),
    kernel: os.release(),
    uptime: Math.floor(os.uptime()),
    cpu: {
      model: os.cpus()[0]?.model || 'Unknown',
      cores: os.cpus().length,
      speed: os.cpus()[0]?.speed || 0
    },
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem()
    },
    platform: os.platform(),
    arch: os.arch(),
    gpu: [],
    hostModel: { name: 'Unknown' },
    disks: [],
    ipAddresses: []
  };

  try {
    systemInfo.gpu = await platform.getGPUInfo();
  } catch (error) {
    console.error('Error getting GPU info:', error);
    systemInfo.gpu = ['N/A'];
  }

  try {
    systemInfo.hostModel = await platform.getHostModel();
  } catch (error) {
    console.error('Error getting host model:', error);
    systemInfo.hostModel = { name: 'Unknown' };
  }

  try {
    systemInfo.disks = await platform.getDiskInfo();
  } catch (error) {
    console.error('Error getting disk info:', error);
    systemInfo.disks = [];
  }

  try {
    systemInfo.ipAddresses = getNetworkInterfaces();
  } catch (error) {
    console.error('Error getting network info:', error);
    systemInfo.ipAddresses = [];
  }

  try {
    systemInfo.monitorResolution = await platform.getMonitorResolution();
  } catch (error) {
    console.error('Error getting monitor resolution:', error);
  }

  return systemInfo;
}

/**
 * Get network interface information
 *
 * @returns {NetworkInterface[]} Array of network interfaces with IPv4 addresses
 */
export function getNetworkInterfaces(): NetworkInterface[] {
  const networkInterfaces = os.networkInterfaces();
  const ips: NetworkInterface[] = [];

  for (const [name, interfaces] of Object.entries(networkInterfaces)) {
    if (interfaces) {
      for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
          ips.push({ interface: name, address: iface.address });
        }
      }
    }
  }

  return ips;
}
