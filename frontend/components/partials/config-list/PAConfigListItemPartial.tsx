import { ConfigItemControls } from './PAConfigItemControlsPartial';
import { ConfigItemContent } from './PAConfigItemContentPartial';
import { ConfigItemActions } from './PAConfigItemActionsPartial';
import { Configuration } from '../../../lib/database';
import type { Translations } from '../../../lib/translations';
import {
  getFrameShadow,
  getConfigItemBackground,
  getConfigItemBoxShadow,
  getConfigItemTransition,
} from '../../../lib/utils/styling';

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
  isDragged: boolean;
  isDragOver: boolean;
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
  isDragged,
  isDragOver,
}: ConfigListItemPartialProps) {
  // Skeuomorphic shadow effects for frame only
  const frameShadow = getFrameShadow();
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const backgroundStyles = getConfigItemBackground(isDragged, isActive ?? false, isDarkMode);

  return (
    <div
      className={`relative w-full flex flex-row gap-3 sm:gap-2 p-3 sm:p-2 rounded-lg border shadow-sm transition-all ${
        isActive
          ? 'border-primary-500'
          : 'border-gray-200 dark:border-next-border hover:border-gray-300 dark:hover:border-gray-500'
      } ${isDragOver ? 'border-primary-500' : ''}`}
      style={{
        boxShadow: getConfigItemBoxShadow(isActive ?? false, frameShadow),
        transition: getConfigItemTransition(isActive ?? false),
        ...backgroundStyles,
        // Ensure slight contrast to site background when not active/dragged
        ...(backgroundStyles.backgroundColor ? { color: 'inherit' } : {}),
      }}
      tabIndex={0}
      aria-label={config.name}
      draggable={hasMultipleConfigs}
      onDragStart={() => hasMultipleConfigs && onDragStart(index)}
      onDragOver={(e) => hasMultipleConfigs && onDragOver(e, index)}
      onDragEnd={() => hasMultipleConfigs && onDragEnd()}
      onDragLeave={() => hasMultipleConfigs && onDragLeave()}
    >
      {/* Linke Spalte: Active Button oben, Drag Button unten */}
      <ConfigItemControls
        isActive={isActive}
        hasMultipleConfigs={hasMultipleConfigs}
        onSetActive={() => setActiveConfig(config.id)}
        onDragStart={() => hasMultipleConfigs && onDragStart(index)}
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
  );
}
