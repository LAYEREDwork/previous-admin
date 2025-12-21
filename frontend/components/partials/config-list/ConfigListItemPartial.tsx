import { ConfigListActionsPartial } from './ConfigListActionsPartial';
import { Configuration } from '../../../lib/database';
import type { Translations } from '../../../lib/translations';
import { IconButton } from 'rsuite';
import { BiCheckCircle, BiCircle, BiMenu } from 'react-icons/bi';

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
  return (
    <div
      className={`relative w-full flex flex-row gap-3 p-3 rounded-lg border shadow-sm transition-all ${
        isActive
          ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 hover:border-gray-300 dark:hover:border-gray-600'
      } ${isDragged ? 'bg-gray-100 bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70' : ''} ${isDragOver ? 'border-primary-500' : ''}`}
      style={{ boxShadow: `0 0 12px rgba(6, 182, 212, ${isActive ? 0.6 : 0})`, transition: `box-shadow ${isActive ? 0.4 : 0.2}s ease-in-out, border-color ${isActive ? 0.4 : 0.2}s ease-in-out` }}
      tabIndex={0}
      aria-label={config.name}
      draggable={hasMultipleConfigs}
      onDragStart={() => hasMultipleConfigs && onDragStart(index)}
      onDragOver={(e) => hasMultipleConfigs && onDragOver(e, index)}
      onDragEnd={() => hasMultipleConfigs && onDragEnd()}
      onDragLeave={() => hasMultipleConfigs && onDragLeave()}
    >
      {/* Linke Spalte: Active Button oben, Drag Button unten */}
      <div className="flex flex-col justify-between items-center">
        <IconButton
          icon={isActive ? <BiCheckCircle size={26} /> : <BiCircle size={26} />}
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
            icon={<BiMenu size={26} />}
            appearance="subtle"
            className="flex-shrink-0 cursor-grab text-gray-500 hover:text-gray-700"
            style={{ backgroundColor: 'transparent' }}
            title={translation.configList.move}
            size="lg"
          />
        )}
      </div>

      {/* Rechte Spalte: Name, Description, Action Buttons */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate">
          {config.name}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {config.description}
        </span>
        <ConfigListActionsPartial
          config={config}
          isMobile={isMobile}
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
