import { BiRefresh, BiError } from 'react-icons/bi';

// Partials
import { HostInfoPartial } from '../partials/system/HostInfoPartial';
import { DashboardPartial } from '../partials/system/DashboardPartial';
import { DiskSpacePartial } from '../partials/system/DiskSpacePartial';
import { ResetSystemPartial } from '../partials/system/ResetSystemPartial';
import { ResetModalPartial } from '../partials/system/ResetModalPartial';

// Hooks
import { useLanguage } from '../../contexts/LanguageContext';
import { useControlSize } from '../../hooks/useControlSize';
import { useSystem } from '../../hooks/useSystem';

export function System() {
  const { translation } = useLanguage();
  const controlSize = useControlSize();
  const {
    systemInfo,
    loadingSystemInfo,
    systemInfoError,
    metrics,
    showResetModal,
    setShowResetModal,
    isResetting,
    handleReset,
    updateFrequency,
    setUpdateFrequency,
  } = useSystem();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {translation.system.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {translation.system.subtitle}
        </p>
      </div>

      {loadingSystemInfo ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 text-next-accent">
            <BiRefresh size={16} className="animate-spin" />
            <span className="text-sm">{translation.system.loading}</span>
          </div>
        </div>
      ) : systemInfoError ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <BiError size={16} />
            <span className="text-sm">{translation.system.errorLoading}</span>
          </div>
        </div>
      ) : systemInfo ? (
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
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span className="text-sm">Unable to load system information</span>
          </div>
        </div>
      )}
    </div>
  );
}
