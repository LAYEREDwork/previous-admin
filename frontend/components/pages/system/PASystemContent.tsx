import { HostInfoPartial } from '../../partials/system/PAHostInfoPartial';
import { DashboardPartial } from '../../partials/system/PADashboardPartial';
import { DiskSpacePartial } from '../../partials/system/PADiskSpacePartial';
import { ResetSystemPartial } from '../../partials/system/PAResetSystemPartial';
import { ResetModalPartial } from '../../partials/system/PAResetModalPartial';
import { Metrics } from '../../../hooks/useSystemMetrics';
import { SystemInfo } from '../../../../shared/types';
import type { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';

interface SystemContentProps {
  systemInfo: SystemInfo;
  metrics: Metrics | null;
  showResetModal: boolean;
  setShowResetModal: (show: boolean) => void;
  isResetting: boolean;
  handleReset: () => void;
  updateFrequency: number;
  setUpdateFrequency: (freq: number) => void;
  controlSize: PASize;
  translation: Translations;
}

/**
 * Main content component for the system page containing all system information sections
 */
export function SystemContent({
  systemInfo,
  metrics,
  showResetModal,
  setShowResetModal,
  isResetting,
  handleReset,
  updateFrequency,
  setUpdateFrequency,
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

      {/* Server Dashboard */}
      <DashboardPartial
        metrics={metrics}
        updateFrequency={updateFrequency}
        setUpdateFrequency={setUpdateFrequency}
        translation={translation}
      />

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