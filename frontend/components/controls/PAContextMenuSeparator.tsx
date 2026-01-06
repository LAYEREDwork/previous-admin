import { CSSProperties } from 'react';

import { PAContextMenuItemActionType } from './PAContextMenuItemActionType';

export interface PAContextMenuSeparator {
  label: '';
  onClick: () => void;
  itemType: PAContextMenuItemActionType.separator;
  // Optional color for the separator line
  color?: string;
  // Optional thickness in pixels for the separator line
  thickness?: number;
}

interface PAContextMenuSeparatorProps {
  /**
   * Color of the separator line (default: uses border-primary color from theme)
   */
  color?: string;
  /**
   * Height/thickness of the separator line in pixels (default: 1)
   */
  thickness?: number;
}

/**
 * Horizontal separator line for context menu, spanning from left to right edge
 * Used to visually group related menu items
 */
export function PAContextMenuSeparator({
  color = 'var(--rs-border-primary)',
  thickness = 1,
}: PAContextMenuSeparatorProps) {
  const separatorStyle: CSSProperties = {
    backgroundColor: color,
    height: `${thickness}px`,
    width: '100%',
  };

  return (
    <div
      className="py-1 -mx-3"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <div style={separatorStyle} />
    </div>
  );
}
