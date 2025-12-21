import { ConfigListActionsPartial } from './ConfigListActionsPartial';
import { Configuration } from '../../../lib/database';
import type { Translations } from '../../../lib/translations';
import { IconButton } from 'rsuite';
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
      className={`relative w-full flex flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 pb-12 sm:pb-3 rounded-lg border shadow-sm transition-all ${
        isActive
          ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      style={isActive ? { boxShadow: '0 0 12px rgba(34, 197, 94, 0.6)' } : undefined}
      tabIndex={0}
      aria-label={config.name}
    >
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
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-normal sm:truncate">
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
