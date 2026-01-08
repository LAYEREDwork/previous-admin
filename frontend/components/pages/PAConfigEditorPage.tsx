import { useState, useRef } from 'react';

import { PAButton } from '@frontend/components/controls/PAButton';

// Components
import { PAEmptyView } from '@frontend/components/controls/PAEmptyView';

// Partials
import { PANoConfigurationsEmptyView } from '@frontend/components/PANoConfigurationsEmptyView';
import { ConfigDetailsPartial } from '@frontend/components/partials/config-editor/PAConfigDetailsPartial';
import { EditorControlsPartial } from '@frontend/components/partials/config-editor/PAEditorControlsPartial';
import { EditorViewPartial } from '@frontend/components/partials/config-editor/PAEditorViewPartial';
import { RawViewPartial } from '@frontend/components/partials/config-editor/PARawViewPartial';
import { PANewConfigModalPartial } from '@frontend/components/partials/config-list/PANewConfigModalPartial';

// Hooks
import { 
  SFArrowTrianglehead2ClockwiseRotate90CircleFill, 
  SFLongTextPageAndPencilFill 
} from '@frontend/components/sf-symbols';
import { useConfigActions } from '@frontend/hooks/useConfigActions';
import { useConfigEditor } from '@frontend/hooks/useConfigEditor';
import { usePageBase } from '@frontend/hooks/usePageBase';

export function PAConfigEditor({ configId, onTabChange }: { configId?: string | null; onTabChange?: (tab: string) => void }) {
  // Modal states for creating new configuration
  const [showNewConfig, setShowNewConfig] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');
  const [newConfigDesc, setNewConfigDesc] = useState('');
  const newConfigNameRef = useRef<HTMLInputElement | null>(null);

  const { controlSize } = usePageBase();

  const {
    config,
    configName,
    configData,
    error,
    saving,
    viewMode,
    localName,
    localDescription,
    hasChanges,
    hasSavedConfigs,
    expandedSections,
    setViewMode,
    setLocalName,
    setLocalDescription,
    setExpandedSections,
    toggleAllSections,
    handleSave,
    handleUpdateMetadata,
    updateConfigField,
    copyToClipboard,
    refreshConfig,
    convertToConfigFile,
    translation,
  } = useConfigEditor(configId);

  // Create a dummy refresh function for useConfigActions
  const dummyRefresh = async () => {
    // Just switch to configs tab - it will refresh there
    onTabChange?.('configs');
  };

  const { createConfig } = useConfigActions(dummyRefresh);

  // Handle new configuration creation
  const handleCreateNewConfig = async () => {
    if (newConfigName.trim()) {
      try {
        await createConfig(newConfigName, newConfigDesc, true);
        setShowNewConfig(false);
        setNewConfigName('');
        setNewConfigDesc('');
        // Switch to configs tab after creation
        onTabChange?.('configs');
      } catch (err) {
        console.error('Failed to create configuration:', err);
      }
    }
  };

  const handleCloseNewConfigModal = () => {
    setShowNewConfig(false);
    setNewConfigName('');
    setNewConfigDesc('');
  };

  // 1. Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <p className="text-[var(--rs-text-secondary)] mb-4">{translation.configEditor.errorLoading}</p>
          <PAButton
            onClick={refreshConfig}
            appearance="primary"
            className="flex items-center gap-2 mx-auto"
            size={controlSize}
          >
            <SFArrowTrianglehead2ClockwiseRotate90CircleFill size={16} />
            {translation.common.reload || 'Reload'}
          </PAButton>
        </div>
      </div>
    );
  }

  // 2. Still loading saved configs state - show nothing to prevent flash
  if (!configId && hasSavedConfigs === null) {
    return null;
  }

  // 3. Handle cases where no config is selected or none exists
  if (!configId) {
    if (hasSavedConfigs === false) {
      return (
        <>
          <PANewConfigModalPartial
            open={showNewConfig}
            onClose={handleCloseNewConfigModal}
            onSave={handleCreateNewConfig}
            name={newConfigName}
            setName={setNewConfigName}
            description={newConfigDesc}
            setDescription={setNewConfigDesc}
            nameRef={newConfigNameRef}
            controlSize={controlSize}
            translation={translation}
          />
          <PANoConfigurationsEmptyView
            onCreateNew={() => setShowNewConfig(true)}
            buttonSize={controlSize}
          />
        </>
      );
    }

    if (hasSavedConfigs === true && configName === null) {
      return (
        <PAEmptyView
          icon={SFLongTextPageAndPencilFill}
          title={translation.configEditor.noConfigSelected}
          description={translation.configEditor.noConfigSelectedDescription}
          actionText={translation.configEditor.goToSavedConfigs}
          onAction={() => onTabChange?.('configs')}
          buttonSize={controlSize}
        />
      );
    }
  }

  // 4. Ensure we have config data before rendering the editor
  if (!config || !configData) {
    return null;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Configuration Metadata Section */}
      <ConfigDetailsPartial
        localName={localName}
        setLocalName={setLocalName}
        localDescription={localDescription}
        setLocalDescription={setLocalDescription}
        hasChanges={hasChanges}
        handleUpdateMetadata={handleUpdateMetadata}
        controlSize={controlSize}
        translation={translation}
      />

      {/* Title & Global Controls */}
      <EditorControlsPartial
        viewMode={viewMode}
        setViewMode={setViewMode}
        saving={saving}
        handleSave={handleSave}
        expandedSections={expandedSections}
        toggleAllSections={toggleAllSections}
        controlSize={controlSize}
        translation={translation}
      />

      {/* Editor or Raw View */}
      {viewMode === 'raw' ? (
        <RawViewPartial
          configData={configData}
          convertToConfigFile={convertToConfigFile}
          copyToClipboard={copyToClipboard}
          translation={translation}
        />
      ) : (
        <EditorViewPartial
          configData={configData}
          updateConfigField={updateConfigField}
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
          controlSize={controlSize}
          translation={translation}
        />
      )}
    </div>
  );
}
