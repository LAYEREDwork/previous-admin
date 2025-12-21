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
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-auto sm:right-3 sm:translate-x-0 flex items-center justify-center sm:justify-end gap-3 sm:gap-2">
      <PAIconButton
        icon={<BiUpload size={isMobile ? 16 : 18} className="transition-colors group-hover:text-next-accent" />}
        size={isMobile ? 'xs' : 'sm'}
        appearance="default"
        onClick={() => exportSingleConfig(config)}
        title={translation.configList.export}
        className="group hover:!bg-primary-50 dark:hover:!bg-primary-900/20"
      />
      <PAIconButton
        icon={<BiCopy size={16} className="transition-colors group-hover:text-next-accent" />}
        size={isMobile ? 'xs' : 'sm'}
        appearance="default"
        onClick={() => duplicateConfig(config)}
        title={translation.configList.duplicate}
        className="group hover:!bg-primary-50 dark:hover:!bg-primary-900/20"
      />
      <PAIconButton
        icon={<BiEdit size={16} className="transition-colors group-hover:text-next-accent" />}
        size={isMobile ? 'xs' : 'sm'}
        appearance="default"
        onClick={() => onEdit(config)}
        title={translation.configList.edit}
        className="group hover:!bg-primary-50 dark:hover:!bg-primary-900/20"
      />
      <PAIconButton
        icon={<BiTrash size={16} className="transition-colors group-hover:text-red-500" />}
        size={isMobile ? 'xs' : 'sm'}
        appearance="default"
        onClick={() => deleteConfig(config.id)}
        title={translation.configList.delete}
        className="group hover:!bg-red-50 dark:hover:!bg-red-900/20"
      />
    </div>
  );
}
