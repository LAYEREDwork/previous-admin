/**
 * API server configuration
 */
export const API_CONFIG = {
  PORT: process.env.PORT || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:2342',
  MAX_PAYLOAD_SIZE: '10mb',
};



/**
 * API base URL for internal requests
 */
export const API_BASE_URL = 'http://localhost:3001';
