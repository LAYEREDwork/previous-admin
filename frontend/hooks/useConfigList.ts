import { useState, useEffect, useCallback } from 'react';

// Hooks
import { useLanguage } from '@frontend/contexts/PALanguageContext';
import { useNotification } from '@frontend/contexts/PANotificationContext';
import { database, Configuration } from '@frontend/lib/database';

import { useConfigActions } from './useConfigActions';
import { useConfigDnD } from './useConfigDnD';
import { useNewConfigModal } from './useNewConfigModal';

// Utilities

/**
 * Custom hook to handle config list page business logic.
 * Orchestrates specialized hooks to provide a clean interface for the UI.
 */
export function useConfigListLogic(onEdit: (config: Configuration) => void) {
  const { showError } = useNotification();
  const { translation } = useLanguage();

  const [configs, setConfigs] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConfigs = useCallback(async () => {
    try {
      const data = await database.getConfigurations();
      setConfigs(data || []);
    } catch (error) {
      console.error('Error loading configs:', error);
      showError(translation.configList.errorLoadingConfigurations);
    } finally {
      setLoading(false);
    }
  }, [showError, translation.configList.errorLoadingConfigurations]);

  const {
    showNewConfig,
    setShowNewConfig,
    newConfigName,
    setNewConfigName,
    newConfigDesc,
    setNewConfigDesc,
    newConfigNameRef,
    handleClose: handleCloseNewConfigModal,
  } = useNewConfigModal();

  const {
    createConfig: performCreate,
    deleteConfig,
    duplicateConfig,
    setActiveConfig,
    exportSingleConfig,
  } = useConfigActions(loadConfigs);

  const {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
  } = useConfigDnD(configs, loadConfigs);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const createConfig = async () => {
    const isFirstConfig = configs.length === 0;
    const success = await performCreate(newConfigName, newConfigDesc, isFirstConfig);
    if (success) {
      handleCloseNewConfigModal();
    }
  };

  return {
    configs,
    loading,
    showNewConfig,
    setShowNewConfig,
    newConfigName,
    setNewConfigName,
    newConfigDesc,
    setNewConfigDesc,
    draggedIndex,
    dragOverIndex,
    newConfigNameRef,
    loadConfigs,
    createConfig,
    deleteConfig: (id: string) => deleteConfig(id),
    duplicateConfig,
    setActiveConfig,
    exportSingleConfig,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
    handleCloseNewConfigModal,
    onEdit,
  };
}