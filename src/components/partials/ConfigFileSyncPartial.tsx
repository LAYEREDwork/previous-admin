import { useState } from 'react';
import { BiRefresh, BiUpload, BiDownload, BiCheck, BiInfoCircle } from 'react-icons/bi';
import { database } from '../../lib/database';
import { syncConfigToFile, loadConfigFromFile } from '../../lib/configFileSync';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export function ConfigFileSyncPartial() {
  const { userId } = useAuth();
  const { translation } = useLanguage();
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  async function handleSyncToFile() {
    setSyncing(true);
    setMessage(null);

    try {
      const configs = await database.getConfigurations();
      const activeConfig = configs.find((c) => c.is_active);

      if (!activeConfig) {
        setMessage({ type: 'error', text: translation.importExport.noActiveConfig });
        return;
      }

      const success = await syncConfigToFile(activeConfig.config_data);

      if (success) {
        setMessage({
          type: 'success',
          text: translation.importExport.syncSuccess,
        });
      } else {
        setMessage({ type: 'error', text: translation.importExport.syncError });
      }
    } catch (error) {
      console.error('Error syncing to file:', error);
      setMessage({ type: 'error', text: translation.importExport.importError });
    } finally {
      setSyncing(false);
    }
  }

  async function handleLoadFromFile() {
    setLoading(true);
    setMessage(null);

    try {
      const configData = await loadConfigFromFile();

      if (!configData) {
        setMessage({ type: 'error', text: translation.importExport.importError });
        return;
      }

      await database.createConfiguration(
        'Imported from Previous',
        'Configuration imported from Previous emulator config file',
        configData,
        false,
        userId
      );

      setMessage({
        type: 'success',
        text: translation.importExport.importSuccess,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error loading from file:', error);
      setMessage({ type: 'error', text: translation.importExport.importError });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center">
          <BiRefresh size={20} className="text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {translation.importExport.syncTitle}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {translation.importExport.syncPath}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <button
          onClick={handleSyncToFile}
          disabled={syncing}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
        >
          <BiUpload size={18} />
          {syncing ? translation.importExport.syncing : translation.importExport.syncToEmulator}
        </button>

        <button
          onClick={handleLoadFromFile}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
        >
          <BiDownload size={18} />
          {loading ? translation.importExport.loading : translation.importExport.importFromEmulator}
        </button>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <BiCheck size={18} />
          ) : (
            <BiInfoCircle size={18} />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
        <p className="text-xs text-cyan-800 dark:text-cyan-300">
          {translation.importExport.syncHelpApply}
          <br />
          {translation.importExport.syncHelpImport}
        </p>
      </div>
    </div>
  );
}
