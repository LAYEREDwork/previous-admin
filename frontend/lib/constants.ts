/**
 * Application name
 */
export const appName = 'Previous Admin';

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
 * In development, the Vite dev server proxies /api requests to the backend.
 * In production, the backend serves both frontend and API from the same origin.
 * 
 * @type {string}
 */
export const apiBaseUrl = typeof window !== 'undefined' ? '' : `http://localhost:${backendPort}`;

/**
 * WebSocket URL for real-time metrics
 *
 * Dynamically constructs WebSocket endpoint based on current hostname and protocol.
 * Uses secure WebSocket (wss:) when page is served over HTTPS.
 *
 * @type {string}
 */
export const wsUrl = `${typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:${backendPort}`;

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
