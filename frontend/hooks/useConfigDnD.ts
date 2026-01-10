import { useLanguage } from '@frontend/contexts/PALanguageContext';
import { useModal } from '@frontend/hooks/useModal';
import { database, Configuration } from '@frontend/lib/database';

import { useDragState } from './useDragState';

/**
 * Hook to handle drag and drop logic for configurations.
 * Uses the generic useDragState hook and adds configuration-specific logic.
 */
export function useConfigDnD(configs: Configuration[], onRefresh: () => Promise<void>) {
  const { showError } = useModal();
  const { translation } = useLanguage();

  const {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd: baseHandleDragEnd,
    handleDragLeave,
  } = useDragState();

  /**
   * Handles the end of a drag operation with configuration-specific logic
   */
  async function handleDragEnd() {
    if (draggedIndex === null || dragOverIndex === null) {
      baseHandleDragEnd();
      return;
    }

    try {
      const newConfigs = [...configs];
      const draggedItem = newConfigs[draggedIndex];
      newConfigs.splice(draggedIndex, 1);
      newConfigs.splice(dragOverIndex, 0, draggedItem);

      const orderedIds = newConfigs.map(config => config.id);
      await database.updateConfigurationsOrder(orderedIds);
      await onRefresh();
    } catch (error) {
      console.error('Error updating order:', error);
      showError(translation.configList.errorUpdatingOrder);
      await onRefresh();
    } finally {
      baseHandleDragEnd();
    }
  }

  return {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
  };
}
