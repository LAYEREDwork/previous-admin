/**
 * Download data as JSON file to client
 *
 * Creates a JSON blob from provided data, triggers browser download.
 * Properly cleans up object URLs after download.
 *
 * @param {unknown} data - Any serializable data to download
 * @param {string} filename - Download filename (e.g., 'config.json')
 *
 * @returns {void}
 *
 * @side-effects
 *   - Creates temporary blob object URL
 *   - Adds/removes anchor element to DOM
 *   - Triggers browser download dialog
 *   - Revokes object URL after download
 *
 * @example
 * const config = { theme: 'dark' };
 * downloadFile(config, 'my-config.json');
 */
export function downloadFile(data: unknown, filename: string): void {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download file:', error);
    throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Sanitize string for safe filename usage
 *
 * Converts to lowercase, replaces spaces with hyphens,
 * removes non-alphanumeric characters (except hyphens).
 * Safe for use in filenames on all operating systems.
 *
 * @param {string} name - Original string (e.g., 'My Config File')
 *
 * @returns {string} Sanitized string (e.g., 'my-config-file')
 *
 * @example
 * sanitizeFilename('My Config!@#') // 'my-config'
 * sanitizeFilename('API Settings') // 'api-settings'
 */
export function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Generate standardized configuration filename
 *
 * Creates consistent filename format with optional timestamp.
 * Includes config name and JSON extension.
 *
 * @param {string} configName - Configuration name (e.g., 'Production Settings')
 * @param {boolean} [includeTimestamp=false] - Add timestamp for uniqueness
 *   - false: 'previous-config-production-settings.json'
 *   - true: 'previous-config-production-settings-1702345678000.json'
 *
 * @returns {string} Generated filename ready for download/export
 *
 * @example
 * generateConfigFilename('production', false) // 'previous-config-production.json'
 * generateConfigFilename('My Settings', true) // 'previous-config-my-settings-1702345678000.json'
 */
export function generateConfigFilename(
  configName: string,
  includeTimestamp = false
): string {
  const sanitized = sanitizeFilename(configName);
  const timestamp = includeTimestamp ? `-${Date.now()}` : '';
  return `previous-config-${sanitized}${timestamp}.json`;
}

interface DynamicUnitResult {
  unit: string;
  divisor: number;
}

export function getDynamicUnit(bytes: number): DynamicUnitResult {
  if (bytes === 0) return { unit: 'B/s', divisor: 1 };

  const absBytes = Math.abs(bytes);
  if (absBytes >= 1024 * 1024) {
    return { unit: 'MB/s', divisor: 1024 * 1024 };
  } else if (absBytes >= 1024) {
    return { unit: 'KB/s', divisor: 1024 };
  } else {
    return { unit: 'B/s', divisor: 1 };
  }
}

export function getOptimalUnit(data: Array<{ read?: number; write?: number; received?: number; sent?: number }>): DynamicUnitResult {
  if (data.length === 0) return { unit: 'MB/s', divisor: 1024 * 1024 };

  let maxValue = 0;
  data.forEach(item => {
    if (item.read !== undefined) maxValue = Math.max(maxValue, item.read);
    if (item.write !== undefined) maxValue = Math.max(maxValue, item.write);
    if (item.received !== undefined) maxValue = Math.max(maxValue, item.received);
    if (item.sent !== undefined) maxValue = Math.max(maxValue, item.sent);
  });

  return getDynamicUnit(maxValue);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatUptime(seconds: number, labels: { days: string; hours: string; minutes: string; seconds: string }): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}${labels.days}`);
  if (hours > 0) parts.push(`${hours}${labels.hours}`);
  if (minutes > 0) parts.push(`${minutes}${labels.minutes}`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}${labels.seconds}`);

  return parts.join(' ');
}
