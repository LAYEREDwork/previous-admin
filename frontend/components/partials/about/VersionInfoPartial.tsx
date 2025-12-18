import { BiInfoCircle, BiRefresh, BiCheck, BiError, BiFile } from 'react-icons/bi';
import { Button } from 'rsuite';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useControlSize } from '../../../hooks/useControlSize';
import { type VersionInfo } from '../../../lib/versionManager';

interface VersionInfoPartialProps {
  versionInfo: VersionInfo | null;
  checking: boolean;
  updating: boolean;
  error: boolean;
  handleCheckForUpdates: () => void;
  handleUpdate: () => void;
}

/**
 * Partial component for displaying version information and update functionality.
 */
export function VersionInfoPartial({
  versionInfo,
  checking,
  updating,
  error,
  handleCheckForUpdates,
  handleUpdate,
}: VersionInfoPartialProps) {
  const { translation } = useLanguage();
  const controlSize = useControlSize();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <BiInfoCircle size={20} />
        {translation.about.appVersion}
      </h3>
      <div className="space-y-4">
        {checking ? (
          <div className="flex items-center gap-2 text-next-accent">
            <BiRefresh size={16} className="animate-spin" />
            <span className="text-sm">{translation.system.checkingForUpdates}</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{translation.system.currentVersion}:</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-white">
                v{versionInfo?.currentVersion || '1.0.0'}
              </span>
            </div>

            {versionInfo?.currentReleaseNotes && (
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                  <BiFile size={14} />
                  <span className="text-xs font-semibold">Current Release Notes</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {versionInfo.currentReleaseNotes}
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <BiError size={16} />
                <span className="text-sm">{translation.system.updateError}</span>
              </div>
            )}

            {versionInfo && !error && (
              <div className="space-y-3">
                {versionInfo.updateAvailable ? (
                  <>
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <BiError size={16} />
                      <span className="text-sm font-semibold">
                        {translation.system.updateAvailable}: v{versionInfo.latestVersion}
                      </span>
                    </div>

                    {versionInfo.releaseNotes && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
                          <BiFile size={14} />
                          <span className="text-xs font-semibold">New Release Notes</span>
                        </div>
                        <p className="text-xs text-amber-600 dark:text-amber-400 whitespace-pre-wrap">
                          {versionInfo.releaseNotes}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={handleUpdate}
                      disabled={updating}
                      loading={updating}
                      appearance="primary"
                      color="orange"
                      size={controlSize}
                      block
                      className="flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BiRefresh size={16} />
                      {updating ? translation.system.updating : translation.system.updateNow}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <BiCheck size={16} />
                    <span className="text-sm">{translation.system.upToDate}</span>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleCheckForUpdates}
              appearance="default"
              size={controlSize}
              block
              className="flex items-center justify-center gap-2 cursor-pointer"
            >
              <BiRefresh size={16} />
              {translation.system.checkForUpdates}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}