import { BiPlus } from 'react-icons/bi';
import { IoDocumentsOutline } from 'react-icons/io5';

// Components
import EmptyView from '../controls/EmptyView';

// Partials
import { ConfigListItemPartial } from '../partials/config-list/ConfigListItemPartial';
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
    draggedIndex,
    dragOverIndex,
    newConfigNameRef,
    createConfig,
    deleteConfig,
    duplicateConfig,
    setActiveConfig,
    exportSingleConfig,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
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
        {configs.map((config, index) => (
          <ConfigListItemPartial
            key={config.id}
            config={config}
            index={index}
            totalConfigs={configs.length}
            draggedIndex={draggedIndex}
            dragOverIndex={dragOverIndex}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            handleDragLeave={handleDragLeave}
            setActiveConfig={setActiveConfig}
            exportSingleConfig={exportSingleConfig}
            duplicateConfig={duplicateConfig}
            onEdit={onEdit}
            deleteConfig={deleteConfig}
            translation={translation}
          />
        ))}
      </div>

      {/* Empty State */}
      {configs.length === 0 && !showNewConfig && (
        <EmptyView
          icon={IoDocumentsOutline}
          title={translation.configList.emptyStateTitle}
          description={translation.configList.emptyStateDescription}
          actionText={translation.configList.newConfig}
          actionIcon={BiPlus}
          onAction={() => setShowNewConfig(true)}
          buttonSize={controlSize}
        />
      )}
    </div>
  );
}
