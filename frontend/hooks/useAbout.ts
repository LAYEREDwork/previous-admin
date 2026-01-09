import { useState, useEffect, useRef, useCallback } from 'react';

import { checkForUpdates, updateApplication, getUpdateStatus, type VersionInfo, type UpdateStatus } from '@frontend/lib/version';

/**
 * Custom hook to handle about page business logic.
 * Manages version checking and update operations with real-time progress tracking.
 */
export function useAboutLogic() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [checking, setChecking] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    handleCheckForUpdates();
    return () => {
      // Cleanup polling on unmount
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
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

  const pollUpdateStatus = useCallback(async () => {
    try {
      const status = await getUpdateStatus();
      setUpdateStatus(status);

      if (status.status === 'completed') {
        // Update completed successfully
        setUpdating(false);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        // Wait a bit for services to fully restart, then reload
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (status.status === 'error') {
        // Update failed
        setUpdating(false);
        setError(true);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }
    } catch (err) {
      console.error('Error polling update status:', err);
    }
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    setError(false);
    setUpdateStatus({
      status: 'running',
      step: 'initializing',
      progress: 0,
      message: 'Starting update...',
      version: '',
      error: null,
    });

    try {
      await updateApplication();
      // Start polling for status updates
      pollingRef.current = setInterval(pollUpdateStatus, 1000);
    } catch (err) {
      console.error('Error starting update:', err);
      setError(true);
      setUpdating(false);
      setUpdateStatus(null);
    }
  };

  return {
    versionInfo,
    checking,
    updating,
    error,
    updateStatus,
    handleCheckForUpdates,
    handleUpdate,
  };
}
