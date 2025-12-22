import { ConfigListActionsPartial } from './PAConfigListActionsPartial';
import { Configuration } from '../../../lib/database';
import type { Translations } from '../../../lib/translations';
import { IconButton } from 'rsuite';
import { BiCheckCircle, BiCircle, BiMenu } from 'react-icons/bi';
import { PATextures } from '../../../lib/utils/color';

const ITEM_BACKGROUND = '#1A1A1A'; // slightly darker than the site background (#141414) for separation
const DRAG_BACKGROUND = '#181818';
const ACTIVE_OVERLAY = 'rgba(6, 182, 212, 0.12)';
const BUTTON_BASE_COLOR = '#0d0d0d';

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
  const frameWidth = 2;
  const shadowBlurRadius = 2;

  const frameColorShadowLight = 'rgba(55, 55, 55, 1)';   // Top-left frame shadow
  const frameColorShadowDark = '#000';   // Bottom-right frame shadow

  const frameShadow = `inset ${frameWidth}px ${frameWidth}px ${shadowBlurRadius}px ${frameColorShadowDark}, inset -${frameWidth}px -${frameWidth}px ${shadowBlurRadius}px ${frameColorShadowLight}`;
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const baseBackground = isDragged ? DRAG_BACKGROUND : ITEM_BACKGROUND;
  const backgroundColor = isDarkMode ? baseBackground : undefined;
  const backgroundImage = isDarkMode
    ? `${isActive ? `linear-gradient(${ACTIVE_OVERLAY}, ${ACTIVE_OVERLAY}), ` : ''}${PATextures.NOISE}`
    : undefined;

  return (
    <div
      className={`relative w-full flex flex-row gap-3 sm:gap-2 p-3 sm:p-2 rounded-lg border shadow-sm transition-all ${
        isActive
          ? 'border-primary-500'
          : 'border-gray-200 dark:border-next-border hover:border-gray-300 dark:hover:border-gray-500'
      } ${isDragOver ? 'border-primary-500' : ''}`}
      style={{
        boxShadow: `0 0 12px rgba(6, 182, 212, ${isActive ? 0.6 : 0}), ${frameShadow}`,
        transition: `box-shadow ${isActive ? 0.4 : 0.2}s ease-in-out, border-color ${isActive ? 0.4 : 0.2}s ease-in-out`,
        backgroundColor,
        backgroundImage,
        backgroundBlendMode: isDarkMode ? 'soft-light' : undefined,
        backgroundSize: isDarkMode ? 'auto' : undefined,
        backgroundRepeat: isDarkMode ? 'repeat' : undefined,
        backgroundOrigin: isDarkMode ? 'border-box' : undefined,
        backgroundClip: isDarkMode ? 'padding-box' : undefined,
        // Ensure slight contrast to site background when not active/dragged
        ...(backgroundColor ? { color: 'inherit' } : {}),
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
            baseColor={BUTTON_BASE_COLOR}
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
          baseColor={BUTTON_BASE_COLOR}
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
