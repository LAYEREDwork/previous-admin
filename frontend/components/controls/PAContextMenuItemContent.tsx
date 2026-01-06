import { Button } from 'rsuite';

import { PAContextMenuItemActionType } from './PAContextMenuItemActionType';

interface PAContextMenuItemContentProps {
  label: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  itemType?: PAContextMenuItemActionType;
  // If true, reserve space for left icon even if this item doesn't have one
  hasLeftIcons?: boolean;
  // Position-specific padding: 'first' for top padding, 'last' for bottom padding, 'middle' for normal
  position?: 'first' | 'last' | 'middle';
}

/**
 * Individual context menu item content with optional left/right icons, label, and action handling
 * Supports proper alignment when some items have left icons and others don't
 */
export function PAContextMenuItemContent({
  label,
  iconLeft,
  iconRight,
  onClick,
  disabled = false,
  itemType = PAContextMenuItemActionType.default,
  hasLeftIcons = false,
  position = 'middle',
}: PAContextMenuItemContentProps) {
  // Determine styling based on item type
  const isDestructive = itemType === PAContextMenuItemActionType.destructive;

  // Calculate padding based on position: gap-3 = 0.75rem = 12px
  // First item needs extra top padding, last item needs extra bottom padding
  let paddingClass = 'py-2';
  if (position === 'first') {
    paddingClass = 'pt-3 pb-2';
  } else if (position === 'last') {
    paddingClass = 'pt-2 pb-3';
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      appearance="subtle"
      className={`group w-full flex items-center gap-3 px-3 ${paddingClass} text-left transition-colors text-base ${!disabled ? (isDestructive ? 'hover:bg-[var(--rs-message-error-bg)]' : 'hover:bg-[color-mix(in_srgb,var(--rs-bg-card),black_8%)]') : ''}`}
    >
      {/* Left icon area - reserve space if any item has a left icon */}
      {hasLeftIcons && (
        <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center ${isDestructive ? 'text-[var(--rs-text-error)]' : 'text-[var(--rs-text-primary)]'}`}>
          {iconLeft}
        </span>
      )}

      {/* Label - left-aligned and takes available space */}
      <span className={`flex-1 font-medium text-left ${isDestructive ? 'text-[var(--rs-text-error)] group-hover:text-[var(--rs-text-error)]' : 'text-[var(--rs-text-primary)] group-hover:text-[var(--rs-text-primary)]'}`}>
        {label}
      </span>

      {/* Right icon area */}
      {iconRight && (
        <span className={`flex-shrink-0 ${isDestructive ? 'text-[var(--rs-text-error)]' : 'text-[var(--rs-text-primary)]'}`}>
          {iconRight}
        </span>
      )}
    </Button>
  );
}
