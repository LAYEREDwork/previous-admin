import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { api } from '../lib/api';
import type { PreviousConfig } from '../lib/types';
import { DEFAULT_CONFIG } from '../lib/constants';
import { useAuth } from './AuthContext';
import { database } from '../lib/database';

interface ConfigContextType {
  config: PreviousConfig | null;
  loading: boolean;
  error: string | null;
  updateConfig: (config: PreviousConfig) => Promise<void>;
  refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PreviousConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshConfig = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const activeConfig = await database.getActiveConfiguration();
      if (activeConfig && activeConfig.config_data) {
        setConfig(activeConfig.config_data);
      } else {
        setConfig(DEFAULT_CONFIG);
      }
    } catch (err) {
      console.error('Error loading config from database:', err);
      setConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateConfig = useCallback(async (newConfig: PreviousConfig) => {
    try {
      setError(null);

      const activeConfig = await database.getActiveConfiguration();
      if (activeConfig) {
        await database.updateConfiguration(activeConfig.id, {
          config_data: newConfig
        });
      }

      setConfig(newConfig);

      try {
        await api.updateConfig(newConfig);
      } catch (apiError) {
        console.warn('Failed to sync config to backend:', apiError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration');
      throw err;
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setConfig(null);
      setLoading(false);
      return;
    }

    refreshConfig();
  }, [isAuthenticated, refreshConfig]);

  return (
    <ConfigContext.Provider value={{ config, loading, error, updateConfig, refreshConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
