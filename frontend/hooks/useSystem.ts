import { useState, useEffect, useMemo } from 'react';

// Hooks
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

// Utilities
import { API_BASE_URL } from '../lib/constants';

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

export interface Metrics {
  cpuLoad: {
    current: { oneMin: number; fiveMin: number; fifteenMin: number };
    history: Array<{ oneMin: number; fiveMin: number; fifteenMin: number }>;
  };
  memory: {
    current: number;
    used: number;
    total: number;
    history: Array<{ timestamp: number; value: number }>;
  };
  diskIO: {
    history: Array<{ timestamp: number; read: number; write: number }>;
  };
  networkTraffic: {
    history: Array<{ timestamp: number; received: number; sent: number }>;
  };
}

export function useSystem() {
  const { translation } = useLanguage();
  const { logout } = useAuth();
  const { showError } = useNotification();

  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loadingSystemInfo, setLoadingSystemInfo] = useState(true);
  const [systemInfoError, setSystemInfoError] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isSystemTabActive, setIsSystemTabActive] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Fixed update frequency: 0.25 seconds (4 updates per second)
  const updateFrequency = useMemo(() => 0.25, []);

  // Load system info on mount
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

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsSystemTabActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Reset system handler
  const handleReset = async () => {
    setIsResetting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/system/reset`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Clear local storage and logout
        localStorage.clear();
        sessionStorage.clear();
        setShowResetModal(false);

        // Logout and redirect to login
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

  // WebSocket connection for metrics
  useEffect(() => {
    if (!isSystemTabActive) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:3001`;
    let socket: WebSocket | null = null;

    try {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected for metrics');
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'subscribe_metrics', frequency: updateFrequency }));
        }
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'metrics_update') {
            const maxDataPoints = 60;
            const trimHistory = (history: unknown[]) => {
              if (history.length > maxDataPoints) {
                return history.slice(-maxDataPoints);
              }
              return history;
            };

            const trimmedData = {
              cpuLoad: {
                ...message.data.cpuLoad,
                history: trimHistory(message.data.cpuLoad.history)
              },
              memory: {
                ...message.data.memory,
                history: trimHistory(message.data.memory.history)
              },
              diskIO: {
                ...message.data.diskIO,
                history: trimHistory(message.data.diskIO.history)
              },
              networkTraffic: {
                ...message.data.networkTraffic,
                history: trimHistory(message.data.networkTraffic.history)
              }
            };
            setMetrics(trimmedData);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'unsubscribe_metrics' }));
        socket.close();
      }
    };
  }, [isSystemTabActive, updateFrequency, showError, translation.common.error]);

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