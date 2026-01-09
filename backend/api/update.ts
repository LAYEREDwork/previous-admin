/**
 * Application update API routes
 * Handles pulling latest changes from git and restarting application
 */

import fs from 'fs';
import path from 'path';

import express from 'express';

import { apiPaths } from '@shared/api/constants';

import packageJson from '../../package.json';

import { execAsync } from './helpers';


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

    // Run update script asynchronously (fire-and-forget)
    // Do NOT await - the script runs in background while frontend polls for status
    execAsync(`bash ${scriptPath}`, { cwd: process.cwd() }).catch((error) => {
      console.error('Update script error:', error);
    });

    // Response sent immediately, update runs in background
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
        environment: process.env.NODE_ENV || 'development',
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
        environment: process.env.NODE_ENV || 'development',
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
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Error checking for updates:', error);
    res.status(500).json({
      error: 'Failed to check for updates',
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

/**
 * GET /api/update/status
 * Get current update status from status file
 *
 * @returns {Object}
 *   - status {string}: "idle" | "running" | "completed" | "error"
 *   - step {string}: Current update step
 *   - progress {number}: Progress percentage (0-100)
 *   - message {string}: Current status message
 *   - version {string}: Version being installed
 *   - error {string|null}: Error message if any
 */
router.get(apiPaths.Update.status.relative, async (req: any, res: any) => {
  try {
    const statusFile = path.join(process.env.HOME || '', '.previous-admin', 'update-status.json');

    if (!fs.existsSync(statusFile)) {
      return res.json({
        status: 'idle',
        step: '',
        progress: 0,
        message: '',
        version: '',
        error: null,
      });
    }

    const statusData = JSON.parse(fs.readFileSync(statusFile, 'utf8'));

    // Check if status is stale (older than 5 minutes)
    const now = Math.floor(Date.now() / 1000);
    if (statusData.timestamp && (now - statusData.timestamp) > 300) {
      // Status is stale, likely from a previous run
      return res.json({
        status: 'idle',
        step: '',
        progress: 0,
        message: '',
        version: '',
        error: null,
      });
    }

    res.json(statusData);
  } catch (error) {
    console.error('Error reading update status:', error);
    res.json({
      status: 'idle',
      step: '',
      progress: 0,
      message: '',
      version: '',
      error: null,
    });
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
