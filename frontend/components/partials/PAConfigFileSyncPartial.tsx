import { useState, useEffect } from 'react';
import { BiRefresh, BiUpload, BiDownload, BiCheck, BiInfoCircle } from 'react-icons/bi';
import { database, Configuration } from '../../lib/database';
import { useLanguage } from '../../contexts/PALanguageContext';
import { PAButton } from '../controls/PAButton';
import { useResponsiveControlSize } from '../../hooks/useResponsiveControlSize';
import { PACard } from '../controls/PACard';

export function ConfigFileSyncPartial() {
  const { translation } = useLanguage();
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<Configuration[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const controlSize = useResponsiveControlSize('lg');

  useEffect(() => {
    database.getConfigurations().then(setConfigs);
  }, []);

  async function handleSyncToFile() {
    setSyncing(true);
    setMessage(null);

    try {
      const configs = await database.getConfigurations();
      const activeConfig = configs.find((config) => config.is_active);

      if (!activeConfig) {
        setMessage({ type: 'error', text: translation.importExport.noActiveConfig });
        return;
      }

      setMessage({
        type: 'error',
        text: 'Sync to emulator is currently disabled',
      });
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
      setMessage({
        type: 'error',
        text: 'Import from emulator is currently disabled',
      });
    } catch (error) {
      console.error('Error loading from file:', error);
      setMessage({ type: 'error', text: translation.importExport.importError });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PACard
      header={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--rs-bg-info)] rounded-lg flex items-center justify-center">
            <BiRefresh size={20} className="text-[var(--rs-text-info)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--rs-text-primary)]">
              {translation.importExport.syncTitle}
            </h3>
            <p className="text-sm text-[var(--rs-text-secondary)]">
              ~/.config/previous/previous.cfg
            </p>
          </div>
        </div>
      }
    >
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <PAButton
          onClick={handleSyncToFile}
          disabled={syncing || !configs.find(config => config.is_active)}
          loading={syncing}
          appearance="primary"
          className="flex items-center justify-center gap-2"
          size={controlSize}
        >
          <BiUpload size={18} />
          {syncing ? translation.importExport.syncing : translation.importExport.syncToEmulator}
        </PAButton>

        <PAButton
          onClick={handleLoadFromFile}
          disabled={loading}
          loading={loading}
          appearance="default"
          className="flex items-center justify-center gap-2"
          size={controlSize}
        >
          <BiDownload size={18} />
          {loading ? translation.importExport.loading : translation.importExport.importFromEmulator}
        </PAButton>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg ${message.type === 'success'
            ? 'bg-[var(--rs-bg-success)] text-[var(--rs-text-success)]'
            : 'bg-[var(--rs-bg-error)] text-[var(--rs-text-error)]'
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

      <div className="mt-4 p-3 bg-[var(--rs-bg-info)] rounded-lg">
        <p className="text-xs text-[var(--rs-text-info)]">
          {translation.importExport.syncHelpApply}
          <br />
          {translation.importExport.syncHelpImport}
        </p>
      </div>
    </PACard>
  );
}
