import { useContext } from 'react';

import { ModalContext, type ModalContextType } from '@frontend/contexts/PAModalContext';

/**
 * Hook: useModal
 * Returns typed modal context helpers (showSuccess, showError, showConfirm, etc.).
 * Throws if used outside of `PAModalProvider`.
 */
export function useModal(): ModalContextType {
  const context = useContext(ModalContext) as ModalContextType | undefined;
  if (!context) {
    throw new Error('useModal must be used within PAModalProvider');
  }
  return context;
}
