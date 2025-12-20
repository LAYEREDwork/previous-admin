import { BiRefresh } from 'react-icons/bi';
import { IoDocumentText } from 'react-icons/io5';
import { PAButton } from '../controls/PAButton';

// Components
import { PAEmptyView } from '../controls/PAEmptyView';

// Partials
import { ConfigDetailsPartial } from '../partials/config-editor/ConfigDetailsPartial';
import { EditorControlsPartial } from '../partials/config-editor/EditorControlsPartial';
import { EditorViewPartial } from '../partials/config-editor/EditorViewPartial';
import { RawViewPartial } from '../partials/config-editor/RawViewPartial';

// Hooks
import { useControlSize } from '../../hooks/useControlSize';
import { useConfigEditor } from '../../hooks/useConfigEditor';

export function ConfigEditor({ configId, onTabChange }: { configId?: string; onTabChange?: (tab: string) => void }) {
  const {
    config,
    configName,
    configData,
    loading,
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

  const controlSize = useControlSize('md');

  // Show empty view if no saved configs exist
  if (hasSavedConfigs === false || hasSavedConfigs === null) {
    return (
      <PAEmptyView
        icon={IoDocumentText}
        title={translation.configEditor.noSavedConfigs}
        description={translation.configEditor.noSavedConfigsDescription}
        actionText={translation.configEditor.createFirstConfig}
        onAction={() => onTabChange?.('configs')}
      />
    );
  }

  // Show empty view if configs exist but no active config is selected
  if (hasSavedConfigs === true && configId === undefined && configName === null) {
    return (
      <PAEmptyView
        icon={IoDocumentText}
        title={translation.configEditor.noConfigSelected}
        description={translation.configEditor.noConfigSelectedDescription}
        actionText={translation.configEditor.goToSavedConfigs}
        onAction={() => onTabChange?.('configs')}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BiRefresh className="w-8 h-8 text-next-accent animate-spin mb-2" />
        <p className="text-gray-500 dark:text-gray-400">{translation.common.loading || 'Loading...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{translation.configEditor.errorLoading}</p>
          <PAButton
            onClick={refreshConfig}
            appearance="primary"
            color="accent"
            className="flex items-center gap-2 mx-auto"
            size={controlSize}
          >
            <BiRefresh size={16} />
            {translation.common.reload || 'Reload'}
          </PAButton>
        </div>
      </div>
    );
  }

  if (!config || !configData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BiRefresh className="w-8 h-8 text-next-accent animate-spin mb-2" />
        <p className="text-gray-500 dark:text-gray-400">{translation.common.loading || 'Loading...'}</p>
      </div>
    );
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
