
// Hooks
import { useLanguage } from '@frontend/contexts/PALanguageContext';
import { useResponsiveControlSize } from '@frontend/hooks/useResponsiveControlSize';
import { useSystem } from '@frontend/hooks/useSystem';

import { SystemContent } from './PASystemContent';
import { SystemEmptyState } from './PASystemEmptyState';
import { SystemErrorState } from './PASystemErrorState';
import { SystemLoadingState } from './PASystemLoadingState';
import { SystemPageHeader } from './PASystemPageHeader';

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
