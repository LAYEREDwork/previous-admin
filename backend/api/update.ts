/**
 * Application update API routes
 * Handles pulling latest changes from git and restarting application
 */

import express from 'express';
import { execAsync } from './helpers';
import { requireAuth } from '../middleware';
import { Endpoints } from '../../../shared/constants';
import packageJson from '../../package.json';
import { API_BASE_URL } from '../constants';

interface VersionInfo {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  releaseUrl: string | null;
  releaseNotes: string | null;
  currentReleaseNotes: string | null;
}

const router = express.Router();

/**
 * POST /api/update
 * Pull latest changes from git repository and restart application
 *
 * Performs git pull on the current repository and gracefully restarts
 * the application. The response is sent before restart begins.
 *
 * Requires authentication and a valid git repository.
 *
 * @authentication {boolean} required
 *
 * @returns {Object}
 *   - success {boolean}: true if update command succeeded
 *   - message {string}: Status message about restart
 *
 * @throws {400} If not a git repository (git status fails)
 * @throws {500} If git pull fails or system error occurs
 *
 * @side-effects
 *   - Pulls latest changes from git remote
 *   - Restarts the application process after 1 second delay
 *   - All active connections will be closed
 *
 * @example
 * const res = await fetch('/api/update', { method: 'POST' });
 * const { success, message } = await res.json();
 * // Application will restart automatically
 */
router.post(Endpoints.Update.update, requireAuth, async (req: any, res: any) => {
  try {
    const adminDir = process.cwd();

    // Get latest version info
    const versionResponse = await fetch(`${API_BASE_URL}${ApiEndpoints.update_VERSION}`, {
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!versionResponse.ok) {
      throw new Error('Failed to fetch version info');
    }

    const versionInfo = await versionResponse.json() as VersionInfo;
    const latestVersion = versionInfo.latestVersion;

    if (!latestVersion) {
      throw new Error('No latest version available');
    }

    const zipUrl = `https://codeberg.org/phranck/previous-admin/archive/${latestVersion}.zip`;
    const zipPath = `${adminDir}/update.zip`;
    const extractDir = `${adminDir}/update_temp`;

    // Download the ZIP
    await execAsync(`curl -L -o ${zipPath} ${zipUrl}`, { cwd: adminDir });

    // Create temp directory
    await execAsync(`mkdir -p ${extractDir}`, { cwd: adminDir });

    // Extract ZIP
    await execAsync(`unzip -o ${zipPath} -d ${extractDir}`, { cwd: adminDir });

    // Find the extracted directory (assuming it's named like previous-admin-1.0.0)
    const { stdout: lsOutput } = await execAsync(`ls -d ${extractDir}/*`, { cwd: adminDir });
    const sourceDir = lsOutput.trim().split('\n')[0];

    // Backup current directory (optional, but safe)
    await execAsync(`cp -r ${adminDir} ${adminDir}.backup`, { cwd: adminDir });

    // Copy new files (exclude certain directories like node_modules, .git)
    await execAsync(`rsync -av --exclude='node_modules' --exclude='.git' --exclude='update.zip' --exclude='update_temp' ${sourceDir}/ ${adminDir}/`, { cwd: adminDir });

    // Clean up
    await execAsync(`rm -rf ${zipPath} ${extractDir} ${adminDir}.backup`, { cwd: adminDir });

    res.json({ success: true, message: 'Update completed. The application will restart shortly.' });

    setTimeout(() => {
      console.log('Restarting application after update...');
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: (error as Error).message || 'Failed to update application' });
  }
});

/**
 * GET /api/update/version
 * Fetch version information from Codeberg API (proxy to avoid CORS)
 *
 * @authentication {boolean} required
 *
 * @returns {Object}
 *   - currentVersion {string}: Current installed version from package.json
 *   - latestVersion {string|null}: Latest version from Codeberg tags
 *   - updateAvailable {boolean}: Whether an update is available
 *   - releaseUrl {string|null}: URL to the release page
 *   - releaseNotes {string|null}: Release notes for latest version
 *   - currentReleaseNotes {string|null}: Release notes for current version
 */
router.get(Endpoints.Update.version, requireAuth, async (req: any, res: any) => {
  const REPO_API_URL = 'https://codeberg.org/api/v1/repos/phranck/previous-admin';

  try {
    // Read current version from package.json
    const currentVersion = packageJson.version || '1.0.0';

    // Fetch releases from Codeberg API
    const releasesResponse = await fetch(`${REPO_API_URL}/releases`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Previous-Admin-Backend',
      },
    });

    if (!releasesResponse.ok) {
      return res.json({
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        releaseUrl: null,
        releaseNotes: null,
        currentReleaseNotes: null,
      });
    }

    const releases = await releasesResponse.json();

    if (!Array.isArray(releases) || releases.length === 0) {
      return res.json({
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        releaseUrl: null,
        releaseNotes: null,
        currentReleaseNotes: null,
      });
    }

    const latestRelease = releases[0];
    const latestVersion = latestRelease.tag_name.replace(/^v/, '');
    const updateAvailable = compareVersions(latestVersion, currentVersion) > 0;

    // Find current version release
    const currentRelease = releases.find((release: any) => 
      release.tag_name === `v${currentVersion}` || release.tag_name === currentVersion
    );

    // Fetch release notes for latest version
    const releaseNotes: string | null = latestRelease.body || null;

    // Fetch release notes for current version
    const currentReleaseNotes: string | null = currentRelease?.body || null;

    res.json({
      currentVersion,
      latestVersion,
      updateAvailable,
      releaseUrl: latestRelease.html_url,
      releaseNotes,
      currentReleaseNotes,
    });
  } catch (error) {
    console.error('Error checking for updates:', error);
    res.status(500).json({ error: 'Failed to check for updates' });
  }
});

/**
 * Compare two semantic version strings
 * @returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
}

export default router;
