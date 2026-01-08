
// Hooks
import { PageWrapper } from '@frontend/components/controls/PAPageWrapper';
import { usePageBase } from '@frontend/hooks/usePageBase';
import { useSystem } from '@frontend/hooks/useSystem';

import { SystemContent } from './PASystemContent';
import { SystemEmptyState } from './PASystemEmptyState';
import { SystemErrorState } from './PASystemErrorState';
import { SystemLoadingState } from './PASystemLoadingState';
import { SystemPageHeader } from './PASystemPageHeader';

export function PASystem() {
  const { translation, controlSize } = usePageBase();
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
    <PageWrapper>
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
    </PageWrapper>
  );
}
