import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useDragState } from '@frontend/hooks/useDragState';

describe('useDragState', () => {
  it('should initialize with null indices', () => {
    const { result } = renderHook(() => useDragState());

    expect(result.current.draggedIndex).toBeNull();
    expect(result.current.dragOverIndex).toBeNull();
  });

  it('should set draggedIndex when handleDragStart is called', () => {
    const { result } = renderHook(() => useDragState());

    act(() => {
      result.current.handleDragStart(2);
    });

    expect(result.current.draggedIndex).toBe(2);
    expect(result.current.dragOverIndex).toBeNull();
  });

  it('should set dragOverIndex when handleDragOver is called and draggedIndex is set', () => {
    const { result } = renderHook(() => useDragState());
    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragStart(1);
    });

    act(() => {
      result.current.handleDragOver(mockEvent, 3);
    });

    expect(result.current.draggedIndex).toBe(1);
    expect(result.current.dragOverIndex).toBe(3);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should not set dragOverIndex when handleDragOver is called but draggedIndex is null', () => {
    const { result } = renderHook(() => useDragState());
    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragOver(mockEvent, 3);
    });

    expect(result.current.draggedIndex).toBeNull();
    expect(result.current.dragOverIndex).toBeNull();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should reset indices when handleDragEnd is called', () => {
    const { result } = renderHook(() => useDragState());

    act(() => {
      result.current.handleDragStart(1);
    });

    act(() => {
      result.current.handleDragOver({ preventDefault: vi.fn() } as unknown as React.DragEvent, 2);
    });

    act(() => {
      result.current.handleDragEnd();
    });

    expect(result.current.draggedIndex).toBeNull();
    expect(result.current.dragOverIndex).toBeNull();
  });

  it('should reset dragOverIndex when handleDragLeave is called', () => {
    const { result } = renderHook(() => useDragState());

    act(() => {
      result.current.handleDragStart(1);
    });

    act(() => {
      result.current.handleDragOver({ preventDefault: vi.fn() } as unknown as React.DragEvent, 2);
    });

    act(() => {
      result.current.handleDragLeave();
    });

    expect(result.current.draggedIndex).toBe(1);
    expect(result.current.dragOverIndex).toBeNull();
  });

  it('should return all required functions', () => {
    const { result } = renderHook(() => useDragState());

    expect(typeof result.current.handleDragStart).toBe('function');
    expect(typeof result.current.handleDragOver).toBe('function');
    expect(typeof result.current.handleDragEnd).toBe('function');
    expect(typeof result.current.handleDragLeave).toBe('function');
  });

  it('should maintain state correctly through multiple operations', () => {
    const { result } = renderHook(() => useDragState());

    // Start dragging
    act(() => {
      result.current.handleDragStart(0);
    });
    expect(result.current.draggedIndex).toBe(0);

    // Drag over another item
    act(() => {
      result.current.handleDragOver({ preventDefault: vi.fn() } as unknown as React.DragEvent, 1);
    });
    expect(result.current.dragOverIndex).toBe(1);

    // Drag over another item
    act(() => {
      result.current.handleDragOver({ preventDefault: vi.fn() } as unknown as React.DragEvent, 2);
    });
    expect(result.current.dragOverIndex).toBe(2);

    // Leave drag area
    act(() => {
      result.current.handleDragLeave();
    });
    expect(result.current.dragOverIndex).toBeNull();

    // End drag
    act(() => {
      result.current.handleDragEnd();
    });
    expect(result.current.draggedIndex).toBeNull();
    expect(result.current.dragOverIndex).toBeNull();
  });
});