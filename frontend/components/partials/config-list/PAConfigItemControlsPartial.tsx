import { IconButton } from 'rsuite';
import type { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';
import { SFCheckmarkCircle, SFCircle } from '../../sf-symbols';

interface ConfigItemControlsProps {
  isActive?: boolean;
  onSetActive: () => void;
  translation: Translations;
}

/**
 * Controls section of a configuration list item containing the active state toggle button.
 */
export function ConfigItemControls({
  isActive,
  onSetActive,
  translation,
}: ConfigItemControlsProps) {
  return (
    <div className="flex flex-col justify-center items-center w-10 sm:w-12">
      <IconButton
        icon={isActive ? <SFCheckmarkCircle size={26} /> : <SFCircle size={24} />}
        appearance="subtle"
        onClick={() => !isActive && onSetActive()}
        className={`flex-shrink-0 ${
          isActive
            ? 'cursor-default !text-primary-500 !cursor-default'
            : 'cursor-pointer text-[var(--rs-text-secondary)] hover:text-[var(--rs-text-primary)]'
        }`}
        style={{ backgroundColor: 'transparent' }}
        title={isActive ? translation.configList.active : translation.configList.activate}
        disabled={isActive}
        size={PASize.lg}
      />
    </div>
  );
}