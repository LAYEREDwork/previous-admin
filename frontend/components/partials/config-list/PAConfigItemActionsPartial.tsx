import { ConfigListActionsPartial } from './PAConfigListActionsPartial';
import { Configuration } from '../../../lib/database';
import type { Translations } from '../../../lib/translations';
import { STYLING_DEFAULTS } from '../../../lib/utils/styling';
import { StylingKey } from '../../../../shared/enums';

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
  );
}