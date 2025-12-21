import { useState } from 'react';
import { database, Configuration } from '../lib/database';
import { useNotification } from '../contexts/PANotificationContext';
import { useLanguage } from '../contexts/PALanguageContext';

/**
 * Hook to handle drag and drop logic for configurations.
 */
export function useConfigDnD(configs: Configuration[], onRefresh: () => Promise<void>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const { showError } = useNotification();
  const { translation } = useLanguage();

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex === null) return;
    setDragOverIndex(index);
  }

  async function handleDragEnd() {
    if (draggedIndex === null || dragOverIndex === null) return;

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
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  }

  function handleDragLeave() {
    setDragOverIndex(null);
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
