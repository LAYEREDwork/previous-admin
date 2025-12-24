import { useState } from 'react';
import type { DragState, DragActions } from '../../../shared/types';

/**
 * Hook to manage drag and drop state for reorderable lists.
 * Provides state management and event handlers for drag operations.
 *
 * @returns Object containing drag state and action handlers
 */
export function useDragState(): DragState & DragActions {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  /**
   * Handles the start of a drag operation
   * @param index - The index of the item being dragged
   */
  function handleDragStart(index: number): void {
    setDraggedIndex(index);
  }

  /**
   * Handles drag over events, preventing default behavior
   * @param e - The drag event
   * @param index - The index being dragged over
   */
  function handleDragOver(e: React.DragEvent, index: number): void {
    e.preventDefault();
    if (draggedIndex === null) return;
    setDragOverIndex(index);
  }

  /**
   * Handles the end of a drag operation, resetting state
   */
  function handleDragEnd(): void {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  /**
   * Handles drag leave events, clearing the drag over state
   */
  function handleDragLeave(): void {
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