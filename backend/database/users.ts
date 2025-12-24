/**
 * User management module
 *
 * Handles user authentication, creation, and retrieval from database.
 * All passwords are hashed with bcrypt before storage.
 *
 * @module backend/database/users
 */

import bcrypt from 'bcrypt';
import { PASSWORD_CONFIG, VALIDATION_PATTERNS, ERROR_MESSAGES } from '../constants';
import type { User, CreateUserRequest, UserSessionData } from '../types';
import { getDatabase, reinitializeDatabase } from './core';

/**
 * Check if any users exist in database
 *
 * @returns true if at least one user exists
 */
export function hasAnyUsers(): boolean {
  try {
    const database = getDatabase();
    const result = database.prepare('SELECT COUNT(*) as count FROM users').get();
    return (result as { count: number }).count > 0;
  } catch (error) {
    console.warn('Database query failed, reinitializing database:', error);
    reinitializeDatabase();
    // Try again with fresh connection
    const database = getDatabase();
    const result = database.prepare('SELECT COUNT(*) as count FROM users').get();
    return (result as { count: number }).count > 0;
  }
}

/**
 * Create new user account
 *
 * @param request - User creation request with username and password
 * @returns Created user info with ID and username
 * @throws Error if validation fails or user already exists
 */
export async function createUser(request: CreateUserRequest): Promise<User> {
  const { username, password } = request;

  // Validation
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  if (username.length < 3 || username.length > 32) {
    throw new Error('Username must be between 3 and 32 characters');
  }

  if (password.length < PASSWORD_CONFIG.MIN_LENGTH) {
    throw new Error(`Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`);
  }

  // Validate username format
  if (!VALIDATION_PATTERNS.USERNAME.test(username)) {
    throw new Error('Username can only contain letters, numbers, dashes, and underscores');
  }

  const database = getDatabase();

  // Check if user exists
  const existingUser = database
    .prepare('SELECT id FROM users WHERE username = ?')
    .get(username);
  
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, PASSWORD_CONFIG.SALT_ROUNDS);

  // Create user
  const result = database
    .prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
    .run(username, passwordHash);

  return {
    id: result.lastInsertRowid as number,
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Authenticate user credentials
 *
 * @param username - Username
 * @param password - Password (plaintext)
 * @returns Authentication result with user data or error message
 */
export async function authenticateUser(
  username: string,
  password: string
): Promise<
  | { success: true; user: UserSessionData }
  | { success: false; error: string }
> {
  if (!username || !password) {
    return { success: false, error: ERROR_MESSAGES.INVALID_CREDENTIALS };
  }

  const database = getDatabase();
  const user = database
    .prepare('SELECT id, username, password_hash FROM users WHERE username = ?')
    .get(username) as any;

  if (!user) {
    return { success: false, error: ERROR_MESSAGES.INVALID_CREDENTIALS };
  }

  try {
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return { success: false, error: ERROR_MESSAGES.INVALID_CREDENTIALS };
    }

    return {
      success: true,
      user: {
        userId: user.id as number,
        username: user.username as string,
        loginTime: Date.now(),
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

/**
 * Get user by ID
 *
 * @param userId - User ID
 * @returns User object or undefined if not found
 */
export function getUserById(userId: number): User | undefined {
  const database = getDatabase();
  const user = database
    .prepare('SELECT id, username, password_hash, created_at FROM users WHERE id = ?')
    .get(userId);

  if (!user) {
    return undefined;
  }

  return user as User;
}

/**
 * Get user by username
 *
 * @param username - Username
 * @returns User object or undefined if not found
 */
export function getUserByUsername(username: string): User | undefined {
  const database = getDatabase();
  const user = database
    .prepare('SELECT id, username, password_hash, created_at FROM users WHERE username = ?')
    .get(username);

  if (!user) {
    return undefined;
  }

  return user as User;
}

/**
 * Get all users (admin only)
 *
 * @returns Array of all users
 */
export function getAllUsers(): User[] {
  const database = getDatabase();
  const users = database
    .prepare('SELECT id, username, password_hash as passwordHash, created_at as createdAt FROM users ORDER BY created_at DESC')
    .all() as any[];
  
  return users.map(user => ({
    id: user.id,
    username: user.username,
    passwordHash: user.passwordHash,
    createdAt: user.createdAt
  }));
}

/**
 * Delete user account
 *
 * @param userId - User ID to delete
 * @returns true if deleted, false if not found
 */
export function deleteUser(userId: number): boolean {
  const database = getDatabase();
  const result = database.prepare('DELETE FROM users WHERE id = ?').run(userId);
  return (result as any).changes > 0;
}
