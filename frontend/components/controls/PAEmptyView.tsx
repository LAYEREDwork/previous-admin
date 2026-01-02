import { Button } from 'rsuite';
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
  /** Zusätzliche CSS-Klassen für den Container */
  className?: string;
  /** Button size (ignored for RSuite) */
  buttonSize?: any;
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
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 ${className}`}>
      <div className="text-[var(--rs-text-secondary)] opacity-30 mb-6">
        <Icon size={iconSize} />
      </div>
      <h3 className="text-xl font-semibold text-[var(--rs-text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--rs-text-secondary)] mb-6 text-center max-w-sm" style={{ maxWidth: '400px' }}>
        {description}
      </p>
      <Button
        onClick={onAction}
        appearance="primary"
        startIcon={ActionIcon ? <ActionIcon size={actionIconSize} /> : undefined}
      >
        {actionText}
      </Button>
    </div>
  );
};