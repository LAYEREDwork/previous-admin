import { useState, useEffect, useCallback } from 'react';

// Hooks
import { useConfig } from '../contexts/PAConfigContext';
import { useLanguage } from '../contexts/PALanguageContext';
import { useNotification } from '../contexts/PANotificationContext';
import { useConfigMetadataEditor } from './useConfigMetadataEditor';

// Types
import type { PreviousConfig } from '~shared/types';

// Database & Utils
import { database } from '../lib/database';
import { convertToConfigFile } from '../lib/config';

/**
 * Custom hook to handle configuration editor business logic.
 * Orchestrates sub-hooks for metadata, sections, and persistence.
 */
export function useConfigEditor(configId?: string | null) {
  const {
    config,
    configName,
    configDescription,
    loading,
    error,
    updateConfig,
    loadConfigById,
    updateConfigMetadata,
    refreshConfig
  } = useConfig();

  const { translation } = useLanguage();
  const { showSuccess, showError } = useNotification();

  const [configData, setConfigData] = useState<PreviousConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'raw'>('editor');
  const [hasSavedConfigs, setHasSavedConfigs] = useState<boolean | null>(null);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('configEditorSectionsExpanded');
    const defaultSections = {
      system: true,
      display: false,
      scsi: false,
      network: false,
      sound: false,
      boot: false,
      input: false,
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved state with defaults to ensure all sections are defined
        return { ...defaultSections, ...parsed };
      } catch (e) {
        console.error('Error parsing expanded sections from localStorage', e);
      }
    }
    return defaultSections;
  });

  useEffect(() => {
    localStorage.setItem('configEditorSectionsExpanded', JSON.stringify(expandedSections));
  }, [expandedSections]);

  const toggleAllSections = useCallback(() => {
    setExpandedSections(prev => {
      const allExpanded = Object.values(prev).every(expanded => expanded);
      const newState = !allExpanded;
      // Create new state object with all current sections set to the new state
      const newExpandedSections: Record<string, boolean> = {};
      Object.keys(prev).forEach(key => {
        newExpandedSections[key] = newState;
      });
      return newExpandedSections;
    });
  }, []);

  const {
    localName,
    setLocalName,
    localDescription,
    setLocalDescription,
    hasChanges,
    setHasChanges
  } = useConfigMetadataEditor(configName || '', configDescription || '');

  // Load specific config when configId changes
  useEffect(() => {
    if (configId) {
      loadConfigById(configId);
    }
  }, [configId, loadConfigById]);

  // Check if there are any saved configs when no config is selected
  useEffect(() => {
    if (!configId) {
      database.getConfigurations()
        .then(configs => setHasSavedConfigs(configs.length > 0))
        .catch(() => setHasSavedConfigs(false));
    } else {
      setHasSavedConfigs(true);
    }
  }, [configId]);

  // Sync global config to local editor state
  useEffect(() => {
    if (config) {
      setConfigData(config);
    }
  }, [config]);

  const handleSave = async () => {
    if (!configData) return;
    setSaving(true);
    try {
      await updateConfig(configData);
      showSuccess(translation.common.success || 'Saved successfully');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error saving config');
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMetadata = async () => {
    if (!hasChanges) return;
    setSaving(true);
    try {
      await updateConfigMetadata(localName, localDescription);
      setHasChanges(false);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error saving metadata');
      console.error('Error saving metadata:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateConfigField = useCallback((path: string[], value: string | number | boolean) => {
    setConfigData((prev: PreviousConfig | null) => {
      if (!prev) return prev;
      const newConfig = { ...prev };
      let current: any = newConfig;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      return newConfig;
    });
  }, []);

  const copyToClipboard = async () => {
    if (!configData) return;
    const configText = convertToConfigFile(configData);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(configText);
        showSuccess(translation.configEditor.copiedToClipboard);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      // Fallback
      try {
        const textarea = document.createElement('textarea');
        textarea.value = configText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) showSuccess(translation.configEditor.copiedToClipboard);
        else showError(translation.configEditor.failedToCopy);
      } catch {
        showError(translation.configEditor.failedToCopy);
      }
    }
  };

  return {
    // State
    config,
    configName,
    configDescription,
    configData,
    loading,
    error,
    saving,
    viewMode,
    localName,
    localDescription,
    hasChanges,
    hasSavedConfigs,
    expandedSections,

    // Actions
    setViewMode,
    setLocalName,
    setLocalDescription,
    setExpandedSections,
    toggleAllSections,
    handleSave,
    handleUpdateMetadata,
    updateConfigField,
    copyToClipboard,
    loadConfigById,
    refreshConfig,

    // Utilities
    convertToConfigFile,

    // Translations
    translation,
  };
}