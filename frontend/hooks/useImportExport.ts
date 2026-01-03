import { useState, useEffect } from 'react';

// Hooks
import type { Configuration } from '@shared/previous-config/types';

import { useLanguage } from '../contexts/PALanguageContext';
import { useNotification } from '../contexts/PANotificationContext';

// Utilities
import { database } from '../lib/database';
import { downloadFile, generateConfigFilename } from '../lib/utils';

// Types

/**
 * Custom hook for managing import/export functionality
 * Handles all business logic for configuration and database import/export operations
 */
export function useImportExport() {
  const { translation } = useLanguage();
  const { showSuccess, showError, showWarning } = useNotification();

  // Loading states
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [databaseExporting, setDatabaseExporting] = useState(false);
  const [databaseImporting, setDatabaseImporting] = useState(false);

  // Data
  const [configs, setConfigs] = useState<Configuration[]>([]);

  // Load configurations on mount
  useEffect(() => {
    loadConfigurations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Load all configurations from database
   */
  async function loadConfigurations() {
    try {
      const configurations = await database.getConfigurations();
      setConfigs(configurations);
    } catch (error) {
      console.error('Error loading configurations:', error);
      showError(translation.common.error || 'Failed to load configurations');
    }
  }

  /**
   * Export the currently active configuration
   */
  async function exportConfig() {
    setExporting(true);
    try {
      const configurations = await database.getConfigurations();
      const activeConfig = configurations.find((config: Configuration) => config.is_active);

      if (!activeConfig) {
        showWarning(translation.importExport.noActiveConfig || 'No active configuration found');
        return;
      }

      const exportData = {
        name: activeConfig.name,
        description: activeConfig.description,
        config: activeConfig.config_data,
        exported_at: new Date().toISOString(),
      };

      downloadFile(exportData, generateConfigFilename(activeConfig.name));
      showSuccess(translation.importExport.successExportActiveConfig);
    } catch (error) {
      console.error('Error exporting config:', error);
      showError(translation.importExport.errorExport);
    } finally {
      setExporting(false);
    }
  }

  /**
   * Export all configurations
   */
  async function exportAllConfigs() {
    setExporting(true);
    try {
      const data = await database.getConfigurations();

      if (!data || data.length === 0) {
        showWarning(translation.importExport.noConfigsToExport);
        return;
      }

      const exportData = {
        configurations: data.map((config: Configuration) => ({
          name: config.name,
          description: config.description,
          config: config.config_data,
          is_active: config.is_active,
        })),
        exported_at: new Date().toISOString(),
        count: data.length,
      };

      downloadFile(exportData, `previous-configs-all-${Date.now()}.json`);
      showSuccess(translation.importExport.exportedCount.replace('{count}', data.length.toString()));
    } catch (error) {
      console.error('Error exporting configs:', error);
      showError(translation.importExport.errorExport);
    } finally {
      setExporting(false);
    }
  }

  /**
   * Import configurations from files
   */
  async function importConfig(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setImporting(true);
    try {
      let totalImported = 0;
      const errors: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const text = await file.text();
          let data;

          try {
            data = JSON.parse(text);
          } catch {
            errors.push(`${file.name}: ${translation.importExport.invalidJson}`);
            continue;
          }

          if (!data || typeof data !== 'object') {
            errors.push(`${file.name}: ${translation.importExport.invalidFileStructure}`);
            continue;
          }

          if (data.configurations && Array.isArray(data.configurations)) {
            // Import multiple configurations
            for (const config of data.configurations) {
              if (!config.name || !config.config) {
                console.warn('Skipping invalid configuration entry:', config);
                continue;
              }

              await database.createConfiguration(
                config.name,
                config.description || '',
                config.config,
                false
              );
              totalImported++;
            }
          } else if (data.config && typeof data.config === 'object') {
            // Import single configuration
            if (!data.name) {
              data.name = translation.importExport.importedConfigName;
            }

            await database.createConfiguration(
              data.name,
              data.description || '',
              data.config,
              false
            );
            totalImported++;
          } else {
            errors.push(`${file.name}: ${translation.importExport.invalidFormat}`);
          }
        } catch (fileError) {
          errors.push(`${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
        }
      }

      if (totalImported === 0) {
        if (errors.length > 0) {
          showError(errors.join(', '));
        } else {
          showError(translation.importExport.noValidConfigs);
        }
        return;
      }

      if (totalImported === 1) {
        showSuccess(translation.importExport.importedConfiguration);
      } else {
        showSuccess(translation.importExport.importedCount.replace('{count}', totalImported.toString()));
      }

      if (errors.length > 0) {
        showWarning(`${totalImported} imported, ${errors.length} errors: ${errors.join(', ')}`);
      }

      event.target.value = '';
      // Reload configurations and refresh page
      await loadConfigurations();
      window.location.reload();
    } catch (error) {
      console.error('Error importing configs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(translation.importExport.importFailed.replace('{error}', errorMessage));
    } finally {
      setImporting(false);
    }
  }

  /**
   * Export complete database dump
   */
  async function exportDatabaseDump() {
    setDatabaseExporting(true);
    try {
      const dump = await database.exportDatabase();

      downloadFile(dump, `previous-admin-database-${Date.now()}.json`);
      showSuccess(translation.importExport.databaseExportSuccess);
    } catch (error) {
      console.error('Error exporting database:', error);
      showError(translation.importExport.databaseExportError);
    } finally {
      setDatabaseExporting(false);
    }
  }

  /**
   * Import database dump
   */
  async function importDatabaseDump(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setDatabaseImporting(true);
    try {
      const text = await file.text();
      let dump;

      try {
        dump = JSON.parse(text);
      } catch {
        throw new Error(translation.importExport.invalidJson);
      }

      if (!dump || typeof dump !== 'object') {
        throw new Error(translation.importExport.invalidDatabaseStructure);
      }

      const result = await database.importDatabase(dump, false);

      showSuccess(translation.importExport.databaseImportSuccess.replace('{count}', result.stats.configurations.imported.toString()));

      event.target.value = '';
      // Reload configurations and refresh page
      await loadConfigurations();
      window.location.reload();
    } catch (error) {
      console.error('Error importing database:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(translation.importExport.databaseImportError.replace('{error}', errorMessage));
    } finally {
      setDatabaseImporting(false);
    }
  }

  return {
    // State
    importing,
    exporting,
    databaseExporting,
    databaseImporting,
    configs,

    // Actions
    exportConfig,
    exportAllConfigs,
    importConfig,
    exportDatabaseDump,
    importDatabaseDump,
  };
}