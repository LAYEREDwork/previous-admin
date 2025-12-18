import { BiPlus, BiTrash, BiEdit, BiMenu, BiCheckCircle, BiCircle, BiUpload } from 'react-icons/bi';
import { IoDocumentsOutline, IoDocumentText } from 'react-icons/io5';
import { Button, Input, IconButton } from 'rsuite';

// Components
import { CenteredModal } from '../controls/CenteredModal';

// Hooks
import { useLanguage } from '../../contexts/LanguageContext';
import { useControlSize } from '../../hooks/useControlSize';
import { useConfigListLogic } from '../../hooks/useConfigList';

// Types/Utilities
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
      {configs.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {translation.configList.title}
          </h2>
          <Button
            onClick={() => setShowNewConfig(true)}
            appearance="primary"
            className="flex items-center gap-2"
            size={controlSize}
          >
            <BiPlus size={18} />
            {translation.configList.newConfig}
          </Button>
        </div>
      )}

      <CenteredModal
        open={showNewConfig}
        onClose={() => handleCloseNewConfigModal()}
        size="sm"
      >
        <CenteredModal.Header>
          <CenteredModal.Title>
            <IoDocumentText size={32} className="inline-block mr-2 -mt-0.5" />
            {translation.configList.newConfig}
          </CenteredModal.Title>
        </CenteredModal.Header>
        <CenteredModal.Body>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translation.configEditor.configName}
              </label>
              <Input
                inputRef={newConfigNameRef}
                value={newConfigName}
                onChange={setNewConfigName}
                placeholder={translation.configEditor.configNamePlaceholder}
                size={controlSize}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translation.configList.description}
              </label>
              <Input
                as="textarea"
                value={newConfigDesc}
                onChange={setNewConfigDesc}
                rows={3}
                placeholder={translation.configList.description}
                size={controlSize}
              />
            </div>
          </div>
        </CenteredModal.Body>
        <CenteredModal.Footer>
          <Button
            onClick={() => handleCloseNewConfigModal()}
            appearance="subtle"
            size={controlSize}
          >
            {translation.common.cancel}
          </Button>
          <Button
            onClick={createConfig}
            disabled={!newConfigName.trim()}
            appearance="primary"
            size={controlSize}
          >
            {translation.common.save}
          </Button>
        </CenteredModal.Footer>
      </CenteredModal>

      <div className="grid gap-3">
        {configs.map((config, index) => (
          <div key={config.id} className="relative">
            {dragOverIndex === index && draggedIndex !== index && (
              <div className="absolute -top-1 left-0 right-0 h-1 bg-next-accent rounded-full z-10"></div>
            )}
            <div
              draggable={configs.length > 1}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 sm:p-3 hover:shadow-md transition-all ${configs.length > 1 ? 'cursor-move' : ''
                } ${draggedIndex === index ? 'opacity-50 scale-95' : ''} ${dragOverIndex === index && draggedIndex !== index ? 'border-next-accent' : ''
                } relative`}
            >
              {config.is_active && (
                <div className="absolute top-0 left-0 z-10">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-tl-lg rounded-br-lg shadow-sm border-b border-r border-green-200 dark:border-green-800">
                    {translation.configList.active}
                  </span>
                </div>
              )}

              <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${config.is_active ? 'pt-6 sm:pt-0' : ''}`}>
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {configs.length > 1 && (
                    <div className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0">
                      <BiMenu size={18} className="sm:w-5 sm:h-5" />
                    </div>
                  )}
                  <IconButton
                    onClick={() => setActiveConfig(config.id)}
                    icon={config.is_active ? <BiCheckCircle size={18} className="text-green-500" /> : <BiCircle size={18} />}
                    appearance="subtle"
                    size="sm"
                    title={config.is_active ? 'Active configuration' : 'Set as active'}
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                        {config.name}
                      </h3>
                    </div>
                    {config.description && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:truncate">
                        {config.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <IconButton
                    icon={<BiUpload />}
                    size="sm"
                    appearance="default"
                    onClick={() => exportSingleConfig(config)}
                    title="Export configuration"
                  />
                  <IconButton
                    icon={<BiEdit />}
                    size="sm"
                    appearance="default"
                    onClick={() => onEdit(config)}
                    title={translation.configList.edit}
                  />
                  <IconButton
                    icon={<BiTrash />}
                    size="sm"
                    appearance="default"
                    onClick={() => deleteConfig(config.id)}
                    title={translation.configList.delete}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {configs.length === 0 && !showNewConfig && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4">
          <div className="text-gray-300 dark:text-gray-600 mb-6">
            <IoDocumentsOutline size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {translation.configList.emptyStateTitle}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">
            {translation.configList.emptyStateDescription}
          </p>
          <Button
            onClick={() => setShowNewConfig(true)}
            appearance="primary"
            size={controlSize}
            className="flex items-center gap-2"
          >
            <BiPlus size={18} />
            {translation.configList.newConfig}
          </Button>
        </div>
      )}
    </div>
  );
}
