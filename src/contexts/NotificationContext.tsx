import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BiCheckCircle, BiXCircle, BiError, BiInfoCircle, BiX } from 'react-icons/bi';

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

export function NotificationProvider({ children }: { children: ReactNode }) {
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
      showAlert(message, 'confirm', [
        {
          label: 'Abbruch',
          onClick: onCancel,
          action: 'close',
          variant: 'secondary',
        },
        {
          label: 'Weiter',
          onClick: onConfirm,
          action: 'close',
          variant: 'primary',
        },
      ]);
    },
    [showAlert]
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
        return <BiCheckCircle size={48} className="text-green-500 dark:text-green-400" />;
      case 'error':
        return <BiXCircle size={48} className="text-red-500 dark:text-red-400" />;
      case 'warning':
        return <BiError size={48} className="text-amber-500 dark:text-amber-400" />;
      case 'info':
      case 'confirm':
      default:
        return <BiInfoCircle size={48} className="text-next-accent" />;
    }
  };

  const getButtonStyles = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-next-accent hover:bg-next-accent-hover text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white';
      case 'secondary':
      default:
        return 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full animate-scale-in">
      <div className="flex justify-end p-3 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onRemove(id)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <BiX size={20} />
        </button>
      </div>

      <div className="p-6 text-center">
        <div className="flex justify-center mb-4">{getIcon()}</div>
        <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
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
