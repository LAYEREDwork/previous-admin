import { BiRefresh, BiError, BiLineChart, BiHdd, BiGlobe, BiDesktop } from 'react-icons/bi';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useState, useEffect, useMemo } from 'react';
import { Button } from 'rsuite';
import { CenteredModal } from '../controls/CenteredModal';
import { useControlSize } from '../../hooks/useControlSize';

import { API_BASE_URL } from '../../lib/constants';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getOptimalUnit, formatBytes, formatUptime } from '../../lib/utils';

interface SystemInfo {
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

interface Metrics {
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

// Helper function to pad data to fixed window size
function padDataToWindow<T extends Record<string, unknown>>(data: T[], windowSize: number, emptyValue: Partial<T>): T[] {
  if (data.length >= windowSize) {
    return data.slice(-windowSize);
  }
  const padding = Array(windowSize - data.length).fill(null).map((_, i) => ({
    timestamp: Date.now() - (windowSize - i) * 1000,
    ...emptyValue
  } as unknown as T));
  return [...padding, ...data];
}

export function System() {
  const { translation } = useLanguage();
  const controlSize = useControlSize();
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
  }, [isSystemTabActive, updateFrequency]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {translation.system.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {translation.system.subtitle}
        </p>
      </div>

      {loadingSystemInfo ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 text-next-accent">
            <BiRefresh size={16} className="animate-spin" />
            <span className="text-sm">{translation.system.loading}</span>
          </div>
        </div>
      ) : systemInfoError ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <BiError size={16} />
            <span className="text-sm">{translation.system.errorLoading}</span>
          </div>
        </div>
      ) : systemInfo ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BiHdd size={20} className="text-gray-600 dark:text-gray-400" />
              {translation.system.hostInfo}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.os}</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{systemInfo.os}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.host}</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{systemInfo.hostname}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Model</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{systemInfo.hostModel.name}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.kernel}</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{systemInfo.kernel}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.uptime}</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                    {formatUptime(systemInfo.uptime, {
                      days: translation.system.days,
                      hours: translation.system.hours,
                      minutes: translation.system.minutes,
                      seconds: translation.system.seconds
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <BiLineChart size={16} className="text-next-accent" />
                    {translation.system.cpu}
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.model}</span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate mt-0.5">{systemInfo.cpu.model}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.cores}</span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{systemInfo.cpu.cores}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Speed</span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{systemInfo.cpu.speed} MHz</p>
                    </div>
                  </div>
                </div>

                {systemInfo.gpu && systemInfo.gpu.length > 0 && systemInfo.gpu[0] !== 'N/A' && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <BiDesktop size={16} className="text-green-600 dark:text-green-400" />
                      {translation.system.gpu}
                    </h4>
                    <div className="space-y-2">
                      {systemInfo.gpu.map((gpu, idx) => (
                        <p key={idx} className="text-sm text-gray-900 dark:text-white break-words">{gpu}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* IP & Display */}
              {(systemInfo.ipAddresses?.length > 0 || systemInfo.monitorResolution) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  {systemInfo.ipAddresses && systemInfo.ipAddresses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <BiGlobe size={16} className="text-cyan-600 dark:text-cyan-400" />
                        {translation.system.ipAddresses}
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        {systemInfo.ipAddresses.map((ip, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{ip.interface}:</span>
                            <p className="text-sm font-mono font-medium text-gray-900 dark:text-white break-all mt-0.5">{ip.address}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {systemInfo.monitorResolution && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <BiDesktop size={16} className="text-indigo-600 dark:text-indigo-400" />
                        {translation.system.display}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.resolution}</span>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{systemInfo.monitorResolution.width} x {systemInfo.monitorResolution.height}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.source}</span>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{systemInfo.monitorResolution.source}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Server Dashboard */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CPU Load Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BiLineChart size={20} className="text-next-accent" />
                    {translation.system.cpuLoadAverage}
                  </h3>
                  <div className="text-right">
                    <p className="text-sm font-semibold flex items-center justify-end gap-2">
                      <span style={{ color: '#ea580c' }}>{metrics?.cpuLoad.current.fifteenMin.toFixed(2)}</span>
                      <span className="text-gray-400">/</span>
                      <span style={{ color: '#16a34a' }}>{metrics?.cpuLoad.current.fiveMin.toFixed(2)}</span>
                      <span className="text-gray-400">/</span>
                      <span style={{ color: '#2563eb' }}>{metrics?.cpuLoad.current.oneMin.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
                {metrics && metrics.cpuLoad.history.length >= 1 ? (() => {
                  const paddedData = padDataToWindow(metrics.cpuLoad.history, 60, { oneMin: undefined, fiveMin: undefined, fifteenMin: undefined });
                  const indexedData = paddedData.map((item, index) => ({ ...item, index }));
                  return (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={indexedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" />
                        <XAxis dataKey="index" hide tick={false} />
                      <YAxis domain={[0, 'auto']} label={{ value: 'Load', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} tick={{ fill: '#6b7280' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                        formatter={(value: number | undefined, name: string | undefined) => {
                          const numValue = value ?? 0;
                          const labels: Record<string, string> = {
                            oneMin: '1 min',
                            fiveMin: '5 min',
                            fifteenMin: '15 min'
                          };
                          return [`${numValue.toFixed(2)}`, labels[name || ''] || name || ''];
                        }}
                        labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px', color: '#6b7280' }}
                        formatter={(value) => {
                          const labels: Record<string, string> = {
                            oneMin: '1 min',
                            fiveMin: '5 min',
                            fifteenMin: '15 min'
                          };
                          return labels[value] || value;
                        }}
                      />
                      <Line type="monotone" dataKey="oneMin" stroke="#2563eb" dot={false} strokeWidth={2} isAnimationActive={false} name="oneMin" />
                      <Line type="monotone" dataKey="fiveMin" stroke="#16a34a" dot={false} strokeWidth={2} isAnimationActive={false} name="fiveMin" />
                      <Line type="monotone" dataKey="fifteenMin" stroke="#ea580c" dot={false} strokeWidth={2} isAnimationActive={false} name="fifteenMin" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                  );
                })() : (
                  <div className="h-48 flex items-center justify-center text-gray-400">{translation.system.collectingData}</div>
                )}
              </div>

              {/* Network Traffic Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BiGlobe size={20} className="text-cyan-600 dark:text-cyan-400" />
                  {translation.system.networkTraffic}
                </h3>
                {metrics && metrics.networkTraffic.history.length >= 1 ? (() => {
                  const paddedData = padDataToWindow(metrics.networkTraffic.history, 60, { received: undefined, sent: undefined });
                  const networkUnit = getOptimalUnit(paddedData.filter(d => d.received !== null));
                  const convertedNetworkData = paddedData.map((item, index) => ({
                    ...item,
                    index,
                    received: item.received !== null ? item.received / networkUnit.divisor : null,
                    sent: item.sent !== null ? item.sent / networkUnit.divisor : null,
                  }));
                  return (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={convertedNetworkData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" />
                        <XAxis dataKey="index" hide />
                        <YAxis domain={[0, 'auto']} label={{ value: networkUnit.unit, angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} tick={{ fill: '#6b7280' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                          formatter={(value: number | undefined, name: string | undefined) => [`${(value ?? 0).toFixed(2)} ${networkUnit.unit}`, name || '']}
                          labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', color: '#6b7280' }} />
                        <Line type="monotone" dataKey="received" stroke="#06b6d4" name="Received" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
                        <Line type="monotone" dataKey="sent" stroke="#f97316" name="Sent" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
                      </LineChart>
                    </ResponsiveContainer>
                  );
                })() : (
                  <div className="h-48 flex items-center justify-center text-gray-400">{translation.system.collectingData}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Memory Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BiHdd size={20} className="text-green-600 dark:text-green-400" />
                    {translation.system.memory}
                  </h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{metrics?.memory.current}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(metrics?.memory.used || 0)} / {formatBytes(metrics?.memory.total || 0)}</p>
                  </div>
                </div>
                {metrics && metrics.memory.history.length >= 1 ? (() => {
                  const paddedData = padDataToWindow(metrics.memory.history, 60, { value: undefined });
                  const indexedData = paddedData.map((item, index) => ({ ...item, index }));
                  return (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={indexedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" />
                        <XAxis dataKey="index" hide />
                      <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} tick={{ fill: '#6b7280' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                        formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(1)}%`, 'Memory']}
                        labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                      />
                        <Line type="monotone" dataKey="value" stroke="#10b981" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
                      </LineChart>
                    </ResponsiveContainer>
                  );
                })() : (
                  <div className="h-48 flex items-center justify-center text-gray-400">{translation.system.collectingData}</div>
                )}
              </div>

              {/* Disk IO Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BiLineChart size={20} className="text-orange-600 dark:text-orange-400" />
                  Disk I/O
                </h3>
                {metrics && metrics.diskIO.history.length >= 1 ? (() => {
                  const paddedData = padDataToWindow(metrics.diskIO.history, 60, { read: undefined, write: undefined });
                  const diskUnit = getOptimalUnit(paddedData.filter(d => d.read !== null));
                  const convertedDiskData = paddedData.map((item, index) => ({
                    ...item,
                    index,
                    read: item.read !== null ? item.read / diskUnit.divisor : null,
                    write: item.write !== null ? item.write / diskUnit.divisor : null,
                  }));
                  return (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={convertedDiskData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" />
                        <XAxis dataKey="index" hide />
                        <YAxis domain={[0, 'auto']} label={{ value: diskUnit.unit, angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} tick={{ fill: '#6b7280' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                          formatter={(value: number | undefined, name: string | undefined) => [`${(value ?? 0).toFixed(2)} ${diskUnit.unit}`, name || '']}
                          labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', color: '#6b7280' }} />
                        <Line type="monotone" dataKey="read" stroke="#3b82f6" name="Read" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
                        <Line type="monotone" dataKey="write" stroke="#ef4444" name="Write" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
                      </LineChart>
                    </ResponsiveContainer>
                  );
                })() : (
                  <div className="h-48 flex items-center justify-center text-gray-400">{translation.system.collectingData}</div>
                )}
              </div>
            </div>

            {/* Disk Space */}
            {systemInfo.disks && systemInfo.disks.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <BiHdd size={20} className="text-orange-600 dark:text-orange-400" />
                  {translation.system.disks}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {systemInfo.disks
                    .reduce((uniqueDisks: typeof systemInfo.disks, disk) => {
                      const exists = uniqueDisks.some(d => d.mountpoint === disk.mountpoint);
                      if (!exists) uniqueDisks.push(disk);
                      return uniqueDisks;
                    }, [])
                    .map((disk, idx) => {
                      return (
                        <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{disk.filesystem}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{disk.mountpoint}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{disk.usePercent}</p>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-orange-600 dark:bg-orange-400 h-2 rounded-full"
                              style={{ width: disk.usePercent }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
                            <span>{disk.used} / {disk.size}</span>
                            <span>{disk.available} free</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Reset System Section */}
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                {translation.system.resetTitle}
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                {translation.system.resetDescription}
              </p>
              <div className="flex justify-end">
                <Button
                  onClick={() => setShowResetModal(true)}
                  appearance="primary"
                  color="red"
                  disabled={isResetting}
                  loading={isResetting}
                  size={controlSize}
                >
                  {translation.system.reset}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span className="text-sm">Unable to load system information</span>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <CenteredModal open={showResetModal} onClose={() => setShowResetModal(false)} size="sm">
        <CenteredModal.Header>
          <CenteredModal.Title>{translation.system.resetTitle}</CenteredModal.Title>
        </CenteredModal.Header>
        <CenteredModal.Body>
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {translation.system.resetDescription}
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                ⚠️ {translation.system.resetWarning}
              </p>
            </div>
          </div>
        </CenteredModal.Body>
        <CenteredModal.Footer>
          <Button
            onClick={() => setShowResetModal(false)}
            appearance="default"
            disabled={isResetting}
            size={controlSize}
          >
            {translation.common.cancel}
          </Button>
          <Button
            onClick={handleReset}
            appearance="primary"
            color="red"
            loading={isResetting}
            disabled={isResetting}
            size={controlSize}
          >
            {isResetting ? translation.system.resetting : translation.system.resetConfirm}
          </Button>
        </CenteredModal.Footer>
      </CenteredModal>
    </div>
  );
}
