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
router.post('/', requireAuth, async (req: any, res: any) => {
  console.log('[Update] Backend: Starting update process...');
  try {
    const adminDir = process.cwd();
    console.log('[Update] Backend: Checking git status in directory:', adminDir);
    const { stdout: gitStatus } = await execAsync('git status', { cwd: adminDir });

    if (!gitStatus) {
      console.error('[Update] Backend: Not a git repository');
      return res.status(400).json({ error: 'Not a git repository' });
    }

    console.log('[Update] Backend: Executing git pull...');
    await execAsync('git pull', { cwd: adminDir });
    console.log('[Update] Backend: Git pull completed successfully');

    res.json({ success: true, message: 'Update completed. The application will restart shortly.' });
    console.log('[Update] Backend: Response sent, scheduling restart in 1 second...');

    setTimeout(() => {
      console.log('[Update] Backend: Restarting application after git pull...');
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.error('[Update] Backend: Error updating application:', error);
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
router.get('/version', requireAuth, async (req: any, res: any) => {
  const REPO_API_URL = 'https://codeberg.org/api/v1/repos/phranck/previous-admin';
  const REPO_URL = 'https://codeberg.org/phranck/previous-admin';

  console.log('[Update] Backend: Checking for version updates...');
  try {
    // Read current version from package.json
    const packageJson = await import('../../package.json', { with: { type: 'json' } });
    const currentVersion = packageJson.default.version || '1.0.0';
    console.log('[Update] Backend: Current version:', currentVersion);

    // Fetch tags from Codeberg API
    console.log('[Update] Backend: Fetching tags from Codeberg API...');
    const tagsResponse = await fetch(`${REPO_API_URL}/tags`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Previous-Admin-Backend',
      },
    });

    if (!tagsResponse.ok) {
      console.log('[Update] Backend: Failed to fetch tags from Codeberg API');
      return res.json({
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        releaseUrl: null,
        releaseNotes: null,
        currentReleaseNotes: null,
      });
    }

    const tags = await tagsResponse.json();
    console.log('[Update] Backend: Retrieved', tags.length, 'tags from repository');

    if (!Array.isArray(tags) || tags.length === 0) {
      console.log('[Update] Backend: No tags found');
      return res.json({
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        releaseUrl: null,
        releaseNotes: null,
        currentReleaseNotes: null,
      });
    }

    const latestTag = tags[0];
    const latestVersion = latestTag.name.replace(/^v/, '');
    const updateAvailable = compareVersions(latestVersion, currentVersion) > 0;
    console.log('[Update] Backend: Latest version:', latestVersion, 'Update available:', updateAvailable);

    // Find current version tag
    const currentTag = tags.find((tag: any) => 
      tag.name === `v${currentVersion}` || tag.name === currentVersion
    );

    // Fetch release notes for latest version
    let releaseNotes: string | null = null;
    if (latestTag.commit?.sha) {
      try {
        console.log('[Update] Backend: Fetching release notes for latest version...');
        const commitResponse = await fetch(`${REPO_API_URL}/git/commits/${latestTag.commit.sha}`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Previous-Admin-Backend',
          },
        });
        if (commitResponse.ok) {
          const commitData = await commitResponse.json();
          releaseNotes = (commitData as any).message || null;
        }
      } catch (err) {
        console.error('[Update] Backend: Error fetching latest commit message:', err);
      }
    }

    // Fetch release notes for current version
    let currentReleaseNotes: string | null = null;
    if (currentTag?.commit?.sha) {
      try {
        console.log('[Update] Backend: Fetching release notes for current version...');
        const commitResponse = await fetch(`${REPO_API_URL}/git/commits/${currentTag.commit.sha}`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Previous-Admin-Backend',
          },
        });
        if (commitResponse.ok) {
          const commitData = await commitResponse.json();
          currentReleaseNotes = (commitData as any).message || null;
        }
      } catch (err) {
        console.error('[Update] Backend: Error fetching current commit message:', err);
      }
    }

    const result = {
      currentVersion,
      latestVersion,
      updateAvailable,
      releaseUrl: `${REPO_URL}/releases/tag/${latestTag.name}`,
      releaseNotes,
      currentReleaseNotes,
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
