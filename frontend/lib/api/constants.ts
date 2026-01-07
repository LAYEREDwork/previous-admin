/**
 * Backend server port
 *
 * The port on which the backend Express server runs.
 * Used for HTTP API requests.
 *
 * @type {number}
 */
export const backendPort = 3001;

/**
 * Base URL for API requests
 *
 * Dynamically constructs API endpoint based on current hostname.
 * Backend server must be running on the configured backendPort.
 * Uses HTTP protocol (browser may upgrade to HTTPS automatically).
 *
 * @type {string}
 *
 * @example
 * // If accessing from 'example.com':
 * // apiBaseUrl = 'http://example.com:3001'
 *
 * // If accessing from 'localhost':
 * // apiBaseUrl = 'http://localhost:3001'
 */
export const apiBaseUrl = `http://${window.location.hostname}:${backendPort}`;