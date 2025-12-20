import { PAButton } from './PAButton';
import { IconType } from 'react-icons';

/**
 * Props für die PAEmptyView-Komponente
 */
interface PAEmptyViewProps {
  /** Das anzuzeigende Icon */
  icon: IconType;
  /** Die Größe des Icons */
  iconSize?: number;
  /** Der Titel des Empty-States */
  title: string;
  /** Die Beschreibung des Empty-States */
  description: string;
  /** Der Text für den Aktionsbutton */
  actionText: string;
  /** Die Callback-Funktion für den Aktionsbutton */
  onAction: () => void;
  /** Optionales Icon für den Aktionsbutton */
  actionIcon?: IconType;
  /** Die Größe des Button-Icons */
  actionIconSize?: number;
  /** Die Größe des Buttons (optional, standardmäßig 'md') */
  buttonSize?: 'xs' | 'sm' | 'md' | 'lg';
  /** Zusätzliche CSS-Klassen für den Container */
  className?: string;
}

/**
 * Eine wiederverwendbare Komponente für leere Zustände (Empty States).
 * Zeigt ein Icon, Titel, Beschreibung und einen Aktionsbutton an.
 * PA prefix for Previous Admin.
 */
export const PAEmptyView: React.FC<PAEmptyViewProps> = ({
  icon: Icon,
  iconSize = 80,
  title,
  description,
  actionText,
  onAction,
  actionIcon: ActionIcon,
  actionIconSize = 18,
  buttonSize = 'md',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 ${className}`}>
      <div className="text-gray-300 dark:text-gray-600 mb-6">
        <Icon size={iconSize} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm" style={{ maxWidth: '400px' }}>
        {description}
      </p>
      <PAButton
        onClick={onAction}
        appearance="primary"
        size={buttonSize}
        className="flex items-center gap-2"
      >
        {ActionIcon && <ActionIcon size={actionIconSize} />}
        {actionText}
      </PAButton>
    </div>
  );
};