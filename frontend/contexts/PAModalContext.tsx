import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

import { PAModal } from '@frontend/components/controls/PAModal';
import { PAModalType, PAModalButton, PAModalButtonType } from '@frontend/lib/types/modal';

import { useLanguage } from './PALanguageContext';

export interface ModalConfig {
  title: string;
  message: string;
  type: PAModalType;
  buttons: PAModalButton[];
  headerIcon?: ReactNode;
}

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showConfirm: (message: string, onConfirm: () => void, onCancel?: () => void, title?: string) => void;
  showConfirmAdvanced: (options: {
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    title?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmType?: PAModalButtonType;
    type?: PAModalType;
  }) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function PAModalProvider({ children }: { children: ReactNode }) {
  const { translation } = useLanguage();
  const [currentModal, setCurrentModal] = useState<ModalConfig | null>(null);

  const closeModal = useCallback(() => {
    setCurrentModal(null);
  }, []);

  const showModal = useCallback((config: ModalConfig) => {
    setCurrentModal(config);
  }, []);

  const showSuccess = useCallback(
    (message: string, title?: string) => {
      showModal({
        title: title || translation.common.success,
        message,
        type: PAModalType.confirmation,
        buttons: [
          {
            label: translation.common.ok,
            type: PAModalButtonType.default,
            onClick: closeModal,
          },
        ],
      });
    },
    [showModal, translation.common.success, translation.common.ok, closeModal]
  );

  const showError = useCallback(
    (message: string, title?: string) => {
      showModal({
        title: title || translation.common.error,
        message,
        type: PAModalType.error,
        buttons: [
          {
            label: translation.common.close,
            type: PAModalButtonType.default,
            onClick: closeModal,
          },
        ],
      });
    },
    [showModal, translation.common.error, translation.common.close, closeModal]
  );

  const showWarning = useCallback(
    (message: string, title?: string) => {
      showModal({
        title: title || translation.common.warning,
        message,
        type: PAModalType.alert,
        buttons: [
          {
            label: translation.common.ok,
            type: PAModalButtonType.default,
            onClick: closeModal,
          },
        ],
      });
    },
    [showModal, translation.common.warning, translation.common.ok, closeModal]
  );

  const showInfo = useCallback(
    (message: string, title?: string) => {
      showModal({
        title: title || translation.common.info,
        message,
        type: PAModalType.info,
        buttons: [
          {
            label: translation.common.ok,
            type: PAModalButtonType.default,
            onClick: closeModal,
          },
        ],
      });
    },
    [showModal, translation.common.info, translation.common.ok, closeModal]
  );

  const showConfirm = useCallback(
    (message: string, onConfirm: () => void, onCancel?: () => void, title?: string) => {
      showConfirmAdvanced({
        message,
        onConfirm,
        onCancel,
        title,
      });
    },
    [showConfirmAdvanced]
  );

  const showConfirmAdvanced = useCallback(
    ({
      message,
      onConfirm,
      onCancel,
      title,
      confirmLabel,
      cancelLabel,
      confirmType = PAModalButtonType.default,
      type = PAModalType.alert,
    }: {
      message: string;
      onConfirm: () => void;
      onCancel?: () => void;
      title?: string;
      confirmLabel?: string;
      cancelLabel?: string;
      confirmType?: PAModalButtonType;
      type?: PAModalType;
    }) => {
      showModal({
        title: title || translation.common.confirmation,
        message,
        type,
        buttons: [
          {
            label: cancelLabel || translation.common.cancel,
            type: PAModalButtonType.cancel,
            onClick: () => {
              onCancel?.();
              closeModal();
            },
          },
          {
            label: confirmLabel || translation.common.confirm,
            type: confirmType,
            onClick: () => {
              onConfirm();
              closeModal();
            },
          },
        ],
      });
    },
    [showModal, translation.common.confirmation, translation.common.cancel, translation.common.confirm, closeModal]
  );

  return (
    <ModalContext.Provider
      value={{ showModal, showSuccess, showError, showWarning, showInfo, showConfirm, showConfirmAdvanced, closeModal }}
    >
      {children}
      {currentModal && (
        <PAModal
          type={currentModal.type}
          headerIcon={currentModal.headerIcon}
          buttons={currentModal.buttons}
          onClose={closeModal}
          open={true}
        >
          <PAModal.Title>{currentModal.title}</PAModal.Title>
          <PAModal.Body>
            {currentModal.message}
          </PAModal.Body>
        </PAModal>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within PAModalProvider');
  }
  return context;
}
