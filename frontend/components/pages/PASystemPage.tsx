
// Hooks
import { useLanguage } from '../../contexts/PALanguageContext';
import { useResponsiveControlSize } from '../../hooks/useResponsiveControlSize';
import { useSystem } from '../../hooks/useSystem';

import { SystemContent } from './system/PASystemContent';
import { SystemEmptyState } from './system/PASystemEmptyState';
import { SystemErrorState } from './system/PASystemErrorState';
import { SystemLoadingState } from './system/PASystemLoadingState';
import { SystemPageHeader } from './system/PASystemPageHeader';

export function PASystem() {
  const { translation } = useLanguage();
  const controlSize = useResponsiveControlSize();
  const {
    systemInfo,
    loadingSystemInfo,
    systemInfoError,
    showResetModal,
    setShowResetModal,
    isResetting,
    handleReset,
    isSystemTabActive,
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
          showResetModal={showResetModal}
          setShowResetModal={setShowResetModal}
          isResetting={isResetting}
          handleReset={handleReset}
          controlSize={controlSize}
          translation={translation}
          isSystemTabActive={isSystemTabActive}
        />
      ) : (
        <SystemEmptyState />
      )}
    </div>
  );
}
