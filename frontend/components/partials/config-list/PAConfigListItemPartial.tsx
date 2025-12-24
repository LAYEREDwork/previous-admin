import { ConfigListActionsPartial } from './PAConfigListActionsPartial';
import { Configuration } from '../../../lib/database';
import type { Translations } from '../../../lib/translations';
import { IconButton } from 'rsuite';
import { BiCheckCircle, BiCircle, BiMenu } from 'react-icons/bi';
import { PATextures } from '../../../lib/utils/color';
import {
  STYLING_DEFAULTS,
  getFrameShadow,
  getConfigItemBackground,
  getConfigItemBoxShadow,
  getConfigItemTransition,
  SHADOW_CONFIG
} from '../../../lib/utils/styling';
import { StylingKey } from '~shared/enums';

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
  const backgroundStyles = getConfigItemBackground(isDragged, isActive, isDarkMode);

  return (
    <div
      className={`relative w-full flex flex-row gap-3 sm:gap-2 p-3 sm:p-2 rounded-lg border shadow-sm transition-all ${
        isActive
          ? 'border-primary-500'
          : 'border-gray-200 dark:border-next-border hover:border-gray-300 dark:hover:border-gray-500'
      } ${isDragOver ? 'border-primary-500' : ''}`}
      style={{
        boxShadow: getConfigItemBoxShadow(isActive, frameShadow),
        transition: getConfigItemTransition(isActive),
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
      <div className="flex flex-col justify-between items-center w-10 sm:w-12">
        <IconButton
          icon={isActive ? <BiCheckCircle size={28} /> : <BiCircle size={28} />}
          appearance="subtle"
          onClick={() => !isActive && setActiveConfig(config.id)}
          className={`flex-shrink-0 ${isActive ? 'cursor-default !text-primary-500 !cursor-default' : 'cursor-pointer text-gray-800 hover:text-gray-200'}`}
          style={{ backgroundColor: 'transparent' }}
          title={isActive ? translation.configList.active : translation.configList.activate}
          disabled={isActive}
          size="lg"
        />
        {hasMultipleConfigs && (
          <IconButton
            icon={<BiMenu size={28} />}
            appearance="subtle"
            className="flex-shrink-0 cursor-grab text-gray-500 hover:text-gray-700"
            style={{ backgroundColor: 'transparent' }}
            title={translation.configList.move}
            size="lg"
          />
        )}
      </div>

      {/* Mittlere Spalte: Name, Description */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate">
          {config.name}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {config.description}
        </span>
        {/* Mobile: Action Buttons unter Description */}
        <div className="sm:hidden">
          <ConfigListActionsPartial
            config={config}
            isMobile={isMobile}
            baseColor={STYLING_DEFAULTS[StylingKey.BUTTON_BASE_COLOR]}
            exportSingleConfig={exportSingleConfig}
            duplicateConfig={duplicateConfig}
            onEdit={onEdit}
            deleteConfig={deleteConfig}
            translation={translation}
          />
        </div>
      </div>

      {/* Rechte Spalte: Action Buttons - nur Desktop, vertikal zentriert */}
      <div className="hidden sm:flex items-center">
        <ConfigListActionsPartial
          config={config}
          isMobile={isMobile}
          baseColor={STYLING_DEFAULTS[StylingKey.BUTTON_BASE_COLOR]}
          exportSingleConfig={exportSingleConfig}
          duplicateConfig={duplicateConfig}
          onEdit={onEdit}
          deleteConfig={deleteConfig}
          translation={translation}
        />
      </div>
    </div>
  );
}
