import type { Translations } from '@frontend/lib/translations';
import { PASize } from '@frontend/lib/types/sizes';

import { SystemInfo } from '../../../../shared/previous-config/types';
import { DiskSpacePartial } from '../../partials/system/PADiskSpacePartial';
import { HostInfoPartial } from '../../partials/system/PAHostInfoPartial';
import { ResetModalPartial } from '../../partials/system/PAResetModalPartial';
import { ResetSystemPartial } from '../../partials/system/PAResetSystemPartial';

interface SystemContentProps {
  systemInfo: SystemInfo;
  showResetModal: boolean;
  setShowResetModal: (show: boolean) => void;
  isResetting: boolean;
  handleReset: () => void;
  controlSize: PASize;
  translation: Translations;
  isSystemTabActive?: boolean;
}

/**
 * Main content component for the system page containing all system information sections
 */
export function SystemContent({
  systemInfo,
  showResetModal,
  setShowResetModal,
  isResetting,
  handleReset,
  controlSize,
  translation,
}: SystemContentProps) {
  return (
    <div className="space-y-6">
      {/* Host Information */}
      <HostInfoPartial
        systemInfo={systemInfo}
        translation={translation}
      />

      {/* Dashboard removed per user request */}

      {/* Disk Space */}
      <DiskSpacePartial
        disks={systemInfo.disks}
        translation={translation}
      />

      {/* Reset System Section */}
      <ResetSystemPartial
        onResetClick={() => setShowResetModal(true)}
        isResetting={isResetting}
        controlSize={controlSize}
        translation={translation}
      />

      {/* Reset Confirmation Modal */}
      <ResetModalPartial
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
        isResetting={isResetting}
        controlSize={controlSize}
        translation={translation}
      />
    </div>
  );
}