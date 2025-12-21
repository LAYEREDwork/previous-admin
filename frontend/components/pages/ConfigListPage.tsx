

// Components
import { PAEmptyView } from '../controls/PAEmptyView';

// Partials
import { ConfigListItemPartial } from '../partials/config-list/ConfigListItemPartial';
import { Badge } from 'rsuite';
import { ConfigListHeaderPartial } from '../partials/config-list/ConfigListHeaderPartial';
import { NewConfigModalPartial } from '../partials/config-list/NewConfigModalPartial';

// Hooks
import { useLanguage } from '../../contexts/LanguageContext';
import { useControlSize } from '../../hooks/useControlSize';
import { useConfigListLogic } from '../../hooks/useConfigList';

// Types
import { Configuration } from '../../lib/database';

interface ConfigListProps {
  onEdit: (config: Configuration) => void;
}

export function ConfigList({ onEdit }: ConfigListProps) {
  const { translation } = useLanguage();
  const controlSize = useControlSize('md');

  const {
    configs,
    loading,
    showNewConfig,
    setShowNewConfig,
    newConfigName,
    setNewConfigName,
    newConfigDesc,
    setNewConfigDesc,
    newConfigNameRef,
    createConfig,
    deleteConfig,
    duplicateConfig,
    exportSingleConfig,
    setActiveConfig,
    handleCloseNewConfigModal,
  } = useConfigListLogic(onEdit);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">{translation.configList.loading}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      {configs.length > 0 && (
        <ConfigListHeaderPartial
          onNewConfigClick={() => setShowNewConfig(true)}
          controlSize={controlSize}
          translation={translation}
        />
      )}

      {/* New Configuration Modal */}
      <NewConfigModalPartial
        open={showNewConfig}
        onClose={handleCloseNewConfigModal}
        onSave={createConfig}
        name={newConfigName}
        setName={setNewConfigName}
        description={newConfigDesc}
        setDescription={setNewConfigDesc}
        nameRef={newConfigNameRef}
        controlSize={controlSize}
        translation={translation}
      />

      {/* Configurations List */}
      <div className="grid gap-3">
        {configs.map((config) => {
          const isActive = config.is_active;
          const item = (
            <ConfigListItemPartial
              key={config.id}
              config={config}
              isMobile={false} /* Passe ggf. an, falls mobile Detection vorhanden */
              exportSingleConfig={exportSingleConfig}
              duplicateConfig={duplicateConfig}
              onEdit={onEdit}
              deleteConfig={deleteConfig}
              translation={translation}
              setActiveConfig={setActiveConfig}
            />
          );
          return isActive ? (
            <Badge
              key={config.id}
              content={translation.configList.active}
              color="green"
              style={{ width: '100%' }}
              display="block"
              size="lg"
            >
              {item}
            </Badge>
          ) : item;
        })}
      </div>

      {/* Empty State */}
      {configs.length === 0 && !showNewConfig && (
        <PAEmptyView
          title={translation.configList.title}
          description={translation.configList.emptyStateDescription}
          onAction={() => setShowNewConfig(true)}
        />
      )}
    </div>
  );
}
