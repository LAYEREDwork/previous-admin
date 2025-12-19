import { BiInfoCircle, BiRefresh, BiCheck, BiError, BiFile, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { Button } from 'rsuite';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useControlSize } from '../../../hooks/useControlSize';
import { type VersionInfo } from '../../../lib/versionManager';
import { useState } from 'react';
import { CenteredModal } from '../../controls/CenteredModal';
import ReactMarkdown from 'react-markdown';

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

  const [currentReleaseNotesCollapsed, setCurrentReleaseNotesCollapsed] = useState(true);
  const [newReleaseNotesCollapsed, setNewReleaseNotesCollapsed] = useState(true);

  // Custom components for ReactMarkdown styling
  const markdownComponents = {
    h1: ({ children }: any) => <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-10 mb-2">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-2">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-base font-bold text-gray-900 dark:text-white mt-6 mb-1">{children}</h3>,
    p: ({ children }: any) => <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">{children}</p>,
    strong: ({ children }: any) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-gray-700 dark:text-gray-300">{children}</em>,
    code: ({ children }: any) => <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-900 dark:text-gray-100">{children}</code>,
    pre: ({ children }: any) => <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-2 overflow-x-auto">{children}</pre>,
    ul: ({ children }: any) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
    li: ({ children }: any) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 mb-2">{children}</blockquote>,
  };

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
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setCurrentReleaseNotesCollapsed(!currentReleaseNotesCollapsed)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors w-full text-left"
                >
                  {currentReleaseNotesCollapsed ? <BiChevronDown size={14} /> : <BiChevronUp size={14} />}
                  <span className="text-xs font-semibold">Current Release Notes</span>
                </button>
                {!currentReleaseNotesCollapsed && (
                  <div className="mt-2">
                    <ReactMarkdown components={markdownComponents}>
                      {versionInfo.currentReleaseNotes}
                    </ReactMarkdown>
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
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                        <button
                          onClick={() => setNewReleaseNotesCollapsed(!newReleaseNotesCollapsed)}
                          className="flex items-center justify-between w-full text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
                        >
                          <span className="text-xs font-semibold">New Release Notes</span>
                          {newReleaseNotesCollapsed ? <BiChevronDown size={14} /> : <BiChevronUp size={14} />}
                        </button>
                        {!newReleaseNotesCollapsed && (
                          <div className="mt-2">
                            <ReactMarkdown components={markdownComponents}>
                              {versionInfo.releaseNotes}
                            </ReactMarkdown>
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

      {/* Update Progress Modal */}
      <CenteredModal
        isOpen={updating}
        onClose={() => {}} // Prevent closing during update
        title={translation.system.updating}
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center gap-3">
            <BiRefresh size={24} className="animate-spin text-next-accent" />
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {translation.system.updating}
            </span>
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>{translation.system.updateInProgress}</p>
            <p className="mt-2 text-xs">
              Please do not close this window or navigate away.
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-next-accent h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </CenteredModal>
    </div>
  );
}