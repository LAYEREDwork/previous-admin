import { Configuration } from '@frontend/lib/database';
import type { Translations } from '@frontend/lib/translations';

import { ConfigListActionsPartial } from './PAConfigListActionsPartial';

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
      <span className="font-semibold text-base text-[var(--rs-text-primary)] truncate">
        {config.name}
      </span>
      <span className="text-sm text-[var(--rs-text-secondary)]">
        {config.description}
      </span>
      {config.created_at && (
        <span className="text-xs text-[var(--rs-text-tertiary)]">
          Created: {new Date(config.created_at).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </span>
      )}
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