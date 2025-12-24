/**
 * API endpoint paths
 *
 * Centralized definition of all API endpoints to avoid magic strings
 * and reduce the risk of typos in route definitions and API calls.
 */
export enum ApiEndpoints {
  // Auth endpoints
  AUTH_SETUP_REQUIRED = '/api/auth/setup-required',
  AUTH_SETUP = '/api/auth/setup',
  AUTH_LOGIN = '/api/auth/login',
  AUTH_LOGOUT = '/api/auth/logout',
  AUTH_SESSION = '/api/auth/session',

  // Configuration endpoints
  CONFIGURATIONS = '/api/configurations',
  CONFIGURATIONS_ACTIVE = '/api/configurations/active',
  CONFIGURATIONS_ORDER_UPDATE = '/api/configurations/order/update',

  // Config endpoints
  CONFIG = '/api/config',

  // Database endpoints
  DATABASE_EXPORT = '/api/database/export',
  DATABASE_IMPORT = '/api/database/import',
  DATABASE_STATS = '/api/database/stats',
  DATABASE_SETUP_IMPORT = '/api/database/setup-import',

  // System endpoints
  SYSTEM_HEALTH = '/api/system/health',
  SYSTEM_SYSTEM_INFO = '/api/system/system-info',
  SYSTEM_METRICS = '/api/system/metrics',
  SYSTEM_RESET = '/api/system/reset',

  // Update endpoints
  UPDATE = '/api/update',
  UPDATE_VERSION = '/api/update/version',

  // Health endpoint
  HEALTH = '/api/health',
}

/**
 * Default configuration values
 * Used to avoid magic numbers and strings in default configurations
 */
export const DEFAULT_CONFIG_VALUES = {
  CPU_TYPE: '68040',
  CPU_FREQUENCY: 25,
  MEMORY_SIZE: 32,
  TURBO: false,
  FPU: true,
  DISPLAY_TYPE: 'color',
  DISPLAY_WIDTH: 1120,
  DISPLAY_HEIGHT: 832,
  COLOR_DEPTH: 24,
  FRAMESKIP: 0,
  NETWORK_ENABLED: false,
  NETWORK_TYPE: 'ethernet',
} as const;