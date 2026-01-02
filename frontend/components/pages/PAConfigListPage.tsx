

// Components
import { useState, useRef } from 'react';
import { PANoConfigurationsEmptyView } from '../PANoConfigurationsEmptyView';

// Partials
import { ConfigListItemPartial } from '../partials/config-list/PAConfigListItemPartial';
import { PAConfigListHeaderPartial } from '../partials/config-list/PAConfigListHeaderPartial';
import { NewConfigModalPartial } from '../partials/config-list/PANewConfigModalPartial';

// Hooks
import { useLanguage } from '../../contexts/PALanguageContext';
import { useResponsiveControlSize } from '../../hooks/useResponsiveControlSize';
import { useConfigListLogic } from '../../hooks/useConfigList';
import { PASize } from '../../lib/types/sizes';

// Types
import { Configuration } from '../../lib/database';

interface ConfigListProps {
  onEdit: (config: Configuration) => void;
}

export function PAConfigList({ onEdit }: ConfigListProps) {
  const { translation } = useLanguage();
  const controlSize = useResponsiveControlSize(PASize.md);

  // Duplicate modal states
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateConfigName, setDuplicateConfigName] = useState('');
  const [duplicateConfigDesc, setDuplicateConfigDesc] = useState('');
  const duplicateConfigNameRef = useRef<HTMLInputElement>(null);
  const [duplicatingConfig, setDuplicatingConfig] = useState<Configuration | null>(null);

  const {
    configs,
    showNewConfig,
    setShowNewConfig,
    newConfigName,
    setNewConfigName,
    newConfigDesc,
    setNewConfigDesc,
    newConfigNameRef,
    createConfig,
    deleteConfig,
    duplicateConfig: performDuplicate,
    exportSingleConfig,
    setActiveConfig,
    handleCloseNewConfigModal,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
    dragOverIndex,
  } = useConfigListLogic(onEdit);

  // Handle duplicate - show modal with prefilled data
  const handleDuplicateClick = (config: Configuration) => {
    setDuplicatingConfig(config);
    setDuplicateConfigName(config.name + translation.configList.copySuffix);
    setDuplicateConfigDesc(config.description);
    setShowDuplicateModal(true);
  };

  // Handle saving the duplicated config
  const handleSaveDuplicate = async () => {
    if (duplicatingConfig && duplicateConfigName.trim()) {
      // Manually create the duplicate with the user's edited values
      await performDuplicate({
        ...duplicatingConfig,
        name: duplicateConfigName,
        description: duplicateConfigDesc,
      } as Configuration);
      setShowDuplicateModal(false);
      setDuplicatingConfig(null);
      setDuplicateConfigName('');
      setDuplicateConfigDesc('');
    }
  };

  const handleCloseDuplicateModal = () => {
    setShowDuplicateModal(false);
    setDuplicatingConfig(null);
    setDuplicateConfigName('');
    setDuplicateConfigDesc('');
  };

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

      {/* Duplicate Configuration Modal */}
      <NewConfigModalPartial
        open={showDuplicateModal}
        onClose={handleCloseDuplicateModal}
        onSave={handleSaveDuplicate}
        name={duplicateConfigName}
        setName={setDuplicateConfigName}
        description={duplicateConfigDesc}
        setDescription={setDuplicateConfigDesc}
        nameRef={duplicateConfigNameRef}
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
            duplicateConfig={handleDuplicateClick}
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
            isDragOver={dragOverIndex === index}
          />
        ))}
      </div>

      {/* Empty State */}
      {configs.length === 0 && !showNewConfig && (
        <PANoConfigurationsEmptyView
          onCreateNew={() => setShowNewConfig(true)}
          buttonSize={controlSize}
        />
      )}
    </div>
  );
}
