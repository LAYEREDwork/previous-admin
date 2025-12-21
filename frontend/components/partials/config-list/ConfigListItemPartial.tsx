import { ConfigListActionsPartial } from './ConfigListActionsPartial';
import { Configuration } from '../../../lib/database';
import type { Translations } from '../../../lib/translations';
import { Badge, IconButton } from 'rsuite';
import { BiCheckCircle, BiCircle } from 'react-icons/bi';

interface ConfigListItemPartialProps {
  config: Configuration;
  isMobile: boolean;
  isActive?: boolean;
  exportSingleConfig: (config: Configuration) => void;
  duplicateConfig: (config: Configuration) => void;
  onEdit: (config: Configuration) => void;
  deleteConfig: (id: string) => void;
  setActiveConfig: (id: string) => Promise<void>;
  translation: Translations;
}

export function ConfigListItemPartial({
  config,
  isMobile,
  isActive,
  exportSingleConfig,
  duplicateConfig,
  onEdit,
  deleteConfig,
  setActiveConfig,
  translation
}: ConfigListItemPartialProps) {
  return (
    <div
      className={
        'relative flex flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 pb-12 sm:pb-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 shadow-sm transition-colors'
      }
      tabIndex={0}
      aria-label={config.name}
    >
      {isActive && (
        <Badge
          content={translation.configList.active}
          color="green"
          className="absolute top-[-18px] right-[-18px] m-2"
          style={{ zIndex: 10, padding: '0px 10px' }}
          size="lg"
        />
      )}
      <div className="flex flex-row items-start gap-2 flex-1">
        <IconButton
          icon={isActive ? <BiCheckCircle size={26} /> : <BiCircle size={26} />}
          appearance="subtle"
          onClick={() => !isActive && setActiveConfig(config.id)}
          className={`flex-shrink-0 ${isActive ? 'cursor-default !text-green-500' : 'cursor-pointer text-gray-500 hover:text-gray-200'}`}
          style={{ backgroundColor: 'transparent' }}
          title={isActive ? translation.configList.active : translation.configList.activate}
          disabled={isActive}
          size="lg"
        />
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate">
              {config.name}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {config.description}
          </span>
        </div>
      </div>
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
