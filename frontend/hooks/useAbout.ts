import { useState, useEffect } from 'react';
import { checkForUpdates, updateApplication, type VersionInfo } from '../lib/versionManager';

/**
 * Custom hook to handle about page business logic.
 * Manages version checking and update operations.
 */
export function useAboutLogic() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [checking, setChecking] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    handleCheckForUpdates();
  }, []);

  const handleCheckForUpdates = async () => {
    console.log('[Update] Hook: Starting version check...');
    setChecking(true);
    setError(false);
    try {
      const info = await checkForUpdates();
      setVersionInfo(info);
      console.log('[Update] Hook: Version check completed successfully');
    } catch (err) {
      setError(true);
      console.error('[Update] Hook: Error during version check:', err);
    } finally {
      setChecking(false);
    }
  };

  const handleUpdate = async () => {
    console.log('[Update] Hook: Starting update process...');
    setUpdating(true);
    setError(false);
    try {
      await updateApplication();
      console.log('[Update] Hook: Update initiated successfully');
    } catch (err) {
      console.error('[Update] Hook: Error during update:', err);
      setError(true);
      setUpdating(false);
    }
  };

  return {
    versionInfo,
    checking,
    updating,
    error,
    handleCheckForUpdates,
    handleUpdate,
  };
}