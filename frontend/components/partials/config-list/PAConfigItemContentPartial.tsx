import { ConfigListActionsPartial } from './PAConfigListActionsPartial';
import { Configuration } from '../../../lib/database';
import type { Translations } from '../../../lib/translations';

interface ConfigItemContentProps {
  config: Configuration;
  isMobile: boolean;
  exportSingleConfig: (config: Configuration) => void;
  duplicateConfig: (config: Configuration) => void;
  onEdit: (config: Configuration) => void;
  deleteConfig: (id: string) => void;
  translation: Translations;
}

/**
 * Content section of a configuration list item containing the name, description,
 * and mobile action buttons.
 */
export function ConfigItemContent({
  config,
  isMobile,
  exportSingleConfig,
  duplicateConfig,
  onEdit,
  deleteConfig,
  translation,
}: ConfigItemContentProps) {
  return (
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