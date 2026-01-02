import { ConfigItemControls } from './PAConfigItemControlsPartial';
import { ConfigItemContent } from './PAConfigItemContentPartial';
import { ConfigItemActions } from './PAConfigItemActionsPartial';
import { PACard } from '../../controls/PACard';
import { Configuration } from '../../../lib/database';
import type { Translations } from '../../../lib/translations';

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
}: ConfigListItemPartialProps) {

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
    >
      <PACard className={isActive ? 'ring-2 ring-primary-500' : ''}>
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
    </div>
  );
}
