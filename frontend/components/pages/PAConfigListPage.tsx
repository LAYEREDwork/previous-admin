

// Components
import { PAEmptyView } from '../controls/PAEmptyView';
import { BiPlus } from 'react-icons/bi';

// Partials
import { ConfigListItemPartial } from '../partials/config-list/PAConfigListItemPartial';
import { PAConfigListHeaderPartial } from '../partials/config-list/PAConfigListHeaderPartial';
import { NewConfigModalPartial } from '../partials/config-list/PANewConfigModalPartial';

// Hooks
import { useLanguage } from '../../contexts/PALanguageContext';
import { useResponsiveControlSize } from '../../hooks/useResponsiveControlSize';
import { useConfigListLogic } from '../../hooks/useConfigList';

// Types
import { Configuration } from '../../lib/database';

interface ConfigListProps {
  onEdit: (config: Configuration) => void;
}

export function PAConfigList({ onEdit }: ConfigListProps) {
  const { translation } = useLanguage();
  const controlSize = useResponsiveControlSize('md');

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
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
    draggedIndex,
    dragOverIndex,
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
        <PAConfigListHeaderPartial
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
            isMobile={false} /* Passe ggf. an, falls mobile Detection vorhanden */
            isActive={config.is_active}
            exportSingleConfig={exportSingleConfig}
            duplicateConfig={duplicateConfig}
            onEdit={onEdit}
            deleteConfig={deleteConfig}
            translation={translation}
            setActiveConfig={setActiveConfig}
            hasMultipleConfigs={configs.length > 1}
            index={index}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
            isDragged={draggedIndex === index}
            isDragOver={dragOverIndex === index}
          />
        ))}
      </div>

      {/* Empty State */}
      {configs.length === 0 && !showNewConfig && (
        <PAEmptyView
          icon={BiPlus}
          title={translation.configList.title}
          description={translation.configList.emptyStateDescription}
          actionText={translation.configList.createNew}
          onAction={() => setShowNewConfig(true)}
          buttonSize={controlSize}
        />
      )}
    </div>
  );
}
