import { PAButton } from '@frontend/components/controls/PAButton';
import { 
  SFArrowUpDocumentFill, 
  SFDocumentOnDocumentFill, 
  SFLongTextPageAndPencilFill, 
  SFTrash
} from 'sf-symbols-lib';
import { Configuration } from '@frontend/lib/database';
import { Translations } from '@frontend/lib/translations';
import { PAButtonType } from '@frontend/lib/types/button';
import { PASize } from '@frontend/lib/types/sizes';

interface ConfigListActionsPartialProps {
  config: Configuration;
  isMobile: boolean;
  exportSingleConfig: (config: Configuration) => void;
  duplicateConfig: (config: Configuration) => void;
  onEdit: (config: Configuration) => void;
  deleteConfig: (id: string) => void;
  translation: Translations;
}

/**
 * Zeigt die Aktions-Buttons für einen Konfigurationseintrag an.
 */
export function ConfigListActionsPartial({
  config,
  isMobile,
  exportSingleConfig,
  duplicateConfig,
  onEdit,
  deleteConfig,
  translation
}: ConfigListActionsPartialProps) {
  const iconSize = 20;
  const buttonSize = isMobile ? PASize.xs : PASize.sm;

  return (
    <div className="flex items-center justify-end gap-3 mt-2 sm:mt-0">
      <PAButton
        icon={<SFArrowUpDocumentFill size={iconSize} />}
        size={buttonSize}
        title={translation.configList.export}
        onClick={() => exportSingleConfig(config)}
        className="flex items-center justify-center"
      />
      <PAButton
        icon={<SFDocumentOnDocumentFill size={iconSize} />}
        size={buttonSize}
        title={translation.configList.duplicate}
        onClick={() => duplicateConfig(config)}
        className="flex items-center justify-center"
      />
      <PAButton
        icon={<SFLongTextPageAndPencilFill size={iconSize} />}
        size={buttonSize}
        title={translation.configList.edit}
        onClick={() => onEdit(config)}
        className="flex items-center justify-center"
      />
      <PAButton
        icon={<SFTrash size={iconSize} />}
        size={buttonSize}
        title={translation.configList.delete}
        onClick={() => deleteConfig(config.id)}
        buttonType={PAButtonType.destructive}
        className="flex items-center justify-center"
      />
    </div>
  );
}
