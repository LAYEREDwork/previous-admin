import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAboutLogic } from '../hooks/useAbout';
import { checkForUpdates, updateApplication } from '../lib/versionManager';

// Mock the versionManager functions
vi.mock('../lib/versionManager', () => ({
  checkForUpdates: vi.fn(),
  updateApplication: vi.fn(),
}));

describe('useAboutLogic', () => {
  const mockCheckForUpdates = vi.mocked(checkForUpdates);
  const mockUpdateApplication = vi.mocked(updateApplication);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with checking state true', () => {
    mockCheckForUpdates.mockResolvedValue({
      currentVersion: '1.0.0',
      latestVersion: '1.1.0',
      updateAvailable: true,
      releaseUrl: 'https://example.com/release',
      releaseNotes: 'New features',
      currentReleaseNotes: 'Current notes',
    });

    const { result } = renderHook(() => useAboutLogic());

    expect(result.current.checking).toBe(true);
    expect(result.current.versionInfo).toBe(null);
    expect(result.current.error).toBe(false);
    expect(result.current.updating).toBe(false);
  });

  it('should load version info on mount', async () => {
    const mockVersionInfo = {
      currentVersion: '1.0.0',
      latestVersion: '1.1.0',
      updateAvailable: true,
      releaseUrl: 'https://example.com/release',
      releaseNotes: 'New features',
      currentReleaseNotes: 'Current notes',
    };

    mockCheckForUpdates.mockResolvedValue(mockVersionInfo);

    const { result } = renderHook(() => useAboutLogic());

    await waitFor(() => {
      expect(result.current.checking).toBe(false);
    });

    expect(result.current.versionInfo).toEqual(mockVersionInfo);
    expect(result.current.error).toBe(false);
  });

  it('should handle error when checking for updates fails', async () => {
    mockCheckForUpdates.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAboutLogic());

    await waitFor(() => {
      expect(result.current.checking).toBe(false);
    });

    expect(result.current.error).toBe(true);
    expect(result.current.versionInfo).toBe(null);
  });

  it('should handle update operation', async () => {
    mockCheckForUpdates.mockResolvedValue({
      currentVersion: '1.0.0',
      latestVersion: '1.1.0',
      updateAvailable: true,
      releaseUrl: 'https://example.com/release',
      releaseNotes: 'New features',
      currentReleaseNotes: 'Current notes',
    });
    mockUpdateApplication.mockResolvedValue();

    const { result } = renderHook(() => useAboutLogic());

    // Wait for initial check to complete
    await waitFor(() => {
      expect(result.current.checking).toBe(false);
    });

    // Trigger update
    await result.current.handleUpdate();

    expect(mockUpdateApplication).toHaveBeenCalled();
    expect(result.current.updating).toBe(false); // Should be set back to false after update
  });

  it('should handle manual check for updates', async () => {
    const mockVersionInfo = {
      currentVersion: '1.0.0',
      latestVersion: null,
      updateAvailable: false,
      releaseUrl: null,
      releaseNotes: null,
      currentReleaseNotes: 'Current notes',
    };

    mockCheckForUpdates.mockResolvedValue(mockVersionInfo);

    const { result } = renderHook(() => useAboutLogic());

    // Wait for initial check
    await waitFor(() => {
      expect(result.current.checking).toBe(false);
    });

    // Manually trigger check
    act(() => {
      result.current.handleCheckForUpdates();
    });

    // Should be checking again
    expect(result.current.checking).toBe(true);

    await waitFor(() => {
      expect(result.current.checking).toBe(false);
    });

    expect(result.current.versionInfo).toEqual(mockVersionInfo);
  });
});