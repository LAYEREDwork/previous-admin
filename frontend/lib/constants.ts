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
export const apiBaseUrl = ((): string => {
	// Server-side (Node) - used in SSR/build-time tooling
	if (typeof window === 'undefined') return `http://localhost:${backendPort}`;

	// Browser/runtime: allow runtime override via global or localStorage so
	// preview servers (vite preview) or screenshot scripts can direct API
	// requests to the backend running on a different port.
	// Priority: global `window.__PA_API_BASE__` -> localStorage `apiBaseUrl` -> '' (same origin)
	try {
		const globalOverride = (window as any).__PA_API_BASE__ as string | undefined;
		if (globalOverride) return globalOverride;
		const stored = localStorage.getItem('apiBaseUrl');
		if (stored) return stored;
	} catch {
		// ignore localStorage access errors
	}

	return '';
})();
