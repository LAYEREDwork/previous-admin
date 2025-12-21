import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

// Hooks
import { useAuth } from './PAAuthContext';

// Utilities
import { api } from '../lib/api';
import { database } from '../lib/database';
import { DEFAULT_CONFIG } from '../lib/constants';

// Types
import type { PreviousConfig } from '../lib/types';

interface ConfigContextType {
  config: PreviousConfig | null;
  configName: string | null;
  configDescription: string | null;
  loading: boolean;
  error: string | null;
  updateConfig: (config: PreviousConfig) => Promise<void>;
  refreshConfig: () => Promise<void>;
  loadConfigById: (id: string) => Promise<void>;
  updateConfigMetadata: (name: string, description: string) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

/**
 * Merge loaded config with default config to ensure all required fields exist
 */
function mergeWithDefaults(loadedConfig: Partial<PreviousConfig> | null): PreviousConfig {
  if (!loadedConfig) {
    return DEFAULT_CONFIG;
  }

  return {
    system: {
      ...DEFAULT_CONFIG.system,
      ...loadedConfig.system,
    },
    display: {
      ...DEFAULT_CONFIG.display,
      ...loadedConfig.display,
    },
    scsi: {
      ...DEFAULT_CONFIG.scsi,
      ...loadedConfig.scsi,
    },
    network: {
      ...DEFAULT_CONFIG.network,
      ...loadedConfig.network,
    },
    ethernet: {
      enabled: false,
      type: 'ethernet',
      ...DEFAULT_CONFIG.ethernet,
      ...loadedConfig.ethernet,
    },
    sound: {
      ...DEFAULT_CONFIG.sound,
      ...loadedConfig.sound,
    },
    printer: {
      enabled: false,
      type: 'parallel',
      ...DEFAULT_CONFIG.printer,
      ...loadedConfig.printer,
    },
    boot: {
      ...DEFAULT_CONFIG.boot,
      ...loadedConfig.boot,
    },
    keyboard: {
      ...DEFAULT_CONFIG.keyboard,
      ...loadedConfig.keyboard,
    },
    mouse: {
      ...DEFAULT_CONFIG.mouse,
      ...loadedConfig.mouse,
    },
  };
}

export function PAConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PreviousConfig | null>(null);
  const [configName, setConfigName] = useState<string | null>(null);
  const [configDescription, setConfigDescription] = useState<string | null>(null);
  const [currentConfigId, setCurrentConfigId] = useState<string | null>(null);
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
        // Merge with defaults to ensure all required fields exist
        const mergedConfig = mergeWithDefaults(activeConfig.config_data);
        setConfig(mergedConfig);
        setConfigName(activeConfig.name);
        setConfigDescription(activeConfig.description);
        setCurrentConfigId(activeConfig.id);
      } else {
        setConfig(DEFAULT_CONFIG);
        setConfigName(null);
        setConfigDescription(null);
        setCurrentConfigId(null);
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

  const loadConfigById = useCallback(async (id: string) => {
    console.log('Loading config by ID:', id);
    try {
      setLoading(true);
      setError(null);

      const configData = await database.getConfiguration(id);
      console.log('Config data from DB:', configData);
      if (configData) {
        // Merge with defaults to ensure all required fields exist
        const mergedConfig = mergeWithDefaults(configData.config_data);
        console.log('Merged config:', mergedConfig);
        setConfig(mergedConfig);
        setConfigName(configData.name);
        setConfigDescription(configData.description);
        setCurrentConfigId(configData.id);
        console.log('Config loaded successfully');
      } else {
        throw new Error('Configuration not found');
      }
    } catch (error) {
      console.error('Error loading config by ID:', error);
      setError(error instanceof Error ? error.message : 'Error loading config');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfigMetadata = useCallback(async (name: string, description: string) => {
    try {
      setError(null);

      if (!currentConfigId) {
        throw new Error('No configuration loaded');
      }

      await database.updateConfiguration(currentConfigId, {
        name,
        description
      });
      setConfigName(name);
      setConfigDescription(description);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration metadata');
      throw err;
    }
  }, [currentConfigId]);

  useEffect(() => {
    if (!isAuthenticated) {
      setConfig(null);
      setConfigName(null);
      setConfigDescription(null);
      setCurrentConfigId(null);
      setLoading(false);
      return;
    }

    refreshConfig();
  }, [isAuthenticated, refreshConfig]);

  return (
    <ConfigContext.Provider value={{ config, configName, configDescription, loading, error, updateConfig, refreshConfig, loadConfigById, updateConfigMetadata }}>
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
