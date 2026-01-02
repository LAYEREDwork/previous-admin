import { Configuration, database } from '../lib/database';
import { useNotification } from '../contexts/PANotificationContext';
import { useLanguage } from '../contexts/PALanguageContext';
import { useConfig } from '../contexts/PAConfigContext';
import { defaultConfig } from '../lib/config';
import { downloadFile, generateConfigFilename } from '../lib/utils';

/**
 * Hook to handle specialized actions for configurations like create, delete, duplicate, etc.
 */
export function useConfigActions(onRefreshList: () => Promise<void>) {
  const { showSuccess, showError, showConfirm } = useNotification();
  const { translation } = useLanguage();
  const { refreshConfig } = useConfig();

  async function createConfig(name: string, description: string, isFirst: boolean) {
    if (!name.trim()) return;
    try {
      await database.createConfiguration(name, description, defaultConfig, isFirst);
      await onRefreshList();
      await refreshConfig();
      return true;
    } catch (error) {
      console.error('Error creating config:', error);
      showError(translation.configList.errorCreatingConfiguration);
      return false;
    }
  }

  async function deleteConfig(id: string) {
    showConfirm(translation.configList.confirmDelete, async () => {
      try {
        await database.deleteConfiguration(id);
        await onRefreshList();
        await refreshConfig();
      } catch (error) {
        console.error('Error deleting config:', error);
        showError(translation.configList.errorDeletingConfiguration);
      }
    });
  }

  async function setActiveConfig(id: string) {
    try {
      await database.setActiveConfiguration(id);
      await onRefreshList();
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

  async function duplicateConfig(config: Configuration) {
    try {
      // Create duplicate with potentially edited name and description
      await database.createConfiguration(config.name, config.description, config.config_data, false);
      await onRefreshList();
      showSuccess(translation.configList.configurationDuplicatedSuccessfully);
    } catch (error) {
      console.error('Error duplicating config:', error);
      showError(translation.configList.errorDuplicatingConfiguration);
    }
  }

  return {
    createConfig,
    deleteConfig,
    setActiveConfig,
    exportSingleConfig,
    duplicateConfig,
  };
}
