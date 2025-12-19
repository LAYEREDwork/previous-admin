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
  const REPO_API_URL = 'https://codeberg.org/api/v1/repos/phranck/previous-admin';
  const REPO_URL = 'https://codeberg.org/phranck/previous-admin';

  console.log('[Update] Backend: Starting API-based update process...');
  try {
    const adminDir = process.cwd();

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
      throw new Error('Failed to fetch tags from Codeberg API');
    }

    const tags = await tagsResponse.json();
    if (!Array.isArray(tags) || tags.length === 0) {
      throw new Error('No tags found in repository');
    }

    const latestTag = tags[0];
    const latestVersion = latestTag.name.replace(/^v/, '');
    console.log('[Update] Backend: Latest version:', latestVersion);

    if (compareVersions(latestVersion, currentVersion) <= 0) {
      return res.json({ success: true, message: 'Application is already up to date.' });
    }

    // Fetch releases to get download URL
    console.log('[Update] Backend: Fetching releases from Codeberg API...');
    const releasesResponse = await fetch(`${REPO_API_URL}/releases`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Previous-Admin-Backend',
      },
    });

    if (!releasesResponse.ok) {
      throw new Error('Failed to fetch releases from Codeberg API');
    }

    const releases = await releasesResponse.json() as any[];
    console.log('[Update] Backend: Found', releases.length, 'releases');
    console.log('[Update] Backend: Looking for tag:', latestTag.name);
    
    const latestRelease = releases.find((release: any) => release.tag_name === latestTag.name);
    console.log('[Update] Backend: Found latest release:', !!latestRelease);
    
    if (latestRelease) {
      console.log('[Update] Backend: Release assets:', latestRelease.assets?.length || 0);
      console.log('[Update] Backend: Release draft:', latestRelease.draft);
      console.log('[Update] Backend: Release prerelease:', latestRelease.prerelease);
    }

    if (!latestRelease || !latestRelease.assets || latestRelease.assets.length === 0) {
      console.log('[Update] Backend: No assets found, trying direct archive download...');
      
      // Fallback: Try direct archive download
      const archiveUrl = `${REPO_URL}/archive/${latestTag.name}.zip`;
      console.log('[Update] Backend: Trying archive URL:', archiveUrl);
      
      const archiveResponse = await fetch(archiveUrl);
      if (!archiveResponse.ok) {
        throw new Error('No assets found for latest release and archive download failed');
      }
      
      // Create temp directory
      const tempDir = path.join(adminDir, 'temp_update');
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
      fs.mkdirSync(tempDir, { recursive: true });

      // Create backup
      const backupDir = path.join(adminDir, 'backup_pre_update');
      if (fs.existsSync(backupDir)) {
        fs.rmSync(backupDir, { recursive: true, force: true });
      }
      console.log('[Update] Backend: Creating backup...');
      await execAsync(`cp -r . "${backupDir}"`, { cwd: adminDir });
      console.log('[Update] Backend: Backup created successfully');

      // Download archive
      console.log('[Update] Backend: Downloading archive...');
      const buffer = await archiveResponse.arrayBuffer();
      const zipPath = path.join(tempDir, 'update.zip');
      fs.writeFileSync(zipPath, Buffer.from(buffer));
      console.log('[Update] Backend: Archive downloaded successfully');

      // Extract ZIP file
      console.log('[Update] Backend: Extracting ZIP file...');
      const AdmZip = (await import('adm-zip')).default;
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(tempDir, true);
      console.log('[Update] Backend: ZIP file extracted successfully');

      // Find extracted directory
      const extractedDirs = fs.readdirSync(tempDir).filter(file =>
        fs.statSync(path.join(tempDir, file)).isDirectory() &&
        file !== '__MACOSX'
      );

      if (extractedDirs.length === 0) {
        throw new Error('No directory found in extracted archive');
      }

      const sourceDir = path.join(tempDir, extractedDirs[0]);
      console.log('[Update] Backend: Source directory:', sourceDir);

      // Copy files (excluding certain directories)
      const excludeDirs = ['node_modules', '.git', 'backup_pre_update', 'temp_update', 'dist'];
      const files = fs.readdirSync(sourceDir);

      for (const file of files) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(adminDir, file);

        if (excludeDirs.includes(file)) {
          console.log(`[Update] Backend: Skipping excluded directory: ${file}`);
          continue;
        }

        if (fs.statSync(sourcePath).isDirectory()) {
          if (fs.existsSync(targetPath)) {
            fs.rmSync(targetPath, { recursive: true, force: true });
          }
          await execAsync(`cp -r "${sourcePath}" "${targetPath}"`, { cwd: adminDir });
        } else {
          fs.copyFileSync(sourcePath, targetPath);
        }
      }

      console.log('[Update] Backend: Files updated successfully');

      // Clean up temp directory
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('[Update] Backend: Temp directory cleaned up');

      // Install dependencies
      console.log('[Update] Backend: Installing dependencies...');
      await execAsync('npm install', { cwd: adminDir });
      console.log('[Update] Backend: Dependencies installed successfully');

      // Restore script permissions
      console.log('[Update] Backend: Restoring script permissions...');
      await execAsync('chmod +x *.sh', { cwd: adminDir });
      console.log('[Update] Backend: Script permissions restored successfully');

      // Clean up backup directory
      console.log('[Update] Backend: Cleaning up backup directory...');
      try {
        await execAsync('rm -rf backup_pre_update', { cwd: adminDir });
        console.log('[Update] Backend: Backup directory cleaned up successfully');
      } catch (error) {
        console.log('[Update] Backend: No backup directory to clean up or cleanup failed (non-critical)');
      }

      res.json({ success: true, message: 'Update completed. The application will restart shortly.' });
      console.log('[Update] Backend: Response sent, scheduling restart in 1 second...');

      setTimeout(async () => {
        console.log('[Update] Backend: Restarting complete application...');
        
        // Detect platform and restart accordingly
        const platform = process.platform;
        console.log('[Update] Backend: Detected platform:', platform);
        
        try {
          if (platform === 'darwin') {
            // macOS (Development) - use start-all.sh
            console.log('[Update] Backend: Restarting on macOS using start-all.sh...');
            await execAsync('./start-all.sh', { cwd: adminDir });
          } else if (platform === 'linux') {
            // Linux (Production) - restart systemd services
            console.log('[Update] Backend: Restarting on Linux using systemd...');
            await execAsync('sudo systemctl restart previous-admin-backend previous-admin-frontend', { cwd: adminDir });
          } else {
            console.log('[Update] Backend: Unknown platform, using process exit...');
            process.exit(0);
          }
        } catch (error) {
          console.error('[Update] Backend: Error during restart:', error);
          // Fallback to process exit
          process.exit(0);
        }
      }, 1000);
      return;
    }

    // Find ZIP asset
    const zipAsset = latestRelease.assets.find((asset: any) =>
      asset.name.toLowerCase().endsWith('.zip')
    );

    if (!zipAsset) {
      throw new Error('No ZIP asset found for latest release');
    }

    console.log('[Update] Backend: Found ZIP asset:', zipAsset.name);
    console.log('[Update] Backend: Downloading from:', zipAsset.browser_download_url);

    // Create temp directory
    const tempDir = path.join(adminDir, 'temp_update');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });

    // Create backup
    const backupDir = path.join(adminDir, 'backup_pre_update');
    if (fs.existsSync(backupDir)) {
      fs.rmSync(backupDir, { recursive: true, force: true });
    }
    console.log('[Update] Backend: Creating backup...');
    await execAsync(`cp -r . "${backupDir}"`, { cwd: adminDir });
    console.log('[Update] Backend: Backup created successfully');

    // Download ZIP file
    console.log('[Update] Backend: Downloading ZIP file...');
    const downloadResponse = await fetch(zipAsset.browser_download_url);
    if (!downloadResponse.ok) {
      throw new Error('Failed to download ZIP file');
    }

    const buffer = await downloadResponse.arrayBuffer();
    const zipPath = path.join(tempDir, 'update.zip');
    fs.writeFileSync(zipPath, Buffer.from(buffer));
    console.log('[Update] Backend: ZIP file downloaded successfully');

    // Extract ZIP file
    console.log('[Update] Backend: Extracting ZIP file...');
    const AdmZip = (await import('adm-zip')).default;
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(tempDir, true);
    console.log('[Update] Backend: ZIP file extracted successfully');

    // Find extracted directory (should be the repo name)
    const extractedDirs = fs.readdirSync(tempDir).filter(file =>
      fs.statSync(path.join(tempDir, file)).isDirectory() &&
      file !== '__MACOSX' // Skip macOS metadata
    );

    if (extractedDirs.length === 0) {
      throw new Error('No directory found in extracted ZIP');
    }

    const sourceDir = path.join(tempDir, extractedDirs[0]);
    console.log('[Update] Backend: Source directory:', sourceDir);

    // Copy files (excluding certain directories)
    const excludeDirs = ['node_modules', '.git', 'backup_pre_update', 'temp_update', 'dist'];
    const files = fs.readdirSync(sourceDir);

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(adminDir, file);

      if (excludeDirs.includes(file)) {
        console.log(`[Update] Backend: Skipping excluded directory: ${file}`);
        continue;
      }

      if (fs.statSync(sourcePath).isDirectory()) {
        if (fs.existsSync(targetPath)) {
          fs.rmSync(targetPath, { recursive: true, force: true });
        }
        await execAsync(`cp -r "${sourcePath}" "${targetPath}"`, { cwd: adminDir });
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    }

    console.log('[Update] Backend: Files updated successfully');

    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('[Update] Backend: Temp directory cleaned up');

    // Install dependencies
    console.log('[Update] Backend: Installing dependencies...');
    await execAsync('npm install', { cwd: adminDir });
    console.log('[Update] Backend: Dependencies installed successfully');

    // Restore script permissions
    console.log('[Update] Backend: Restoring script permissions...');
    await execAsync('chmod +x *.sh', { cwd: adminDir });
    console.log('[Update] Backend: Script permissions restored successfully');

    // Clean up backup directory
    console.log('[Update] Backend: Cleaning up backup directory...');
    try {
      await execAsync('rm -rf backup_pre_update', { cwd: adminDir });
      console.log('[Update] Backend: Backup directory cleaned up successfully');
    } catch (error) {
      console.log('[Update] Backend: No backup directory to clean up or cleanup failed (non-critical)');
    }

    res.json({ success: true, message: 'Update completed. The application will restart shortly.' });
    console.log('[Update] Backend: Response sent, scheduling restart in 1 second...');

    setTimeout(async () => {
      console.log('[Update] Backend: Restarting complete application...');
      
      // Detect platform and restart accordingly
      const platform = process.platform;
      console.log('[Update] Backend: Detected platform:', platform);
      
      try {
        if (platform === 'darwin') {
          // macOS (Development) - use start-all.sh
          console.log('[Update] Backend: Restarting on macOS using start-all.sh...');
          await execAsync('./start-all.sh', { cwd: adminDir });
        } else if (platform === 'linux') {
          // Linux (Production) - restart systemd services
          console.log('[Update] Backend: Restarting on Linux using systemd...');
          await execAsync('sudo systemctl restart previous-admin-backend previous-admin-frontend', { cwd: adminDir });
        } else {
          console.log('[Update] Backend: Unknown platform, using process exit...');
          process.exit(0);
        }
      } catch (error) {
        console.error('[Update] Backend: Error during restart:', error);
        // Fallback to process exit
        process.exit(0);
      }
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

    if (compareVersions(latestVersion, currentVersion) <= 0) {
      return res.json({
        currentVersion,
        latestVersion,
        updateAvailable: false,
        releaseUrl: null,
        releaseNotes: null,
        currentReleaseNotes: null,
      });
    }

    // Fetch releases to get release notes
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
        latestVersion,
        updateAvailable,
        releaseUrl: `${REPO_URL}/releases/tag/${latestTag.name}`,
        releaseNotes: null,
        currentReleaseNotes: null,
      });
    }

    const releases = await releasesResponse.json() as any[];
    console.log('[Update] Backend: Found', releases.length, 'releases');
    
    const latestRelease = releases.find((release: any) => release.tag_name === latestTag.name);
    console.log('[Update] Backend: Found latest release:', !!latestRelease);

    // Find current version tag
    const currentTag = tags.find((tag: any) => 
      tag.name === `v${currentVersion}` || tag.name === currentVersion
    );

    // Fetch release notes from releases instead of commits
    let releaseNotes: string | null = null;
    let currentReleaseNotes: string | null = null;

    if (latestRelease?.body) {
      console.log('[Update] Backend: Using release body for latest version');
      releaseNotes = latestRelease.body;
    }

    // Find current version release
    const currentRelease = releases.find((release: any) => 
      release.tag_name === `v${currentVersion}` || release.tag_name === currentVersion
    );

    if (currentRelease?.body) {
      console.log('[Update] Backend: Using release body for current version');
      currentReleaseNotes = currentRelease.body;
    }

    const result = {
      currentVersion,
      latestVersion,
      updateAvailable,
      releaseUrl: `${REPO_URL}/releases/tag/${latestTag.name}`,
      releaseNotes,
      currentReleaseNotes,
    };
    console.log('[Update] Backend: Version check completed:', {
      currentVersion,
      latestVersion,
      updateAvailable,
      releaseUrl: result.releaseUrl,
      releaseNotes: releaseNotes ? 'PRESENT' : 'NULL',
      currentReleaseNotes: currentReleaseNotes ? 'PRESENT' : 'NULL',
      releaseNotesLength: releaseNotes?.length,
      currentReleaseNotesLength: currentReleaseNotes?.length
    });
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
