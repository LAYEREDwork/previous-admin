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
    setChecking(true);
    setError(false);
    try {
      const info = await checkForUpdates();
      setVersionInfo(info);
    } catch (err) {
      setError(true);
      console.error('Error checking for updates:', err);
    } finally {
      setChecking(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setError(false);
    try {
      await updateApplication();
    } catch (err) {
      console.error('Error updating application:', err);
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