/**
 * API endpoint paths - single source of truth
 * Contains both full URLs (for frontend) and relative paths (for backend routers)
 */
export const apiPaths = {
  Auth: {
    setupRequired: { full: '/api/auth/setup-required', relative: '/setup-required' },
    setup: { full: '/api/auth/setup', relative: '/setup' },
    login: { full: '/api/auth/login', relative: '/login' },
    logout: { full: '/api/auth/logout', relative: '/logout' },
    session: { full: '/api/auth/session', relative: '/session' },
  },
  Configuration: {
    list: { full: '/api/configurations', relative: '' },
    getById: { full: '/api/configurations/:id', relative: '/:id' },
    create: { full: '/api/configurations', relative: '' },
    update: { full: '/api/configurations/:id', relative: '/:id' },
    delete: { full: '/api/configurations/:id', relative: '/:id' },
    setActive: { full: '/api/configurations/:id/active', relative: '/:id/active' },
    getActive: { full: '/api/configurations/active', relative: '/active' },
    updateOrder: { full: '/api/configurations/order/update', relative: '/order/update' },
    activate: { full: '/api/configurations/:id/activate', relative: '/:id/activate' },
    deactivateAll: { full: '/api/configurations/deactivate-all', relative: '/deactivate-all' },
  },
  Config: {
    get: { full: '/api/config', relative: '' },
    put: { full: '/api/config', relative: '' },
  },
  Database: {
    export: { full: '/api/database/export', relative: '/export' },
    import: { full: '/api/database/import', relative: '/import' },
    stats: { full: '/api/database/stats', relative: '/stats' },
    setupImport: { full: '/api/database/setup-import', relative: '/setup-import' },
  },
  System: {
    health: { full: '/api/system/health', relative: '/health' },
    systemInfo: { full: '/api/system/system-info', relative: '/system-info' },
    metrics: { full: '/api/system/metrics', relative: '/metrics' },
    reset: { full: '/api/system/reset', relative: '/reset' },
  },
  Update: {
    update: { full: '/api/update', relative: '' },
    version: { full: '/api/update/version', relative: '/version' },
  },
  Health: {
    health: { full: '/api/health', relative: '/health' },
  },
} as const;

/**
 * Alias for backward compatibility
 */
export const ApiPaths = apiPaths;

/**
 * Type definitions for endpoint paths
 */
export type AuthEndpoint = typeof apiPaths.Auth[keyof typeof apiPaths.Auth]['relative'];
export type ConfigurationEndpoint = typeof apiPaths.Configuration[keyof typeof apiPaths.Configuration]['relative'];
export type ConfigEndpoint = typeof apiPaths.Config[keyof typeof apiPaths.Config]['relative'];
export type DatabaseEndpoint = typeof apiPaths.Database[keyof typeof apiPaths.Database]['relative'];
export type SystemEndpoint = typeof apiPaths.System[keyof typeof apiPaths.System]['relative'];
export type UpdateEndpoint = typeof apiPaths.Update[keyof typeof apiPaths.Update]['relative'];
export type HealthEndpoint = typeof apiPaths.Health[keyof typeof apiPaths.Health]['relative'];
