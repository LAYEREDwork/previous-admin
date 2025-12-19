import { API_BASE_URL } from './constants';
import { ApiEndpoints } from '../../shared/constants';

export const REPO_URL = 'https://codeberg.org/phranck/previous-admin';

export interface VersionInfo {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  releaseUrl: string | null;
  releaseNotes: string | null;
  currentReleaseNotes: string | null;
}

/**
 * Get current version from backend API
 */
export async function getCurrentVersion(): Promise<string> {
  try {
    const info = await checkForUpdates();
    return info.currentVersion;
  } catch (error) {
    console.error('Error getting current version:', error);
    return '1.0.0';
  }
}

/**
 * Check for updates via backend API (avoids CORS issues)
 */
export async function checkForUpdates(): Promise<VersionInfo> {
  console.log('[Update] Checking for updates...');
  try {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.UPDATE_VERSION}`, {
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch version info');
    }

    const versionInfo = await response.json();
    console.log('[Update] Version info received:', versionInfo);
    return versionInfo;
  } catch (error) {
    console.error('[Update] Error checking for updates:', error);
    return {
      currentVersion: '1.0.0',
      latestVersion: null,
      updateAvailable: false,
      releaseUrl: null,
      releaseNotes: null,
      currentReleaseNotes: null,
    };
  }
}

export async function updateApplication(): Promise<void> {
  console.log('[Update] Starting application update...');
  try {
    const response = await fetch(`${API_BASE_URL}${ApiEndpoints.UPDATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Update failed');
    }

    const result = await response.json();
    console.log('[Update] Update response received:', result);
    console.log('[Update] Application will reload in 2 seconds...');

    setTimeout(() => {
      console.log('[Update] Reloading application...');
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error('[Update] Error updating application:', error);
    throw error;
  }
}
