import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useResponsiveControlSize } from '@frontend/hooks/useResponsiveControlSize';
import { PASize } from '@frontend/lib/types/sizes';

describe('useControlSize', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    // Restore original window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it('should return default size when window width is above 640px', () => {
    const { result } = renderHook(() => useResponsiveControlSize(PASize.lg));
    expect(result.current).toBe(PASize.lg);
  });

  it('should return "sm" when window width is below 640px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { result } = renderHook(() => useResponsiveControlSize(PASize.lg));
    expect(result.current).toBe(PASize.sm);
  });

  it('should default to "md" when no defaultSize is provided', () => {
    const { result } = renderHook(() => useResponsiveControlSize());
    expect(result.current).toBe(PASize.md);
  });

  it('should update size on window resize', () => {
    const { result } = renderHook(() => useResponsiveControlSize(PASize.lg));

    // Initially lg
    expect(result.current).toBe(PASize.lg);

    // Simulate resize to small screen
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(PASize.sm);
  });
});