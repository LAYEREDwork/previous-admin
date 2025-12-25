/**
 * Backend server port
 *
 * The port on which the backend Express server runs.
 * Used for both HTTP API requests and WebSocket connections.
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

/**
 * WebSocket URL for real-time metrics
 *
 * Dynamically constructs WebSocket endpoint based on current hostname and protocol.
 * Uses secure WebSocket (wss:) when page is served over HTTPS.
 *
 * @type {string}
 */
export const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:${backendPort}`;

/**
 * Available metrics update frequencies (in seconds)
 *
 * Provides user selectable options for real-time metrics polling.
 * Smaller values provide more frequent updates but use more bandwidth.
 *
 * @type {number[]}
 *
 * @example
 * metricsUpdateFrequencies // [0.5, 0.75, 1.0, 1.5, 2.0]
 */
export const metricsUpdateFrequencies = [0.25, 0.5, 1.0, 1.5, 1.75];

/**
 * Default metrics update frequency (in seconds)
 *
 * Used when user hasn't explicitly selected a frequency.
 * Updates metrics 2 times per second for responsive real-time data.
 *
 * @type {number}
 */
export const defaultMetricsUpdateFrequency = 0.5;