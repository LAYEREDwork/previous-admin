import type { PreviousConfig } from './types';

/**
 * Default system configuration
 */
export const DEFAULT_CONFIG: PreviousConfig = {
  system: {
    cpu_type: '68040',
    cpu_frequency: 25,
    memory_size: 32,
    turbo: false,
    fpu: true,
  },
  display: {
    type: 'color',
    width: 1120,
    height: 832,
    color_depth: 24,
    frameskip: 0,
  },
  scsi: {
    hd0: '',
    hd1: '',
    hd2: '',
    hd3: '',
    hd4: '',
    hd5: '',
    hd6: '',
    cd: '',
  },
  network: {
    enabled: false,
    type: 'ethernet',
  },
  sound: {
    enabled: true,
    output: 'sdl',
  },
  boot: {
    rom_file: '',
    scsi_id: 0,
  },
  keyboard: {
    type: 'us',
  },
  mouse: {
    enabled: true,
  },
};

/**
 * API server configuration
 */
export const API_CONFIG = {
  PORT: process.env.PORT || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  MAX_PAYLOAD_SIZE: '10mb',
};

/**
 * Session configuration
 */
export const SESSION_CONFIG = {
  SECRET: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  NAME: 'sessionId',
  MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  MAX_AGE_MS: 24 * 60 * 60 * 1000, // 24 hours
  SECURE: process.env.NODE_ENV === 'production',
  HTTP_ONLY: true,
  SAME_SITE: 'lax' as const,
  SECRET_LENGTH_BYTES: 32,
};

/**
 * Password hashing configuration
 */
export const PASSWORD_CONFIG = {
  SALT_ROUNDS: 10,
  MIN_LENGTH: 6,
};

/**
 * Validation patterns
 */
export const VALIDATION_PATTERNS = {
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  INVALID_USERNAME: 'Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  USERNAME_EXISTS: 'Username already exists',
  EMAIL_EXISTS: 'Email already exists',
  INVALID_CREDENTIALS: 'Invalid username or password',
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Not found',
};
