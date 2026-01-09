import { apiPaths } from '@shared/api/constants';

import { apiBaseUrl } from './constants';

export const REPO_URL = 'https://codeberg.org/phranck/previous-admin';

export interface VersionInfo {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  releaseUrl: string | null;
  releaseNotes: string | null;
  currentReleaseNotes: string | null;
  environment: string;
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
  try {
    const response = await fetch(`${apiBaseUrl}${apiPaths.Update.version.full}`, {
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch version info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking for updates:', error);
    return {
      currentVersion: '1.0.0',
      latestVersion: null,
      updateAvailable: false,
      releaseUrl: null,
      releaseNotes: null,
      currentReleaseNotes: null,
      environment: 'development',
    };
  }
}

export async function updateApplication(): Promise<void> {
  try {
    const response = await fetch(`${apiBaseUrl}${apiPaths.Update.update.full}`, {
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

    await response.json();

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
}
