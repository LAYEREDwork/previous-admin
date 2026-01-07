/**
 * Application name
 */
export const appName = 'Previous Admin';

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
 * In development, the Vite dev server proxies /api requests to the backend.
 * In production, the backend serves both frontend and API from the same origin.
 * 
 * @type {string}
 */
export const apiBaseUrl = typeof window !== 'undefined' ? '' : `http://localhost:${backendPort}`;
