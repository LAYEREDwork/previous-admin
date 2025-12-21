import { BiTrash, BiEdit, BiUpload, BiCopy } from 'react-icons/bi';
import { PAIconButton } from '../../controls/PAIconButton';
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
  const iconSize = isMobile ? 16 : 18;
  const buttonSize = isMobile ? 'xs' : 'sm';

  return (
    <div className="flex items-center justify-end gap-2 mt-2">
      <PAIconButton
        icon={<BiUpload size={iconSize} className="transition-colors group-hover:text-primary-500" />}
        size={buttonSize}
        appearance="default"
        onClick={() => exportSingleConfig(config)}
        title={translation.configList.export}
        className="group hover:!bg-primary-50 dark:hover:!bg-primary-900/20"
      />
      <PAIconButton
        icon={<BiCopy size={iconSize} className="transition-colors group-hover:text-primary-500" />}
        size={buttonSize}
        appearance="default"
        onClick={() => duplicateConfig(config)}
        title={translation.configList.duplicate}
        className="group hover:!bg-primary-50 dark:hover:!bg-primary-900/20"
      />
      <PAIconButton
        icon={<BiEdit size={iconSize} className="transition-colors group-hover:text-primary-500" />}
        size={buttonSize}
        appearance="default"
        onClick={() => onEdit(config)}
        title={translation.configList.edit}
        className="group hover:!bg-primary-50 dark:hover:!bg-primary-900/20"
      />
      <PAIconButton
        icon={<BiTrash size={iconSize} className="transition-colors group-hover:text-red-500" />}
        size={buttonSize}
        appearance="default"
        onClick={() => deleteConfig(config.id)}
        title={translation.configList.delete}
        className="group hover:!bg-red-50 dark:hover:!bg-red-900/20"
      />
    </div>
  );
}
