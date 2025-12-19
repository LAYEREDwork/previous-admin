import { BiInfoCircle, BiRefresh, BiCheck, BiError, BiFile, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { Button } from 'rsuite';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useControlSize } from '../../../hooks/useControlSize';
import { type VersionInfo } from '../../../lib/versionManager';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

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

  const [currentReleaseNotesExpanded, setCurrentReleaseNotesExpanded] = useState(false);
  const [latestReleaseNotesExpanded, setLatestReleaseNotesExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
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
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setCurrentReleaseNotesExpanded(!currentReleaseNotesExpanded)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <BiFile size={14} />
                    <span className="text-xs font-semibold">Current Release Notes</span>
                  </div>
                  {currentReleaseNotesExpanded ? <BiChevronUp size={16} /> : <BiChevronDown size={16} />}
                </button>
                {currentReleaseNotesExpanded && (
                  <div className="px-3 pb-3">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{versionInfo.currentReleaseNotes}</ReactMarkdown>
                    </div>
                  </div>
                )}
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
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                        <button
                          onClick={() => setLatestReleaseNotesExpanded(!latestReleaseNotesExpanded)}
                          className="w-full flex items-center justify-between p-3 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                            <BiFile size={14} />
                            <span className="text-xs font-semibold">New Release Notes</span>
                          </div>
                          {latestReleaseNotesExpanded ? <BiChevronUp size={16} /> : <BiChevronDown size={16} />}
                        </button>
                        {latestReleaseNotesExpanded && (
                          <div className="px-3 pb-3">
                            <div className="prose prose-sm dark:prose-invert max-w-none prose-amber">
                              <ReactMarkdown>{versionInfo.releaseNotes}</ReactMarkdown>
                            </div>
                          </div>
                        )}
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