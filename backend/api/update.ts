/**
 * Application update API routes
 * Handles pulling latest changes from git and restarting application
 */

import fs from 'fs';
import path from 'path';

import express from 'express';

import { apiPaths } from '@shared/api/constants';

const router = express.Router();

/**
 * POST /api/update
 * Trigger update process via shell script
 *
 * Runs the update script to download and install the latest version from GitHub.
 * The response is sent immediately, update runs asynchronously.
 *
 * @returns {Object}
 *   - success {boolean}: true if update script started successfully
 *   - message {string}: Status message
 *
 * @throws {500} If update script fails to start
 *
 * @side-effects
 *   - Downloads and installs latest version
 *   - Restarts services
 *
 * @example
 * const res = await fetch('/api/update', { method: 'POST' });
 * const { success, message } = await res.json();
 */
router.post(apiPaths.Update.update.relative, async (req: any, res: any) => {
  try {
    const scriptPath = `${process.cwd()}/scripts/update.sh`;

    // Run update script with sudo
    await execAsync(`sudo bash ${scriptPath}`, { cwd: process.cwd() });

    res.json({ success: true, message: 'Update started successfully.' });
  } catch (error) {
    console.error('Error starting update:', error);
    res.status(500).json({ error: (error as Error).message || 'Failed to start update' });
  }
});

/**
 * GET /api/update/version
 * Fetch version information from Codeberg API (proxy to avoid CORS)
 *
 * @returns {Object}
 *   - currentVersion {string}: Current installed version from package.json
 *   - latestVersion {string|null}: Latest version from Codeberg tags
 *   - updateAvailable {boolean}: Whether an update is available
 *   - releaseUrl {string|null}: URL to the release page
 *   - releaseNotes {string|null}: Release notes for latest version
 *   - currentReleaseNotes {string|null}: Release notes for current version
 */
router.get(apiPaths.Update.version.relative, async (req: any, res: any) => {
  const REPO_API_URL = 'https://api.github.com/repos/LAYEREDwork/previous-admin';

  try {
    // Get current version from version.json
    let currentVersion = '1.0.0'; // fallback
    try {
      const versionFile = path.join(process.env.HOME || '', '.previous-admin', 'version.json');
      const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
      currentVersion = versionData.version || packageJson.version || '1.0.0';
    } catch {
      // If file doesn't exist, use package.json as fallback
      currentVersion = packageJson.version || '1.0.0';
    }
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

    const releases = (await releasesResponse.json()) as Array<any>;

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
