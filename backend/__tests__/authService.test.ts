/**
 * Unit tests for authentication service
 *
 * Tests business logic in authService.ts
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import {
  isSetupRequired,
  performSetup,
  loginUser,
  logoutUser,
  getSessionInfo
} from '../services/authService';
import type { UserSessionData } from '../types';

// Mock the database functions
jest.mock('../database/users', () => ({
  hasAnyUsers: jest.fn(),
  createUser: jest.fn(),
  authenticateUser: jest.fn(),
}));

import { hasAnyUsers, createUser, authenticateUser } from '../database/users';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isSetupRequired', () => {
    it('should return true when no users exist', () => {
      (hasAnyUsers as any).mockReturnValue(false);
      expect(isSetupRequired()).toBe(true);
    });

    it('should return false when users exist', () => {
      (hasAnyUsers as any).mockReturnValue(true);
      expect(isSetupRequired()).toBe(false);
    });
  });

  describe('performSetup', () => {
    it('should create user when setup is required', async () => {
      (hasAnyUsers as any).mockReturnValue(false);
      const mockUser = { id: 1, username: 'testuser' };
      (createUser as any).mockResolvedValue(mockUser);

      const result = await performSetup({ username: 'testuser', password: 'password' });
      expect(result).toEqual(mockUser);
      expect(createUser).toHaveBeenCalledWith({ username: 'testuser', password: 'password' });
    });

    it('should throw error when setup is not required', async () => {
      (hasAnyUsers as any).mockReturnValue(true);

      await expect(performSetup({ username: 'testuser', password: 'password' }))
        .rejects.toThrow('Setup already completed');
    });
  });

  describe('loginUser', () => {
    it('should authenticate user successfully', async () => {
      const mockSessionData: UserSessionData = {
        userId: '1',
        username: 'testuser'
      };
      (authenticateUser as any).mockResolvedValue({ success: true, user: mockSessionData });

      const result = await loginUser('testuser', 'password');
      expect(result).toEqual(mockSessionData);
      expect(authenticateUser).toHaveBeenCalledWith('testuser', 'password');
    });

    it('should throw error on authentication failure', async () => {
      (authenticateUser as any).mockResolvedValue({ success: false, error: 'Invalid credentials' });

      await expect(loginUser('testuser', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('logoutUser', () => {
    it('should return success', () => {
      const result = logoutUser();
      expect(result).toEqual({ success: true });
    });
  });

  describe('getSessionInfo', () => {
    it('should return setup required when no users exist', () => {
      (hasAnyUsers as any).mockReturnValue(false);

      const result = getSessionInfo();
      expect(result).toEqual({
        authenticated: false,
        setupRequired: true,
      });
    });

    it('should return authenticated when session exists', () => {
      (hasAnyUsers as any).mockReturnValue(true);
      const sessionData: UserSessionData = { userId: '1', username: 'testuser' };

      const result = getSessionInfo(sessionData);
      expect(result).toEqual({
        authenticated: true,
        username: 'testuser',
        setupRequired: false,
      });
    });

    it('should return not authenticated when no session', () => {
      (hasAnyUsers as any).mockReturnValue(true);

      const result = getSessionInfo();
      expect(result).toEqual({
        authenticated: false,
        setupRequired: false,
      });
    });
  });
});