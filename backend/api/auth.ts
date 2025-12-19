/**
 * Authentication API routes
 * Handles user setup, login, logout, and session management
 */

import express from 'express';
import {
  hasAnyUsers,
  createUser,
  authenticateUser
} from '../database';

const router = express.Router();

/**
 * GET /api/auth/setup-required
 * Check if system setup is required (no users exist)
 *
 * @returns {Object}
 *   - setupRequired {boolean}: true if no users exist, false otherwise
 * @throws {void} No errors thrown
 *
 * @example
 * const res = await fetch('/api/auth/setup-required');
 * const { setupRequired } = await res.json();
 */
router.get('/setup-required', (req: any, res: any) => {
  const setupRequired = !hasAnyUsers();
  console.log('[Auth] Backend: Setup required check - result:', setupRequired);
  res.json({ setupRequired });
});

/**
 * POST /api/auth/setup
 * Initialize first admin user (only callable if no users exist)
 *
 * Creates initial admin user and establishes session.
 * Can only be called if no users exist in the system.
 *
 * @body {Object}
 *   - username {string} (required): Username for admin account
 *   - password {string} (required): Password for admin account
 *
 * @returns {Object}
 *   - success {boolean}: true on success
 *   - username {string}: Created username
 *
 * @throws {400} If setup already completed or invalid input
 * @throws {400} If user creation fails
 *
 * @example
 * const res = await fetch('/api/auth/setup', {
 *   method: 'POST',
 *   body: JSON.stringify({ username: 'admin', password: 'secure123' })
 * });
 */
router.post('/setup', async (req: any, res: any) => {
  console.log('[Auth] Backend: Setup request received, body:', { username: req.body.username, password: '***' });
  try {
    if (hasAnyUsers()) {
      console.log('[Auth] Backend: Setup failed - users already exist');
      return res.status(400).json({ error: 'Setup already completed' });
    }

    const { username, password } = req.body;
    console.log('[Auth] Backend: Creating user:', username);

    const user = await createUser({ username, password });
    console.log('[Auth] Backend: User created successfully:', user.username);

    req.session.username = user.username;
    req.session.userId = user.id;
    console.log('[Auth] Backend: Session established for user:', user.username);

    res.json({
      success: true,
      username: user.username
    });
    console.log('[Auth] Backend: Setup completed successfully');
  } catch (error) {
    console.error('[Auth] Backend: Setup error:', error);
    res.status(400).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user with username and password
 *
 * Verifies credentials and establishes authenticated session.
 *
 * @body {Object}
 *   - username {string} (required): Username
 *   - password {string} (required): Password
 *
 * @returns {Object}
 *   - username {string}: Authenticated username
 *
 * @throws {401} If credentials are invalid
 * @throws {500} If authentication process fails
 *
 * @example
 * const res = await fetch('/api/auth/login', {
 *   method: 'POST',
 *   body: JSON.stringify({ username: 'admin', password: 'password' })
 * });
 */
router.post('/login', async (req: any, res: any) => {
  const { username, password } = req.body;
  console.log('[Auth] Backend: Login attempt for user:', username);

  try {
    const result = await authenticateUser(username, password);
    console.log('[Auth] Backend: Authentication result:', result.success ? 'success' : 'failed');

    if (!result.success) {
      console.log('[Auth] Backend: Login failed - invalid credentials');
      return res.status(401).json({ error: result.error });
    }

    req.session.username = result.user.username;
    req.session.userId = result.user.id;
    console.log('[Auth] Backend: Session established for user:', result.user.username);

    res.json({
      username: result.user.username
    });
    console.log('[Auth] Backend: Login completed successfully');
  } catch (error) {
    console.error('[Auth] Backend: Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * POST /api/auth/logout
 * Terminate user session and cleanup resources
 *
 * Destroys session and cleans up user-specific resources.
 *
 * @returns {Object}
 *   - success {boolean}: true if logout was successful
 *
 * @throws {500} If session destruction fails
 *
 * @example
 * const res = await fetch('/api/auth/logout', { method: 'POST' });
 */
router.post('/logout', (req: any, res: any) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

/**
 * GET /api/auth/session
 * Get current authentication status and setup requirement
 *
 * Returns authentication state without requiring authentication.
 *
 * @returns {Object}
 *   - authenticated {boolean}: true if user is authenticated
 *   - username {string|undefined}: Username if authenticated
 *   - setupRequired {boolean}: true if no users exist in system
 *
 * @throws {void} No errors thrown
 *
 * @example
 * const res = await fetch('/api/auth/session');
 * const { authenticated, username, setupRequired } = await res.json();
 */
router.get('/session', (req: any, res: any) => {
  const hasSession = !!req.session.username;
  const setupRequired = !hasAnyUsers();
  console.log('[Auth] Backend: Session check - authenticated:', hasSession, 'setupRequired:', setupRequired);

  if (req.session.username) {
    res.json({
      authenticated: true,
      username: req.session.username,
      setupRequired: false
    });
  } else {
    res.json({
      authenticated: false,
      setupRequired: setupRequired
    });
  }
});

export default router;
