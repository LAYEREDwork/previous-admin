import { Button } from 'rsuite';
import { PAContextMenuItemActionType } from './PAContextMenuItemActionType';
export { PAContextMenuItemActionType };

interface PAContextMenuItemProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  actionType?: PAContextMenuItemActionType;
}

/**
 * Individual context menu item with icon, label, and action handling
 */
export function PAContextMenuItem({
  label,
  icon,
  onClick,
  disabled = false,
  actionType = PAContextMenuItemActionType.default,
}: PAContextMenuItemProps) {
  // Determine styling based on action type
  const isDestructive = actionType === PAContextMenuItemActionType.destructive;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      appearance="subtle"
      className={`group w-full flex items-center gap-4 justify-start px-5 py-2 text-left transition-colors text-base ${!disabled ? (isDestructive ? 'hover:bg-[var(--rs-message-error-bg)]' : 'hover:bg-[color-mix(in_srgb,var(--rs-bg-card),black_8%)]') : ''}`}
    >
      {icon && <span className={`flex-shrink-0 ${isDestructive ? 'text-[var(--rs-text-error)] group-hover:text-[var(--rs-text-error)]' : 'text-[var(--rs-text-primary)] group-hover:text-[var(--rs-text-primary)]'}`}>{icon}</span>}
      <span className={`flex-1 font-medium ${isDestructive ? 'text-[var(--rs-text-error)] group-hover:text-[var(--rs-text-error)]' : 'text-[var(--rs-text-primary)] group-hover:text-[var(--rs-text-primary)]'}`}>{label}</span>
    </Button>
  );
}
