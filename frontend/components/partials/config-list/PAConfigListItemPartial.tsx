import { useState } from 'react';

import { PACard } from '@frontend/components/controls/PACard';
import { PAContextMenu } from '@frontend/components/controls/PAContextMenu';
import { PAContextMenuItemActionType, type PAContextMenuItem } from '@frontend/components/controls/PAContextMenuItem';
import { 
  SFArrowUpDocumentFill, 
  SFDocumentOnDocumentFill, 
  SFDocumentOnTrashFill, 
  SFLongTextPageAndPencilFill 
} from '@frontend/components/sf-symbols';
import { Configuration } from '@frontend/lib/database';
import type { Translations } from '@frontend/lib/translations';

import { ConfigItemActions } from './PAConfigItemActionsPartial';
import { ConfigItemContent } from './PAConfigItemContentPartial';
import { ConfigItemControls } from './PAConfigItemControlsPartial';

interface ConfigListItemPartialProps {
  config: Configuration;
  isMobile: boolean;
  isActive?: boolean;
  exportSingleConfig: (config: Configuration) => void;
  duplicateConfig: (config: Configuration) => void;
  onEdit: (config: Configuration) => void;
  deleteConfig: (id: string) => void;
  setActiveConfig: (id: string) => Promise<void>;
  translation: Translations;
  hasMultipleConfigs: boolean;
  index: number;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDragLeave: () => void;
  isDragOver: boolean;
  isContextMenuOpen: boolean;
  onContextMenuOpen: () => void;
  onContextMenuClose: () => void;
}

export function ConfigListItemPartial({
  config,
  isMobile,
  isActive,
  exportSingleConfig,
  duplicateConfig,
  onEdit,
  deleteConfig,
  setActiveConfig,
  translation,
  hasMultipleConfigs,
  index,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragLeave,
  isDragOver,
  isContextMenuOpen,
  onContextMenuOpen,
  onContextMenuClose,
}: ConfigListItemPartialProps) {
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  /**
   * Handles double-click on config item to edit it
   */
  const handleDoubleClick = () => {
    onEdit(config);
  };

  /**
   * Handles right-click to show context menu
   */
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    onContextMenuOpen();
  };

  // Define individual context menu items
  const editMenuItem: PAContextMenuItem = {
    label: translation.configList.edit,
    iconLeft: <SFLongTextPageAndPencilFill size={24} />,
    onClick: () => onEdit(config),
    itemType: PAContextMenuItemActionType.default,
  };

  const exportMenuItem: PAContextMenuItem = {
    label: translation.configList.export,
    iconLeft: <SFArrowUpDocumentFill size={24} />,
    onClick: () => exportSingleConfig(config),
    itemType: PAContextMenuItemActionType.default,
  };

  const duplicateMenuItem: PAContextMenuItem = {
    label: translation.configList.duplicate,
    iconLeft: <SFDocumentOnDocumentFill size={24} />,
    onClick: () => duplicateConfig(config),
    itemType: PAContextMenuItemActionType.default,
  };

  const deleteMenuSeparator: PAContextMenuItem = {
    itemType: PAContextMenuItemActionType.separator,
  };

  const deleteMenuItem: PAContextMenuItem = {
    label: translation.configList.delete,
    iconLeft: <SFDocumentOnTrashFill size={24} />,
    onClick: () => deleteConfig(config.id),
    itemType: PAContextMenuItemActionType.destructive,
  };

  const contextMenuItems = [
    editMenuItem,
    exportMenuItem,
    duplicateMenuItem,
    deleteMenuSeparator,
    deleteMenuItem,
  ];

  return (
    <div
      className={`relative transition-all ${
        isDragOver ? 'opacity-60' : ''
      }`}
      tabIndex={0}
      aria-label={config.name}
      draggable={hasMultipleConfigs}
      onDragStart={() => hasMultipleConfigs && onDragStart(index)}
      onDragOver={(e) => hasMultipleConfigs && onDragOver(e, index)}
      onDragEnd={() => hasMultipleConfigs && onDragEnd()}
      onDragLeave={() => hasMultipleConfigs && onDragLeave()}
      onContextMenu={handleContextMenu}
    >
      <PACard className={isActive ? 'ring-2 ring-primary-500' : ''} onDoubleClick={handleDoubleClick}>
        <div className="w-full flex flex-row gap-3 sm:gap-2">
          {/* Linke Spalte: Active Button */}
          <ConfigItemControls
            isActive={isActive}
            onSetActive={() => setActiveConfig(config.id)}
            translation={translation}
          />

          {/* Mittlere Spalte: Name, Description */}
          <ConfigItemContent
            config={config}
            isMobile={isMobile}
            exportSingleConfig={exportSingleConfig}
            duplicateConfig={duplicateConfig}
            onEdit={onEdit}
            deleteConfig={deleteConfig}
            translation={translation}
          />

          {/* Rechte Spalte: Action Buttons - nur Desktop, vertikal zentriert */}
          <ConfigItemActions
            config={config}
            isMobile={isMobile}
            exportSingleConfig={exportSingleConfig}
            duplicateConfig={duplicateConfig}
            onEdit={onEdit}
            deleteConfig={deleteConfig}
            translation={translation}
          />
        </div>
      </PACard>

      {/* Context Menu */}
      {isContextMenuOpen && (
        <div
          className="fixed z-50"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
          }}
        >
          <PAContextMenu
            items={contextMenuItems}
            title={config.name}
          />
        </div>
      )}
      
      {/* Close menu on outside click */}
      {isContextMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={onContextMenuClose}
          onKeyDown={(e) => e.key === 'Escape' && onContextMenuClose()}
        />
      )}
    </div>
  );
}
