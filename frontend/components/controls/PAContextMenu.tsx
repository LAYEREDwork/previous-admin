import { useRef, useEffect, useState } from 'react';

import { PAContextMenuItem, PAContextMenuItemActionType } from './PAContextMenuItem';

export interface PAContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  actionType?: PAContextMenuItemActionType;
}

interface PAContextMenuProps {
  items: PAContextMenuItem[];
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  title?: string;
}

/**
 * Custom context menu component that appears at specified position
 */
export function PAContextMenu({
  items,
  isOpen,
  onClose,
  position,
  title,
}: PAContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [isMeasured, setIsMeasured] = useState(false);

  // Adjust position if menu would go off-screen
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const padding = 8;

    let adjustedX = position.x;
    let adjustedY = position.y;

    // Check if menu would go off-screen to the right
    if (position.x + rect.width + padding > windowWidth) {
      adjustedX = Math.max(padding, windowWidth - rect.width - padding);
    }

    // Check if menu would go off-screen at the bottom
    if (position.y + rect.height + padding > windowHeight) {
      adjustedY = Math.max(padding, windowHeight - rect.height - padding);
    }

    setAdjustedPosition({ x: adjustedX, y: adjustedY });
    setIsMeasured(true);
  }, [isOpen, position]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 ${isMeasured ? 'visible' : 'invisible'}`}
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      <div className="bg-[color-mix(in_srgb,var(--rs-bg-card),white_8%)] border border-[var(--rs-border-primary)] rounded-lg shadow-lg overflow-hidden max-w-52 min-w-48">
        {title && (
          <div className="px-5 py-3 border-b border-[var(--rs-border-primary)] text-sm font-semibold text-[var(--rs-text-secondary)]">
            {title}
          </div>
        )}
        {items.map((item, index) => (
          <PAContextMenuItem
            key={index}
            label={item.label}
            icon={item.icon}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            disabled={item.disabled}
            actionType={item.actionType}
          />
        ))}
      </div>
    </div>
  );
}
