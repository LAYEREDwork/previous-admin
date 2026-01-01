import { BiTrash, BiEdit, BiUpload, BiCopy } from 'react-icons/bi';
import { PASize } from '../../../lib/types/sizes';
import { PAButton } from '../../controls/PAButton';
import { Configuration } from '../../../lib/database';
import { Translations } from '../../../lib/translations';

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
  const iconSize = isMobile ? 20 : 24;
  const buttonSize = isMobile ? PASize.xs : PASize.sm;

  return (
    <div className="flex items-center justify-end gap-3 mt-2 sm:mt-0">
      <PAButton
        icon={<BiUpload size={iconSize} />}
        size={buttonSize}
        title={translation.configList.export}
        onClick={() => exportSingleConfig(config)}
        className="flex items-center justify-center"
      />
      <PAButton
        icon={<BiCopy size={iconSize} />}
        size={buttonSize}
        title={translation.configList.duplicate}
        onClick={() => duplicateConfig(config)}
        className="flex items-center justify-center"
      />
      <PAButton
        icon={<BiEdit size={iconSize} />}
        size={buttonSize}
        title={translation.configList.edit}
        onClick={() => onEdit(config)}
        className="flex items-center justify-center"
      />
      <PAButton
        icon={<BiTrash size={iconSize} />}
        size={buttonSize}
        title={translation.configList.delete}
        onClick={() => deleteConfig(config.id)}
        color="red"
        className="flex items-center justify-center"
      />
    </div>
  );
}
