import { useState, useEffect } from 'react';

// Hooks
import type { SystemInfo } from '@shared/previous-config/types';

import { useLanguage } from '../contexts/PALanguageContext';
import { useNotification } from '../contexts/PANotificationContext';
import { apiBaseUrl, defaultMetricsUpdateFrequency } from '../lib/constants';

import { useSystemMetrics } from './useSystemMetrics';

// Utilities

// Shared Types

/**
 * Hook to manage system information and orchestration of metrics.
 */
export function useSystem() {
  const { translation } = useLanguage();
  const { showError } = useNotification();

  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loadingSystemInfo, setLoadingSystemInfo] = useState(true);
  const [systemInfoError, setSystemInfoError] = useState(false);
  const [isSystemTabActive, setIsSystemTabActive] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Metrics update frequency is fixed to 0.5 seconds
  const metrics = useSystemMetrics(isSystemTabActive, defaultMetricsUpdateFrequency);

  // Load static system info
  useEffect(() => {
    const loadSystemInfo = async () => {
      setLoadingSystemInfo(true);
      setSystemInfoError(false);
      try {
        const response = await fetch(`${apiBaseUrl}/api/system/system-info`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to load system info');
        const data = await response.json();
        setSystemInfo(data);
      } catch (err) {
        console.error('Error loading system info:', err);
        setSystemInfoError(true);
      } finally {
        setLoadingSystemInfo(false);
      }
    };
    loadSystemInfo();
  }, []);

  // Monitor visibility for metrics throttling
  useEffect(() => {
    const handleVisibilityChange = () => setIsSystemTabActive(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/system/reset`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        setShowResetModal(false);
        window.location.reload();
      } else {
        showError(translation.common.error || 'Reset failed');
      }
    } catch (err) {
      console.error('Reset error:', err);
      showError(translation.common.error || 'Reset failed');
    } finally {
      setIsResetting(false);
    }
  };

  return {
    systemInfo,
    loadingSystemInfo,
    systemInfoError,
    metrics,
    showResetModal,
    setShowResetModal,
    isResetting,
    handleReset,
  };
}