import { useState, useEffect } from 'react';
import { BiDownload, BiUpload, BiFile, BiData } from 'react-icons/bi';
import { database } from '../../lib/database';
import { ConfigFileSyncPartial } from '../partials/ConfigFileSyncPartial';
import { downloadFile, generateConfigFilename } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Button } from 'rsuite';
import { useControlSize } from '../../hooks/useControlSize';
import type { Configuration } from '../../lib/types';

export function ImportExport() {
  const { translation } = useLanguage();
  const { showSuccess, showError, showWarning } = useNotification();
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [databaseExporting, setDatabaseExporting] = useState(false);
  const [databaseImporting, setDatabaseImporting] = useState(false);
  const [configs, setConfigs] = useState<Configuration[]>([]);

  const controlSize = useControlSize('lg');

  useEffect(() => {
    database.getConfigurations().then(setConfigs);
  }, []);

  async function exportConfig() {
    setExporting(true);
    try {
      const configs = await database.getConfigurations();
      const activeConfig = configs.find((config) => config.is_active);

      if (!activeConfig) { return; }

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

  async function exportAllConfigs() {
    setExporting(true);
    try {
      const data = await database.getConfigurations();

      if (!data || data.length === 0) {
        showWarning(translation.importExport.noConfigsToExport);
        return;
      }

      const exportData = {
        configurations: data.map((config) => ({
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
      window.location.reload();
    } catch (error) {
      console.error('Error importing configs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(translation.importExport.importFailed.replace('{error}', errorMessage));
    } finally {
      setImporting(false);
    }
  }

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
      window.location.reload();
    } catch (error) {
      console.error('Error importing database:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(translation.importExport.databaseImportError.replace('{error}', errorMessage));
    } finally {
      setDatabaseImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {translation.importExport.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {translation.importExport.description}
        </p>
      </div>

      <ConfigFileSyncPartial />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center">
              <BiDownload size={20} className="text-next-accent" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {translation.importExport.import}
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {translation.importExport.importDescription}
          </p>

          <label className="block">
            <input
              type="file"
              accept=".json"
              multiple
              onChange={importConfig}
              disabled={importing}
              className="hidden"
              id="import-file"
            />
            <Button
              as="span"
              appearance="primary"
              loading={importing}
              block
              className="flex items-center justify-center gap-2 cursor-pointer"
              size={controlSize}
            >
              <BiFile size={18} />
              {importing ? translation.importExport.importing : translation.importExport.selectConfigFile}
            </Button>
          </label>

          <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
            <p className="text-xs text-cyan-800 dark:text-cyan-300">
              {translation.importExport.importDescription}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <BiUpload size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {translation.importExport.export}
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {translation.importExport.exportDescription}
          </p>

          <div className="space-y-3">
            <Button
              onClick={exportConfig}
              disabled={exporting || !configs.find(config => config.is_active)}
              loading={exporting}
              appearance="primary"
              color="green"
              block
              className="flex items-center justify-center gap-2"
              size={controlSize}
            >
              <BiUpload size={18} />
              {exporting ? translation.importExport.exporting : translation.importExport.exportActiveConfig}
            </Button>

            <Button
              onClick={exportAllConfigs}
              disabled={exporting || configs.length === 0}
              loading={exporting}
              appearance="default"
              block
              className="flex items-center justify-center gap-2"
              size={controlSize}
            >
              <BiUpload size={18} />
              {exporting ? translation.importExport.exporting : translation.importExport.exportAllConfigs}
            </Button>
          </div>

          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-green-800 dark:text-green-300">
              {translation.importExport.exportDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
          {translation.importExport.notesTitle}
        </h4>
        <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1 list-disc list-inside">
          <li>{translation.importExport.note1}</li>
          <li>{translation.importExport.note2}</li>
          <li>{translation.importExport.note3}</li>
          <li>{translation.importExport.note4}</li>
        </ul>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {translation.importExport.databaseTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {translation.importExport.databaseDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BiData size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {translation.importExport.importDatabase}
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {translation.importExport.importDatabaseDescription}
            </p>

            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={importDatabaseDump}
                disabled={databaseImporting}
                className="hidden"
                id="import-database"
              />
              <Button
                as="span"
                appearance="primary"
                loading={databaseImporting}
                block
                className="flex items-center justify-center gap-2 cursor-pointer"
                size={controlSize}
              >
                <BiFile size={18} />
                {databaseImporting ? translation.importExport.importingDatabase : translation.importExport.selectDatabaseFile}
              </Button>
            </label>

            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-xs text-red-800 dark:text-red-300 font-semibold">
                {translation.importExport.warningReplaceAll}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BiData size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {translation.importExport.exportDatabase}
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {translation.importExport.exportDatabaseDescription}
            </p>

            <Button
              onClick={exportDatabaseDump}
              disabled={databaseExporting}
              loading={databaseExporting}
              appearance="primary"
              color="blue"
              block
              className="flex items-center justify-center gap-2"
              size={controlSize}
            >
              <BiUpload size={18} />
              {databaseExporting ? translation.importExport.exportingDatabase : translation.importExport.exportCompleteDatabase}
            </Button>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                {translation.importExport.exportsAllData}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
