import { useState, useEffect, useCallback } from 'react';

// Hooks
import type { PreviousConfig } from '@shared/previous-config/types';

import { useConfig } from '@frontend/contexts/PAConfigContext';
import { useLanguage } from '@frontend/contexts/PALanguageContext';
import { useModal } from '@frontend/contexts/PAModalContext';
import { convertToConfigFile } from '@frontend/lib/config';
import { database } from '@frontend/lib/database';

import { useConfigMetadataEditor } from './useConfigMetadataEditor';
import { useConfigSchema } from './useConfigSchema';

// Types

// Database & Utils

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
  const { showSuccess, showError } = useModal();
  const { schema } = useConfigSchema();

  const validateValue = useCallback((sectionName: string, paramName: string, value: any): boolean => {
    if (!schema) return true; // No schema, allow

    const section = schema.sections[sectionName];
    if (!section) return true;

    const param = section.parameters.find(p => p.name === paramName);
    if (!param) return true;

    // Basic type validation
    switch (param.type) {
      case 'boolean':
        return typeof value === 'boolean';
      case 'number':
        if (typeof value !== 'number') return false;
        if (param.min !== undefined && value < param.min) return false;
        if (param.max !== undefined && value > param.max) return false;
        return true;
      case 'enum': {
        // Convert value to string for comparison since possibleValues are always strings
        const stringValue = value?.toString() ?? '';
        return param.possibleValues?.includes(stringValue) ?? true;
      }
      case 'string':
        return typeof value === 'string';
      default:
        return true;
    }
  }, [schema]);

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
  // Track if we've initialized expanded sections from schema
  const [sectionsInitialized, setSectionsInitialized] = useState(false);

  useEffect(() => {
    localStorage.setItem('configEditorSectionsExpanded', JSON.stringify(expandedSections));
  }, [expandedSections]);

  // Initialize expanded sections from schema when it first loads
  useEffect(() => {
    if (schema && !sectionsInitialized) {
      const newExpandedSections: Record<string, boolean> = {};
      const sectionNames = Object.keys(schema.sections);
      
      // Get saved state
      const saved = localStorage.getItem('configEditorSectionsExpanded');
      let savedState: Record<string, boolean> = {};
      if (saved) {
        try {
          savedState = JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved expanded sections', e);
        }
      }
      
      // Initialize each section from schema
      sectionNames.forEach((sectionName, index) => {
        // Use saved state if available, otherwise expand first section, collapse others
        newExpandedSections[sectionName] = savedState[sectionName] !== undefined ? savedState[sectionName] : index === 0;
      });
      
      setExpandedSections(newExpandedSections);
      setSectionsInitialized(true);
    }
  }, [schema, sectionsInitialized]);

  const toggleAllSections = useCallback(() => {
    setExpandedSections(prev => {
      // Get all section names from schema
      const sectionNames = schema ? Object.keys(schema.sections) : Object.keys(prev);
      
      // Check if all sections are currently expanded
      const allExpanded = sectionNames.every(name => prev[name]);
      const newState = !allExpanded;
      
      // Create new state object with all sections (from schema or previous state)
      const newExpandedSections: Record<string, boolean> = {};
      sectionNames.forEach(sectionName => {
        newExpandedSections[sectionName] = newState;
      });
      
      // Keep any other sections from previous state that aren't in schema
      Object.keys(prev).forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(newExpandedSections, key)) {
          newExpandedSections[key] = prev[key];
        }
      });
      
      return newExpandedSections;
    });
  }, [schema]);

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
    if (path.length < 2) return;

    const [sectionName, paramName] = path;
    
    if (!validateValue(sectionName, paramName, value)) {
      showError(`Invalid value for ${paramName}`);
      return;
    }
    setConfigData((prev: PreviousConfig | null) => {
      if (!prev) return prev;
      
      // Create a new copy of the entire config
      const newConfig: any = {};
      
      // Copy all sections
      for (const key in prev) {
        if (Object.prototype.hasOwnProperty.call(prev, key)) {
          if (key === sectionName) {
            // For the section we're updating, create a new copy of that section
            newConfig[key] = {
              ...(prev[key as keyof PreviousConfig] as any),
              [paramName]: value
            };
          } else {
            // For other sections, just copy the reference
            newConfig[key] = prev[key as keyof PreviousConfig];
          }
        }
      }
      
      // If the section doesn't exist yet, create it with the new parameter
      if (!Object.prototype.hasOwnProperty.call(newConfig, sectionName)) {
        newConfig[sectionName] = {
          [paramName]: value
        };
      }
      
      return newConfig as PreviousConfig;
    });
  }, [validateValue, showError]);

  // Memoized converter function to maintain stable reference for child components
  const memoizedConvertToConfigFile = useCallback(convertToConfigFile, []);

  const copyToClipboard = useCallback(async () => {
    if (!configData) return;
    const configText = await convertToConfigFile(configData);

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
  }, [configData, showSuccess, showError, translation.configEditor.copiedToClipboard, translation.configEditor.failedToCopy]);

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
    convertToConfigFile: memoizedConvertToConfigFile,

    // Translations
    translation,
  };
}