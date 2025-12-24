import { BiTrash, BiEdit, BiUpload, BiCopy } from 'react-icons/bi';
import { PASize } from '../../../lib/types/sizes';
import { PANeomorphButton, PANeomorphButtonShape } from '../../controls/PANeomorphButton';
import { Configuration } from '../../../lib/database';
import { Translations } from '../../../lib/translations';

interface ConfigListActionsPartialProps {
  config: Configuration;
  isMobile: boolean;
  baseColor?: string;
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
  baseColor,
  exportSingleConfig,
  duplicateConfig,
  onEdit,
  deleteConfig,
  translation
}: ConfigListActionsPartialProps) {
  const iconSize = isMobile ? 20 : 24;
  const buttonSize = isMobile ? PASize.xs : PASize.sm;

  return (
    <div className="flex items-center justify-end gap-2 mt-2 sm:mt-0">
      <PANeomorphButton
        icon={<BiUpload size={iconSize} />}
        size={buttonSize}
        baseColor={baseColor}
        shape={PANeomorphButtonShape.rect}
        title={translation.configList.export}
        onClick={() => exportSingleConfig(config)}
      />
      <PANeomorphButton
        icon={<BiCopy size={iconSize} />}
        size={buttonSize}
        baseColor={baseColor}
        shape={PANeomorphButtonShape.rect}
        title={translation.configList.duplicate}
        onClick={() => duplicateConfig(config)}
      />
      <PANeomorphButton
        icon={<BiEdit size={iconSize} />}
        size={buttonSize}
        baseColor={baseColor}
        shape={PANeomorphButtonShape.rect}
        title={translation.configList.edit}
        onClick={() => onEdit(config)}
      />
      <PANeomorphButton
        icon={<BiTrash size={iconSize} />}
        size={buttonSize}
        baseColor={baseColor}
        shape={PANeomorphButtonShape.rect}
        title={translation.configList.delete}
        onClick={() => deleteConfig(config.id)}
        color="#e53935"
      />
    </div>
  );
}
