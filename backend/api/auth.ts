/**
 * Authentication API routes
 * Handles user setup, login, logout, and session management
 */

import express, { Request, Response } from 'express';
import {
  isSetupRequired,
  performSetup,
  loginUser,
  logoutUser,
  getSessionInfo
} from '../services/authService';
import { ApiPaths } from '../../../shared/constants';
import { AuthenticatedRequest } from '../types';
import { UserSessionData } from '../types';

const router = express.Router();

// Request body types
interface SetupRequestBody {
  username: string;
  password: string;
}

interface LoginRequestBody {
  username: string;
  password: string;
}

// Response types
interface SetupRequiredResponse {
  setupRequired: boolean;
}

interface SetupResponse {
  success: boolean;
  username: string;
}

interface LoginResponse {
  username: string;
}

interface LogoutResponse {
  success: boolean;
}

interface SessionResponse {
  authenticated: boolean;
  username?: string;
  setupRequired: boolean;
}

interface ErrorResponse {
  error: string;
}

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
router.get(ApiPaths.Auth.setupRequired.relative, (_req: Request, res: Response<SetupRequiredResponse>) => {
  res.json({ setupRequired: isSetupRequired() });
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
router.post(ApiPaths.Auth.setup.relative, async (
  req: Request<object, SetupResponse | ErrorResponse, SetupRequestBody>,
  res: Response<SetupResponse | ErrorResponse>
) => {
  try {
    if (!isSetupRequired()) {
      return res.status(400).json({ error: 'Setup already completed' });
    }

    const authRequest = req as AuthenticatedRequest;
    const { username, password } = req.body;
    const user = await performSetup({ username, password });

    authRequest.session.username = user.username;
    authRequest.session.userId = user.id;

    res.json({
      success: true,
      username: user.username
    });
  } catch (error) {
    console.error('Setup error:', error);
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
router.post(ApiPaths.Auth.login.relative, async (
  req: Request<object, LoginResponse | ErrorResponse, LoginRequestBody>,
  res: Response<LoginResponse | ErrorResponse>
) => {
  const authRequest = req as AuthenticatedRequest;
  const { username, password } = authRequest.body;

  try {
    const sessionData = await loginUser(username, password);

    authRequest.session.username = sessionData.username;
    authRequest.session.userId = sessionData.userId;

    res.json({
      username: sessionData.username
    });
  } catch (error) {
    console.error('Login error:', error);
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
router.post(ApiPaths.Auth.logout.relative, (
  req: Request,
  res: Response<LogoutResponse | ErrorResponse>
) => {
  const authReq = req as AuthenticatedRequest;
  authReq.session.destroy((err?: Error) => {
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
router.get(ApiPaths.Auth.session.relative, (
  req: Request,
  res: Response<SessionResponse>
) => {
  const authReq = req as AuthenticatedRequest;
  const sessionInfo = getSessionInfo(authReq.session.user);
  res.json(sessionInfo);
});

export default router;
