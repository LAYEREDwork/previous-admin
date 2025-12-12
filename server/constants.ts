/**
 * Central constants for the Previous Admin backend
 * All magic numbers and strings are defined here for better maintainability
 */

// Database Configuration
export const DATABASE_CONFIG = {
  FILENAME: 'previous-admin.db',
  TIMEOUT_MS: 5000,
  INTEGRITY_CHECK: true,
} as const;

// Session Configuration
export const SESSION_CONFIG = {
  MAX_AGE_MS: 24 * 60 * 60 * 1000, // 24 hours
  SECRET_LENGTH_BYTES: 32,
  COOKIE_NAME: 'sessionId',
} as const;

// Password Configuration
export const PASSWORD_CONFIG = {
  SALT_ROUNDS: 10,
  MIN_LENGTH: 6,
} as const;

// File Watching Configuration
export const FILE_WATCH_CONFIG = {
  STABILITY_THRESHOLD_MS: 500,
  POLL_INTERVAL_MS: 100,
  DEBOUNCE_DELAY_MS: 1000,
} as const;

// Metrics Configuration
export const METRICS_CONFIG = {
  MAX_HISTORY: 60,
  MIN_INTERVAL_MS: 100,
  DEFAULT_FREQUENCY: 0.2,
  DISK_BLOCK_SIZE: 512,
  UPDATE_INTERVAL_MS: 1000,
  MEMORY_SAMPLE_INTERVAL_MS: 500,
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_PAYLOAD_SIZE: '10mb',
  DEFAULT_PORT: 3001,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Path Configuration
export const PATH_CONFIG = {
  CONFIG_SUBPATH: '.previous-admin',
  CONFIG_FILENAME: 'previous-admin.json',
  LOG_SUBPATH: '.previous-admin/logs',
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  USERNAME: /^[a-zA-Z0-9_-]{3,32}$/,
  JSON_FILE: /\.json$/i,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username or password',
  USER_NOT_FOUND: 'User not found',
  CONFIG_NOT_FOUND: 'Configuration not found',
  DATABASE_ERROR: 'Database error',
  INVALID_JSON: 'Invalid JSON format',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  SESSION_EXPIRED: 'Session expired',
} as const;
