import { IconButton } from 'rsuite';
import { BiCheckCircle, BiCircle, BiMenu } from 'react-icons/bi';
import type { Translations } from '../../../lib/translations';

interface ConfigItemControlsProps {
  isActive?: boolean;
  hasMultipleConfigs: boolean;
  onSetActive: () => void;
  onDragStart: () => void;
  translation: Translations;
}

/**
 * Controls section of a configuration list item containing the active state toggle
 * and drag handle buttons.
 */
export function ConfigItemControls({
  isActive,
  hasMultipleConfigs,
  onSetActive,
  onDragStart,
  translation,
}: ConfigItemControlsProps) {
  return (
    <div className="flex flex-col justify-between items-center w-10 sm:w-12">
      <IconButton
        icon={isActive ? <BiCheckCircle size={28} /> : <BiCircle size={28} />}
        appearance="subtle"
        onClick={() => !isActive && onSetActive()}
        className={`flex-shrink-0 ${
          isActive
            ? 'cursor-default !text-primary-500 !cursor-default'
            : 'cursor-pointer text-gray-800 hover:text-gray-200'
        }`}
        style={{ backgroundColor: 'transparent' }}
        title={isActive ? translation.configList.active : translation.configList.activate}
        disabled={isActive}
        size="lg"
      />
      {hasMultipleConfigs && (
        <IconButton
          icon={<BiMenu size={28} />}
          appearance="subtle"
          className="flex-shrink-0 cursor-grab text-gray-500 hover:text-gray-700"
          style={{ backgroundColor: 'transparent' }}
          title={translation.configList.move}
          size="lg"
          onClick={onDragStart}
        />
      )}
    </div>
  );
}