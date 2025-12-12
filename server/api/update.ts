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
router.post('/', requireAuth, async (req, res) => {
  try {
    const adminDir = process.cwd();
    const { stdout: gitStatus } = await execAsync('git status', { cwd: adminDir });

    if (!gitStatus) {
      return res.status(400).json({ error: 'Not a git repository' });
    }

    await execAsync('git pull', { cwd: adminDir });

    res.json({ success: true, message: 'Update completed. The application will restart shortly.' });

    setTimeout(() => {
      console.log('Restarting application after git pull...');
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: error.message || 'Failed to update application' });
  }
});

export default router;
