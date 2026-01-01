import { BiRefresh } from 'react-icons/bi';
import { IoDocumentText } from 'react-icons/io5';
import { PAButton } from '../controls/PAButton';

// Components
import { PAEmptyView } from '../controls/PAEmptyView';

// Partials
import { ConfigDetailsPartial } from '../partials/config-editor/PAConfigDetailsPartial';
import { EditorControlsPartial } from '../partials/config-editor/PAEditorControlsPartial';
import { EditorViewPartial } from '../partials/config-editor/PAEditorViewPartial';
import { RawViewPartial } from '../partials/config-editor/PARawViewPartial';

// Hooks
import { useResponsiveControlSize } from '../../hooks/useResponsiveControlSize';
import { useConfigEditor } from '../../hooks/useConfigEditor';

export function PAConfigEditor({ configId, onTabChange }: { configId?: string | null; onTabChange?: (tab: string) => void }) {
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

  const controlSize = useResponsiveControlSize('md');

  // 1. Loading state must come first
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BiRefresh className="w-8 h-8 text-next-accent animate-spin mb-2" />
        <p className="text-gray-500 dark:text-gray-400">{translation.common.loading || 'Loading...'}</p>
      </div>
    );
  }

  // 2. Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{translation.configEditor.errorLoading}</p>
          <PAButton
            onClick={refreshConfig}
            appearance="primary"
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

  // 3. Handle cases where no config is selected or none exists
  if (!configId) {
    if (hasSavedConfigs === false) {
      return (
        <PAEmptyView
          icon={IoDocumentText}
          title={translation.configEditor.noSavedConfigs}
          description={translation.configEditor.noSavedConfigsDescription}
          actionText={translation.configEditor.createFirstConfig}
          onAction={() => onTabChange?.('configs')}
          buttonSize={controlSize}
        />
      );
    }

    if (hasSavedConfigs === true && configName === null) {
      return (
        <PAEmptyView
          icon={IoDocumentText}
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
