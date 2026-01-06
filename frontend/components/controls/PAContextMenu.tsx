import { PAContextMenuItem, PAContextMenuItemActionType } from './PAContextMenuItem';
import { PAContextMenuSeparator } from './PAContextMenuSeparator';

type PAContextMenuContent = PAContextMenuItem | PAContextMenuSeparator;

interface PAContextMenuProps {
  items: PAContextMenuContent[];
  title?: string;
}

/**
 * Generic context menu component that renders menu items and separators
 * Parent component is responsible for visibility, positioning, and close handling
 */
export function PAContextMenu({
  items,
  title,
}: PAContextMenuProps) {
  // Check if any item has a left icon (filter out separators)
  const hasLeftIcons = items.some((item) => 'iconLeft' in item && item.iconLeft !== undefined);

  return (
    <div className="bg-[color-mix(in_srgb,var(--rs-bg-card),white_8%)] border border-[var(--rs-border-primary)] rounded-lg shadow-lg overflow-hidden min-w-40">
      {title && (
        <div className="px-5 py-3 border-b border-[var(--rs-border-primary)] text-sm font-semibold text-center text-[var(--rs-text-secondary)]">
          {title}
        </div>
      )}
      <div className="flex flex-col">
        {items.map((item, index) => {
          // Check if it's a separator
          if ('itemType' in item && item.itemType === PAContextMenuItemActionType.separator) {
            return (
              <PAContextMenuItem
                key={`separator-${index}`}
                label=""
                onClick={() => {}}
                itemType={PAContextMenuItemActionType.separator}
              />
            );
          }

          // Type guard: item is now definitely PAContextMenuItem
          const menuItem = item as PAContextMenuItem;

          // Determine position of item for padding
          const itemPosition = index === 0 ? 'first' : index === items.length - 1 ? 'last' : 'middle';

          return (
            <PAContextMenuItem
              key={index}
              label={menuItem.label}
              iconLeft={menuItem.iconLeft}
              iconRight={menuItem.iconRight}
              onClick={menuItem.onClick}
              disabled={menuItem.disabled}
              itemType={menuItem.itemType}
              hasLeftIcons={hasLeftIcons}
              position={itemPosition}
            />
          );
        })}
      </div>
    </div>
  );
}

