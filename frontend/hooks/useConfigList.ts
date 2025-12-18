import { useState, useEffect, useRef } from 'react';
import { database, Configuration } from '../lib/database';
import { DEFAULT_CONFIG } from '../lib/constants';
import { useNotification } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { downloadFile, generateConfigFilename } from '../lib/utils';

/**
 * Custom hook to handle config list page business logic.
 * Manages state and operations for configuration management.
 */
export function useConfigListLogic(onEdit: (config: Configuration) => void) {
  const { showSuccess, showError, showConfirm } = useNotification();
  const { translation } = useLanguage();

  const [configs, setConfigs] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewConfig, setShowNewConfig] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');
  const [newConfigDesc, setNewConfigDesc] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const newConfigNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  useEffect(() => {
    if (showNewConfig) {
      // Kurze Verzögerung für Modal-Animation
      setTimeout(() => {
        newConfigNameRef.current?.focus();
      }, 100);
    }
  }, [showNewConfig]);

  async function loadConfigs() {
    try {
      const data = await database.getConfigurations();
      console.log('Loaded configurations:', data?.map(config => ({ id: config.id, name: config.name, sort_order: config.sort_order })));
      setConfigs(data || []);
    } catch (error) {
      console.error('Error loading configs:', error);
      showError(translation.configList.errorLoadingConfigurations);
    } finally {
      setLoading(false);
    }
  }

  async function createConfig() {
    if (!newConfigName.trim()) return;

    try {
      await database.createConfiguration(
        newConfigName,
        newConfigDesc,
        DEFAULT_CONFIG,
        configs.length === 0
      );

      setShowNewConfig(false);
      setNewConfigName('');
      setNewConfigDesc('');
      await loadConfigs();
    } catch (error) {
      console.error('Error creating config:', error);
      showError(translation.configList.errorCreatingConfiguration);
    }
  }

  async function deleteConfig(id: string) {
    showConfirm(
      translation.configList.confirmDelete,
      async () => {
        try {
          await database.deleteConfiguration(id);
          setConfigs(configs.filter((config) => config.id !== id));
        } catch (error) {
          console.error('Error deleting config:', error);
          showError(translation.configList.errorDeletingConfiguration);
        }
      }
    );
  }

  async function setActiveConfig(id: string) {
    try {
      await database.setActiveConfiguration(id);
      loadConfigs();
    } catch (error) {
      console.error('Error setting active config:', error);
      showError(translation.configList.errorSettingActiveConfiguration);
    }
  }

  function exportSingleConfig(config: Configuration) {
    try {
      const exportData = {
        name: config.name,
        description: config.description,
        config: config.config_data,
        exported_at: new Date().toISOString(),
      };

      downloadFile(exportData, generateConfigFilename(config.name));
      showSuccess(translation.configList.configurationExportedSuccessfully);
    } catch (error) {
      console.error('Error exporting config:', error);
      showError(translation.configList.errorExportingConfiguration);
    }
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex === null) return;

    setDragOverIndex(index);

    if (draggedIndex === index) return;

    const newConfigs = [...configs];
    const draggedItem = newConfigs[draggedIndex];
    newConfigs.splice(draggedIndex, 1);
    newConfigs.splice(index, 0, draggedItem);

    setConfigs(newConfigs);
    setDraggedIndex(index);
  }

  async function handleDragEnd() {
    if (draggedIndex === null) return;

    try {
      const orderedIds = configs.map(config => config.id);
      console.log('Saving new order:', orderedIds);
      await database.updateConfigurationsOrder(orderedIds);
      console.log('Order saved successfully');
      await loadConfigs();
    } catch (error) {
      console.error('Error updating order:', error);
      showError(translation.configList.errorUpdatingOrder);
      loadConfigs();
    } finally {
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  }

  function handleDragLeave() {
    setDragOverIndex(null);
  }

  function handleCloseNewConfigModal() {
    setShowNewConfig(false);
    setNewConfigName('');
    setNewConfigDesc('');
  }

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
    deleteConfig,
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