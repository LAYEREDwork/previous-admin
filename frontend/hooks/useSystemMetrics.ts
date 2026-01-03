import { useState, useEffect } from 'react';

import { wsUrl } from '../lib/constants';

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
    history: Array<{ timestamp: number; read?: number; write?: number }>;
  };
  networkTraffic: {
    history: Array<{ timestamp: number; received?: number; sent?: number }>;
  };
}

/**
 * Hook to manage real-time system metrics via WebSocket.
 */
export function useSystemMetrics(isActive: boolean, updateFrequency: number) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    if (!isActive) return;

    let socket: WebSocket | null = null;

    try {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'subscribe_metrics', frequency: updateFrequency }));
        }
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'metrics_update') {
            const maxDataPoints = 60;
            const trimHistory = <T>(history: T[]): T[] => history.length > maxDataPoints ? history.slice(-maxDataPoints) : history;

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

      socket.onerror = (error) => console.error('WebSocket error:', error);
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'unsubscribe_metrics' }));
        socket.close();
      }
    };
  }, [isActive, updateFrequency]);

  return metrics;
}
