import { SystemPageHeader } from './system/PASystemPageHeader';
import { SystemLoadingState } from './system/PASystemLoadingState';
import { SystemErrorState } from './system/PASystemErrorState';
import { SystemContent } from './system/PASystemContent';
import { SystemEmptyState } from './system/PASystemEmptyState';

// Hooks
import { useLanguage } from '../../contexts/PALanguageContext';
import { useControlSize } from '../../hooks/useControlSize';
import { useSystem } from '../../hooks/useSystem';

export function PASystem() {
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
      <SystemPageHeader translation={translation} />

      {loadingSystemInfo ? (
        <SystemLoadingState translation={translation} />
      ) : systemInfoError ? (
        <SystemErrorState translation={translation} />
      ) : systemInfo ? (
        <SystemContent
          systemInfo={systemInfo}
          metrics={metrics}
          showResetModal={showResetModal}
          setShowResetModal={setShowResetModal}
          isResetting={isResetting}
          handleReset={handleReset}
          updateFrequency={updateFrequency}
          setUpdateFrequency={setUpdateFrequency}
          controlSize={controlSize}
          translation={translation}
        />
      ) : (
        <SystemEmptyState />
      )}
    </div>
  );
}
