import { useState, useEffect } from 'react';

import { useLanguage } from '@frontend/contexts/PALanguageContext';
import { useResponsiveControlSize } from '@frontend/hooks/useResponsiveControlSize';
import { database, Configuration } from '@frontend/lib/database';
import { PASize } from '@frontend/lib/types/sizes';
import { PAButton } from '@frontend/components/controls/PAButton';
import { PACard } from '@frontend/components/controls/PACard';
import { 
  SFArrowTrianglehead2ClockwiseRotate90Circle, 
  SFCheckmarkSealFill, 
  SFInfoCircleFill, 
  SFTrayAndArrowDownFill, 
  SFTrayAndArrowUpFill 
} from '@frontend/components/sf-symbols';

export function ConfigFileSyncPartial() {
  const { translation } = useLanguage();
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<Configuration[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const controlSize = useResponsiveControlSize(PASize.lg);

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
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--rs-border-info), transparent 85%)' }}>
            <SFArrowTrianglehead2ClockwiseRotate90Circle size={23} className="text-[var(--rs-text-info)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--rs-text-primary)] m-0 leading-none">
              {translation.importExport.syncTitle}
            </h3>
            <p className="text-sm text-[var(--rs-text-secondary)] mt-1">
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
          <SFTrayAndArrowUpFill size={18} />
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
          <SFTrayAndArrowDownFill size={18} />
          {loading ? translation.importExport.loading : translation.importExport.importFromEmulator}
        </PAButton>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg border ${message.type === 'success'
            ? 'border-[var(--rs-border-success)]'
            : 'border-[var(--rs-border-error)]'
            }`}
          style={{
            backgroundColor: message.type === 'success'
              ? 'color-mix(in srgb, var(--rs-border-success), transparent 92%)'
              : 'color-mix(in srgb, var(--rs-border-error), transparent 92%)',
            color: message.type === 'success'
              ? 'var(--rs-text-success)'
              : 'var(--rs-text-error)'
          }}
        >
          {message.type === 'success' ? (
            <SFCheckmarkSealFill size={18} />
          ) : (
            <SFInfoCircleFill size={18} />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <PACard bgColorScheme="info" className="mt-4">
        <p className="text-xs text-[var(--rs-text-info)]">
          {translation.importExport.syncHelpApply}
          <br />
          {translation.importExport.syncHelpImport}
        </p>
      </PACard>
    </PACard>
  );
}
