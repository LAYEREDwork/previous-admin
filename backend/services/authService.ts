/**
 * Authentication service
 *
 * Business logic for user authentication, setup, and session management.
 * Separated from API routes for better modularity and testability.
 *
 * @module backend/services/authService
 */

import { hasAnyUsers, createUser, authenticateUser } from '../database/users';
import type { User, CreateUserRequest, UserSessionData } from '../types';

/**
 * Check if initial setup is required (no users exist)
 *
 * @returns true if setup is required
 */
export function isSetupRequired(): boolean {
  return !hasAnyUsers();
}

/**
 * Perform initial user setup
 *
 * @param request - Setup request with username and password
 * @returns Created user information
 * @throws Error if setup is not required or validation fails
 */
export async function performSetup(request: CreateUserRequest): Promise<User> {
  if (!isSetupRequired()) {
    throw new Error('Setup already completed');
  }

  return await createUser(request);
}

/**
 * Authenticate user login
 *
 * @param username - Username to authenticate
 * @param password - Password to verify
 * @returns User session data if authentication successful
 * @throws Error if authentication fails
 */
export async function loginUser(username: string, password: string): Promise<UserSessionData> {
  const result = await authenticateUser(username, password);

  if (!result.success) {
    throw new Error((result as { success: false; error: string }).error);
  }

  return result.user;
}

/**
 * Logout user (placeholder for future session cleanup)
 *
 * @returns Success status
 */
export function logoutUser(): { success: boolean } {
  // For now, just return success
  // In future, could clean up session data or tokens
  return { success: true };
}

/**
 * Get current session information
 *
 * @param sessionData - Current session data from request
 * @returns Session response with authentication status
 */
export function getSessionInfo(sessionData?: UserSessionData): {
  authenticated: boolean;
  username?: string;
  setupRequired: boolean;
} {
  const setupRequired = isSetupRequired();

  if (setupRequired) {
    return {
      authenticated: false,
      setupRequired: true,
    };
  }

  if (sessionData?.username) {
    return {
      authenticated: true,
      username: sessionData.username,
      setupRequired: false,
    };
  }

  return {
    authenticated: false,
    username: undefined,
    setupRequired: false,
  };
}