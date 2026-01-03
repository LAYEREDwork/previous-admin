import { Configuration } from '../../../lib/database';
import type { Translations } from '../../../lib/translations';

import { ConfigListActionsPartial } from './PAConfigListActionsPartial';

interface ConfigItemActionsProps {
  config: Configuration;
  isMobile: boolean;
  exportSingleConfig: (config: Configuration) => void;
  duplicateConfig: (config: Configuration) => void;
  onEdit: (config: Configuration) => void;
  deleteConfig: (id: string) => void;
  translation: Translations;
}

/**
 * Actions section of a configuration list item containing the desktop action buttons.
 */
export function ConfigItemActions({
  config,
  isMobile,
  exportSingleConfig,
  duplicateConfig,
  onEdit,
  deleteConfig,
  translation,
}: ConfigItemActionsProps) {
  return (
    <div className="hidden sm:flex items-center pr-2">
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
  );
}