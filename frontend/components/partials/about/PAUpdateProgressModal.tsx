import { Progress } from 'rsuite';

import { PAModal } from '@frontend/components/controls/PAModal';
import {
  SFArrowTrianglehead2ClockwiseRotate90,
  SFCheckmarkSeal,
  SFExclamationmarkBubbleFill
} from '@frontend/components/sf-symbols';
import { useLanguage } from '@frontend/contexts/PALanguageContext';
import { type UpdateStatus } from '@frontend/lib/version';

interface UpdateProgressModalProps {
  open: boolean;
  updateStatus: UpdateStatus | null;
  onClose?: () => void;
}

/**
 * Modal component for displaying real-time update progress.
 * Shows progress bar, current status message, and version being installed.
 */
export function UpdateProgressModal({
  open,
  updateStatus,
  onClose,
}: UpdateProgressModalProps) {
  const { translation } = useLanguage();

  // Determine if modal can be closed (only on error or completion)
  const canClose = updateStatus?.status === 'error' || updateStatus?.status === 'completed';

  // Determine progress bar status
  const progressStatus = updateStatus?.status === 'error' ? 'fail' :
                         updateStatus?.status === 'completed' ? 'success' : 'active';

  // Determine header icon based on status
  const getHeaderIcon = () => {
    if (updateStatus?.status === 'completed') {
      return <SFCheckmarkSeal size={42} className="text-[var(--rs-green-600)]" />;
    }
    if (updateStatus?.status === 'error') {
      return <SFExclamationmarkBubbleFill size={42} className="text-[var(--rs-red-600)]" />;
    }
    return <SFArrowTrianglehead2ClockwiseRotate90 size={42} className="animate-spin text-[var(--rs-primary-500)]" />;
  };

  // Get title based on status
  const getTitle = () => {
    if (updateStatus?.status === 'completed') {
      return translation.system.updateComplete;
    }
    if (updateStatus?.status === 'error') {
      return translation.system.updateError;
    }
    return translation.system.updating;
  };

  return (
    <PAModal
      open={open}
      onClose={canClose ? onClose : undefined}
      headerIcon={getHeaderIcon()}
      backdrop={canClose ? true : 'static'}
      keyboard={canClose}
    >
      <PAModal.Header>
        <PAModal.Title>{getTitle()}</PAModal.Title>
      </PAModal.Header>

      <PAModal.Body>
        <div className="space-y-4 min-w-[350px]">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--rs-text-secondary)]">
                {updateStatus?.message || 'Initializing...'}
              </span>
              <span className="font-mono text-[var(--rs-text-primary)]">
                {updateStatus?.progress || 0}%
              </span>
            </div>
            <Progress.Line
              percent={updateStatus?.progress || 0}
              status={progressStatus}
              showInfo={false}
              strokeColor={
                updateStatus?.status === 'error' ? 'var(--rs-red-500)' :
                updateStatus?.status === 'completed' ? 'var(--rs-green-500)' :
                'var(--rs-primary-500)'
              }
            />
          </div>

          {/* Version being installed */}
          {updateStatus?.version && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--rs-text-secondary)]">
                {translation.system.installingVersion}:
              </span>
              <span className="font-mono font-semibold text-[var(--rs-text-primary)]">
                v{updateStatus.version}
              </span>
            </div>
          )}

          {/* Success message */}
          {updateStatus?.status === 'completed' && (
            <div className="flex items-center gap-2 text-[var(--rs-green-600)] p-3 bg-[var(--rs-green-50)] dark:bg-[var(--rs-green-900)] rounded">
              <SFCheckmarkSeal size={20} />
              <span className="text-sm">{translation.system.updateComplete}</span>
            </div>
          )}

          {/* Error message */}
          {updateStatus?.error && (
            <div className="flex items-center gap-2 text-[var(--rs-red-600)] p-3 bg-[var(--rs-red-50)] dark:bg-[var(--rs-red-900)] rounded">
              <SFExclamationmarkBubbleFill size={20} />
              <span className="text-sm">{updateStatus.error}</span>
            </div>
          )}
        </div>
      </PAModal.Body>
    </PAModal>
  );
}
