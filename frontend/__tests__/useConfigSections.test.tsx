import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useConfigSections } from '@frontend/hooks/useConfigSections';

describe('useConfigSections', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it('should initialize with default sections', () => {
    const { result } = renderHook(() => useConfigSections());

    expect(result.current.expandedSections).toEqual({
      system: true,
      display: false,
      scsi: false,
      network: false,
      sound: false,
      boot: false,
      input: false,
    });
  });

  it('should load state from localStorage', () => {
    const savedState = {
      system: false,
      display: true,
      scsi: true,
    };
    localStorage.setItem('configEditorSectionsExpanded', JSON.stringify(savedState));

    const { result } = renderHook(() => useConfigSections());

    expect(result.current.expandedSections).toEqual({
      system: false,
      display: true,
      scsi: true,
      network: false, // default
      sound: false,   // default
      boot: false,    // default
      input: false,   // default
    });
  });

  it('should expand all sections when not all are expanded', () => {
    const { result } = renderHook(() => useConfigSections());

    // Initial state: system is true, others are false - not all expanded
    expect(result.current.expandedSections.system).toBe(true);
    expect(result.current.expandedSections.display).toBe(false);

    act(() => {
      result.current.toggleAllSections();
    });

    // All should be expanded (true)
    Object.values(result.current.expandedSections).forEach(expanded => {
      expect(expanded).toBe(true);
    });
  });

  it('should collapse all sections when all are expanded', () => {
    const { result } = renderHook(() => useConfigSections());

    // First expand all
    act(() => {
      result.current.toggleAllSections();
    });

    // Verify all are expanded
    Object.values(result.current.expandedSections).forEach(expanded => {
      expect(expanded).toBe(true);
    });

    // Now toggle again
    act(() => {
      result.current.toggleAllSections();
    });

    // All should be collapsed (false)
    Object.values(result.current.expandedSections).forEach(expanded => {
      expect(expanded).toBe(false);
    });
  });

  it('should persist state to localStorage', () => {
    const { result } = renderHook(() => useConfigSections());

    act(() => {
      result.current.setExpandedSections({
        ...result.current.expandedSections,
        display: true,
      });
    });

    const saved = localStorage.getItem('configEditorSectionsExpanded');
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved!);
    expect(parsed.display).toBe(true);
  });
});