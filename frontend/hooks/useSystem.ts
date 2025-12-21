import { useState, useEffect } from 'react';

// Hooks
import { useLanguage } from '../contexts/PALanguageContext';
import { useAuth } from '../contexts/PAAuthContext';
import { useNotification } from '../contexts/PANotificationContext';
import { useSystemMetrics } from './useSystemMetrics';

// Utilities
import { API_BASE_URL, DEFAULT_METRICS_UPDATE_FREQUENCY } from '../lib/constants';

export interface SystemInfo {
  os: string;
  hostname: string;
  hostModel: { name: string };
  kernel: string;
  uptime: number;
  cpu: {
    model: string;
    cores: number;
    speed: number;
  };
  memory: {
    total: number;
    free: number;
    used: number;
  };
  gpu: string[];
  ipAddresses: Array<{ interface: string; address: string }>;
  disks: Array<{
    filesystem: string;
    size: string;
    used: string;
    available: string;
    usePercent: string;
    mountpoint: string;
  }>;
  platform: string;
  arch: string;
  monitorResolution?: {
    width: number;
    height: number;
    source: string;
  };
}

/**
 * Hook to manage system information and orchestration of metrics.
 */
export function useSystem() {
  const { translation } = useLanguage();
  const { logout } = useAuth();
  const { showError } = useNotification();

  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loadingSystemInfo, setLoadingSystemInfo] = useState(true);
  const [systemInfoError, setSystemInfoError] = useState(false);
  const [isSystemTabActive, setIsSystemTabActive] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [updateFrequency, setUpdateFrequency] = useState(DEFAULT_METRICS_UPDATE_FREQUENCY);

  const metrics = useSystemMetrics(isSystemTabActive, updateFrequency);

  // Load static system info
  useEffect(() => {
    const loadSystemInfo = async () => {
      setLoadingSystemInfo(true);
      setSystemInfoError(false);
      try {
        const response = await fetch(`${API_BASE_URL}/api/system/system-info`, {
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
      const response = await fetch(`${API_BASE_URL}/api/system/reset`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        setShowResetModal(false);
        await logout();
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
    updateFrequency,
    setUpdateFrequency,
  };
}