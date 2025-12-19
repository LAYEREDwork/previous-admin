/**
 * Application update API routes
 * Handles pulling latest changes from git and restarting application
 */

import express from 'express';
import { execAsync } from './helpers';
import { requireAuth } from '../middleware';

const router = express.Router();

/**
 * POST /api/update
 * Check for updates and inform user to update manually
 *
 * Instructs the user to perform updates manually for security reasons.
 * No automatic updates are performed via API.
 *
 * Requires authentication.
 *
 * @authentication {boolean} required
 *
 * @returns {Object}
 *   - success {boolean}: false (update not performed)
 *   - message {string}: Instruction to update manually
 *
 * @throws {500} If system error occurs
 *
 * @side-effects
 *   - None (no automatic update or restart)
 *
 * @example
 * const res = await fetch('/api/update', { method: 'POST' });
 * const { success, message } = await res.json();
 * // success will be false, message will instruct manual update
 */
router.post('/', requireAuth, async (req: any, res: any) => {
  console.log('[Update] Backend: Starting update check...');
  try {
    console.log('[Update] Backend: Update not implemented via API');
    res.json({ success: false, message: 'Update must be performed manually' });
  } catch (error) {
    console.error('[Update] Backend: Error checking for updates:', error);
    res.status(500).json({ error: (error as Error).message || 'Failed to check for updates' });
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
router.get('/version', requireAuth, async (req: any, res: any) => {
  const REPO_API_URL = 'https://codeberg.org/api/v1/repos/phranck/previous-admin';
  const REPO_URL = 'https://codeberg.org/phranck/previous-admin';

  console.log('[Update] Backend: Checking for version updates...');
  try {
    // Read current version from package.json
    const packageJson = await import('../../package.json', { with: { type: 'json' } });
    const currentVersion = packageJson.default.version || '1.0.0';
    console.log('[Update] Backend: Current version:', currentVersion);

    // Fetch releases from Codeberg API
    console.log('[Update] Backend: Fetching releases from Codeberg API...');
    const releasesResponse = await fetch(`${REPO_API_URL}/releases`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Previous-Admin-Backend',
      },
    });

    if (!releasesResponse.ok) {
      console.log('[Update] Backend: Failed to fetch releases from Codeberg API');
      return res.json({
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        releaseUrl: null,
        releaseNotes: null,
        currentReleaseNotes: null,
      });
    }

    const releases = await releasesResponse.json() as any[];
    console.log('[Update] Backend: Retrieved', releases.length, 'releases from repository');

    if (!Array.isArray(releases) || releases.length === 0) {
      console.log('[Update] Backend: No releases found');
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
    console.log('[Update] Backend: Latest version:', latestVersion, 'Update available:', updateAvailable);

    // Find current version release
    const currentRelease = releases.find((release: any) => 
      release.tag_name === `v${currentVersion}` || release.tag_name === currentVersion
    );

    const result = {
      currentVersion,
      latestVersion,
      updateAvailable,
      releaseUrl: latestRelease.html_url,
      releaseNotes: latestRelease.body || null,
      currentReleaseNotes: currentRelease?.body || null,
    };
    console.log('[Update] Backend: Version check completed:', result);
    res.json(result);
  } catch (error) {
    console.error('[Update] Backend: Error checking for updates:', error);
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
