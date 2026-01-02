/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BiCheckCircle, BiXCircle, BiError, BiInfoCircle } from 'react-icons/bi';
import { useLanguage } from './PALanguageContext';

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface AlertButton {
  label: string;
  onClick?: () => void;
  action?: 'close';
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface Alert {
  id: string;
  message: string;
  type: AlertType;
  buttons?: AlertButton[];
  onClose?: () => void;
}

interface NotificationContextType {
  showAlert: (message: string, type?: AlertType, buttons?: AlertButton[]) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  showConfirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function PANotificationProvider({ children }: { children: ReactNode }) {
  const { translation } = useLanguage();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback(
    (message: string, type: AlertType = 'info', buttons?: AlertButton[]) => {
      const id = Math.random().toString(36).substring(7);

      const defaultButtons: AlertButton[] = buttons || [
        {
          label: 'OK',
          action: 'close',
          variant: 'primary',
        },
      ];

      const alert: Alert = { id, message, type, buttons: defaultButtons };
      setAlerts((prev) => [...prev, alert]);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string) => {
      showAlert(message, 'success', [
        { label: 'OK', action: 'close', variant: 'primary' },
      ]);
    },
    [showAlert]
  );

  const showError = useCallback(
    (message: string) => {
      showAlert(message, 'error', [
        { label: 'OK', action: 'close', variant: 'danger' },
      ]);
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (message: string) => {
      showAlert(message, 'warning', [
        { label: 'OK', action: 'close', variant: 'primary' },
      ]);
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (message: string) => {
      showAlert(message, 'info', [
        { label: 'OK', action: 'close', variant: 'primary' },
      ]);
    },
    [showAlert]
  );

  const showConfirm = useCallback(
    (message: string, onConfirm: () => void, onCancel?: () => void) => {
      showAlert(message, 'warning', [
        {
          label: translation.common.cancel,
          onClick: onCancel,
          action: 'close',
          variant: 'secondary',
        },
        {
          label: translation.common.confirm,
          onClick: onConfirm,
          action: 'close',
          variant: 'primary',
        },
      ]);
    },
    [showAlert, translation.common.cancel, translation.common.confirm]
  );

  return (
    <NotificationContext.Provider
      value={{ showAlert, showSuccess, showError, showWarning, showInfo, showConfirm }}
    >
      {children}
      <AlertContainer alerts={alerts} onRemove={removeAlert} />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

function AlertContainer({
  alerts,
  onRemove,
}: {
  alerts: Alert[];
  onRemove: (id: string) => void;
}) {
  if (alerts.length === 0) return null;

  const currentAlert = alerts[0];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[9998] animate-fade-in backdrop-blur-sm" />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <AlertDialog alert={currentAlert} onRemove={onRemove} />
      </div>
    </>
  );
}

function AlertDialog({ alert, onRemove }: { alert: Alert; onRemove: (id: string) => void }) {
  const { id, message, type, buttons } = alert;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <BiCheckCircle size={48} className="text-[var(--rs-text-info)]" />;
      case 'error':
        return <BiXCircle size={48} className="text-[var(--rs-text-error)]" />;
      case 'warning':
        return <BiError size={48} className="text-[var(--rs-text-warning)]" />;
      case 'info':
      case 'confirm':
      default:
        return <BiInfoCircle size={48} className="text-[var(--rs-primary-500)]" />;
    }
  };

  const getButtonStyles = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-[var(--rs-primary-500)] hover:opacity-90 text-white';
      case 'danger':
        return 'bg-[var(--rs-bg-error)] hover:opacity-90 text-white';
      case 'secondary':
      default:
        return 'bg-[var(--rs-bg-active)] hover:opacity-90 text-[var(--rs-text-primary)]';
    }
  };

  return (
    <div className="bg-[var(--rs-bg-card)] rounded-lg shadow-2xl max-w-md w-full animate-scale-in border border-[var(--rs-border-primary)]">
      <div className="p-6 text-center">
        <div className="flex justify-center mb-4">{getIcon()}</div>
        <p className="text-base sm:text-lg text-[var(--rs-text-primary)] leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex gap-3 p-4 border-t border-[var(--rs-border-primary)]">
        {buttons?.map((button, index) => (
          <button
            key={index}
            onClick={() => {
              button.onClick?.();
              if (button.action === 'close') {
                onRemove(id);
              }
            }}
            className={`flex-1 px-4 py-2.5 rounded-md font-medium transition-colors ${getButtonStyles(
              button.variant
            )}`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
