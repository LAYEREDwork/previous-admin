/**
 * API endpoint paths
 *
 * Centralized definition of all API endpoints to avoid magic strings
 * and reduce the risk of typos in route definitions and API calls.
 */
export enum ApiEndpoints {
  // Auth endpoints
  authSetupRequired = '/api/auth/setup-required',
  authSetup = '/api/auth/setup',
  authLogin = '/api/auth/login',
  authLogout = '/api/auth/logout',
  authSession = '/api/auth/session',

  // Configuration endpoints
  configurations = '/api/configurations',
  configurationsActive = '/api/configurations/active',
  configurationsOrderUpdate = '/api/configurations/order/update',

  // Config endpoints
  config = '/api/config',

  // Database endpoints
  databaseExport = '/api/database/export',
  databaseImport = '/api/database/import',
  databaseStats = '/api/database/stats',
  databaseSetupImport = '/api/database/setup-import',

  // System endpoints
  systemHealth = '/api/system/health',
  systemSystemInfo = '/api/system/system-info',
  systemMetrics = '/api/system/metrics',
  systemReset = '/api/system/reset',

  // Update endpoints
  update = '/api/update',
  updateVersion = '/api/update/version',

  // Health endpoint
  health = '/api/health',
}

/**
 * Relative API endpoint paths for router definitions
 * These are the paths used in Express routers, without the base API prefix
 */
export const Endpoints = {
  Auth: {
    setupRequired: 'setup-required',
    setup: 'setup',
    login: 'login',
    logout: 'logout',
    session: 'session',
  },
  Configuration: {
    list: '',
    getById: '/:id',
    create: '',
    update: '/:id',
    delete: '/:id',
    setActive: '/:id/active',
    getActive: '/active',
    updateOrder: '/order/update',
    activate: '/:id/activate',
    deactivateAll: '/deactivate-all',
  },
  Config: {
    get: '',
    put: '',
  },
  Database: {
    export: '/export',
    import: '/import',
    stats: '/stats',
    setupImport: '/setup-import',
  },
  System: {
    health: '/health',
    systemInfo: '/system-info',
    metrics: '/metrics',
    reset: '/reset',
  },
  Update: {
    update: '',
    version: '/version',
  },
} as const;

/**
 * Type definitions for endpoint paths
 */
export type AuthEndpoint = typeof Endpoints.Auth[keyof typeof Endpoints.Auth];
export type ConfigurationEndpoint = typeof Endpoints.Configuration[keyof typeof Endpoints.Configuration];
export type ConfigEndpoint = typeof Endpoints.Config[keyof typeof Endpoints.Config];
export type DatabaseEndpoint = typeof Endpoints.Database[keyof typeof Endpoints.Database];
export type SystemEndpoint = typeof Endpoints.System[keyof typeof Endpoints.System];
export type UpdateEndpoint = typeof Endpoints.Update[keyof typeof Endpoints.Update];

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