import { useState } from 'react';
import { BiInfoCircle, BiRefresh, BiCheck, BiError, BiFile, BiChevronUp, BiChevronDown } from 'react-icons/bi';
import { PAButton } from '../../controls/PAButton';
import { PACard } from '../../controls/PACard';
import { useLanguage } from '../../../contexts/PALanguageContext';
import { useResponsiveControlSize } from '../../../hooks/useResponsiveControlSize';
import { type VersionInfo } from '../../../lib/version';
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
  const controlSize = useResponsiveControlSize();

  const [newExpanded, setNewExpanded] = useState(false);

  return (
    <PACard
      header={
        <div className="flex items-center gap-2">
          <BiInfoCircle size={20} />
          {translation.about.appVersion}
        </div>
      }
    >
      <div className="space-y-4">
        {checking ? (
          <div className="flex items-center gap-2 text-[var(--rs-primary-500)]">
            <BiRefresh size={16} className="animate-spin" />
            <span className="text-sm">{translation.system.checkingForUpdates}</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[var(--rs-text-secondary)]">{translation.system.currentVersion}:</span>
              <span className="font-mono font-semibold text-[var(--rs-text-primary)]">
                v{versionInfo?.currentVersion || '1.0.0'}
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[var(--rs-text-error)]">
                <BiError size={16} />
                <span className="text-sm">{translation.system.updateError}</span>
              </div>
            )}

            {versionInfo && !error && (
              <div className="space-y-3">
                {versionInfo.updateAvailable ? (
                  <>
                    <div className="flex items-center gap-2 text-[var(--rs-text-warning)]">
                      <BiError size={16} />
                      <span className="text-sm font-semibold">
                        {translation.system.updateAvailable}: v{versionInfo.latestVersion}
                      </span>
                    </div>

                    {versionInfo.releaseNotes && (
                      <div className="bg-[var(--rs-bg-warning)] rounded-[24px] px-3 sm:px-5 py-2 min-h-[48px] border border-[var(--rs-border-warning)]">
                        <div
                          className={`flex justify-between items-center cursor-pointer ${newExpanded ? 'mb-2' : ''}`}
                          onClick={() => setNewExpanded(!newExpanded)}
                        >
                          <div className="flex items-center gap-2 text-[var(--rs-text-warning)]">
                            <BiFile size={14} />
                            <span className="text-base font-semibold">{translation.system.releaseNotes}</span>
                          </div>
                          {newExpanded ? <BiChevronUp size={16} /> : <BiChevronDown size={16} />}
                        </div>
                        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${newExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                          <div className="overflow-hidden">
                            <div className="text-sm text-[var(--rs-text-warning)]">
                              <ReactMarkdown
                                components={{
                                  h1: ({ children }) => <h1 className="text-lg font-semibold mt-8 mb-2 uppercase text-[var(--rs-text-warning)]">{children}</h1>,
                                  h2: ({ children }) => <h2 className="text-base font-semibold mt-8 mb-2 uppercase text-[var(--rs-text-warning)]">{children}</h2>,
                                  h3: ({ children }) => <h3 className="text-sm font-semibold mt-6 mb-1 uppercase text-[var(--rs-text-warning)]">{children}</h3>,
                                  p: ({ children }) => <p className="mb-2">{children}</p>,
                                  ul: ({ children }) => <ul className="list-disc pl-8 mb-2">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal pl-8 mb-2">{children}</ol>,
                                  li: ({ children }) => <li className="mb-1">{children}</li>,
                                }}
                              >
                                {versionInfo.releaseNotes}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <PAButton
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
                    </PAButton>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-[var(--rs-text-success)]">
                    <BiCheck size={16} />
                    <span className="text-sm">{translation.system.upToDate}</span>
                  </div>
                )}
              </div>
            )}

            <PAButton
              onClick={handleCheckForUpdates}
              appearance="default"
              size={controlSize}
              block
              className="flex items-center justify-center gap-2 cursor-pointer"
            >
              <BiRefresh size={16} />
              {translation.system.checkForUpdates}
            </PAButton>
          </>
        )}
      </div>
    </PACard>
  );
}