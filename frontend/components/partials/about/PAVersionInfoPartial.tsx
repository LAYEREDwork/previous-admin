import ReactMarkdown from 'react-markdown';

import { useLanguage } from '../../../contexts/PALanguageContext';
import { useResponsiveControlSize } from '../../../hooks/useResponsiveControlSize';
import { type VersionInfo } from '../../../lib/version';
import { PAButton } from '../../controls/PAButton';
import { PACard } from '../../controls/PACard';
import { 
  SFArrowTrianglehead2ClockwiseRotate90, 
  SFCheckmarkSeal, 
  SFDocumentOnDocumentFill, 
  SFExclamationmarkBubbleFill, 
  SFInfoBubbleFill
} from '../../sf-symbols';

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

  return (
    <PACard
      header={
        <div className="flex items-center gap-2 m-0 leading-none">
          <SFInfoBubbleFill size={20} />
          {translation.about.appVersion}
        </div>
      }
    >
      <div className="space-y-4">
        {checking ? (
          <div className="flex items-center gap-2 text-[var(--rs-primary-500)]">
            <SFArrowTrianglehead2ClockwiseRotate90 size={16} className="animate-spin" />
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
                <SFExclamationmarkBubbleFill size={20} />
                <span className="text-sm">{translation.system.updateError}</span>
              </div>
            )}

            {versionInfo && !error && (
              <div className="space-y-3">
                {versionInfo.updateAvailable ? (
                  <>
                    <div className="flex items-center gap-2 text-[var(--rs-message-warning-border)]">
                      <SFExclamationmarkBubbleFill size={26} />
                      <span className="text-sm font-semibold">
                        {translation.system.updateAvailable}: v{versionInfo.latestVersion}
                      </span>
                    </div>

                    {versionInfo.releaseNotes && (
                      <PACard
                        bgColorScheme='warning'
                        collapsible
                        defaultExpanded={false}
                        header={
                          <div className="flex items-center gap-2">
                            <SFDocumentOnDocumentFill size={18} />
                            <span className="font-semibold">{translation.system.releaseNotes}</span>
                          </div>
                        }
                      >
                        <div className="text-xs text-[var(--rs-text-primary)]">
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => <h1 className="text-xs font-medium mt-0 mb-2 uppercase text-[var(--rs-text-primary)]">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-xs font-medium mt-0 mb-2 uppercase text-[var(--rs-text-primary)]">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-xs font-medium mt-6 mb-1 uppercase text-[var(--rs-text-primary)]">{children}</h3>,
                              p: ({ children }) => <p className="mb-2">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc pl-8 mb-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-8 mb-2">{children}</ol>,
                              li: ({ children }) => <li className="mb-1">{children}</li>,
                            }}
                          >
                            {versionInfo.releaseNotes}
                          </ReactMarkdown>
                        </div>
                      </PACard>
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
                      <SFArrowTrianglehead2ClockwiseRotate90 size={18} />
                      {updating ? translation.system.updating : translation.system.updateNow}
                    </PAButton>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-[var(--rs-text-success)]">
                    <SFCheckmarkSeal size={20} />
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
              <SFArrowTrianglehead2ClockwiseRotate90 size={18} />
              {translation.system.checkForUpdates}
            </PAButton>
          </>
        )}
      </div>
    </PACard>
  );
}