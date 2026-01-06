import { PAContextMenuItemActionType } from './PAContextMenuItemActionType';
import { PAContextMenuItemContent } from './PAContextMenuItemContent';
import { PAContextMenuSeparator } from './PAContextMenuSeparator';

export { PAContextMenuItemActionType };

export interface PAContextMenuItem {
  label?: string;
  // Icon displayed on the left side of the label (optional)
  iconLeft?: React.ReactNode;
  // Icon displayed on the right side of the label (optional)
  iconRight?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  itemType?: PAContextMenuItemActionType;
}

interface PAContextMenuItemProps {
  label?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  itemType?: PAContextMenuItemActionType;
  // If true, reserve space for left icon even if this item doesn't have one
  hasLeftIcons?: boolean;
  // Position-specific padding: 'first' for top padding, 'last' for bottom padding, 'middle' for normal
  position?: 'first' | 'last' | 'middle';
}

/**
 * Context menu item wrapper that renders either a separator or item content
 * based on the itemType parameter
 */
export function PAContextMenuItem({
  label = '',
  iconLeft,
  iconRight,
  onClick = () => {},
  disabled = false,
  itemType = PAContextMenuItemActionType.default,
  hasLeftIcons = false,
  position = 'middle',
}: PAContextMenuItemProps) {
  // Render separator if itemType is separator
  if (itemType === PAContextMenuItemActionType.separator) {
    return <PAContextMenuSeparator />;
  }

  // Render item content for default and destructive types
  return (
    <PAContextMenuItemContent
      label={label}
      iconLeft={iconLeft}
      iconRight={iconRight}
      onClick={onClick}
      disabled={disabled}
      itemType={itemType}
      hasLeftIcons={hasLeftIcons}
      position={position}
    />
  );
}
