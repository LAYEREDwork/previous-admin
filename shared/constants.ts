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