import { IconButton } from 'rsuite';
import { BiCheckCircle, BiCircle } from 'react-icons/bi';
import type { Translations } from '../../../lib/translations';

interface ConfigItemControlsProps {
  isActive?: boolean;
  onSetActive: () => void;
  translation: Translations;
}

/**
 * Controls section of a configuration list item containing the active state toggle
 * and drag handle buttons.
 */
export function ConfigItemControls({
  isActive,
  onSetActive,
  translation,
}: ConfigItemControlsProps) {
  return (
    <div className="flex flex-col justify-center items-center w-10 sm:w-12">
      <IconButton
        icon={isActive ? <BiCheckCircle size={28} /> : <BiCircle size={28} />}
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
        size="lg"
      />
    </div>
  );
}