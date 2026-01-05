/**
 * Tests for useConfigSchema hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import type { ConfigSchema } from '@shared/previous-config/schema-types';

import { useConfigSchema, useConfigSchemaReload } from '../hooks/useConfigSchema';

// Mock fetch globally
global.fetch = vi.fn();

describe('useConfigSchema', () => {
  const mockSchema: ConfigSchema = {
    sections: {
      System: {
        name: 'System',
        displayName: 'System Settings',
        description: 'Core system configuration',
        sfSymbol: 'gearshape',
        parameters: [
          {
            name: 'machine_type',
            type: 'enum',
            possibleValues: ['next', 'nextcube', 'nextstation'],
            labels: ['NeXT Computer', 'NeXTcube', 'NeXTstation'],
            default: 'next',
            displayName: 'Machine Type',
            description: 'Select machine type',
            required: true,
          },
        ],
      },
    },
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('fetches schema on mount', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchema,
    });
    
    const { result } = renderHook(() => useConfigSchema());
    
    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.schema).toBeNull();
    expect(result.current.error).toBeNull();
    
    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.schema).toEqual(mockSchema);
    expect(result.current.error).toBeNull();
    // Verify fetch was called (with full URL and options)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/config/schema'),
      expect.any(Object)
    );
  });
  
  it('handles fetch error', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => useConfigSchema());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.schema).toBeNull();
    expect(result.current.error).toBe('Network error');
  });
  
  it('handles non-ok response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    
    const { result } = renderHook(() => useConfigSchema());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.schema).toBeNull();
    expect(result.current.error).toBe('Failed to load configuration schema');
  });
  
  it('caches schema on first load', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchema,
    });
    
    const { result } = renderHook(() => useConfigSchema());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.schema).toEqual(mockSchema);
  });
});

describe('useConfigSchemaReload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { reload: vi.fn() };
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('sends POST request to reload endpoint', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    
    const { result } = renderHook(() => useConfigSchemaReload());
    
    expect(result.current.reloading).toBe(false);
    
    // Trigger reload
    await result.current.reload();
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/config/schema/reload'),
      expect.objectContaining({
        method: 'POST',
      })
    );
  });
  
  it('reloads page after successful schema reload', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    
    const { result } = renderHook(() => useConfigSchemaReload());
    
    await result.current.reload();
    
    // Wait a bit for the setTimeout to execute
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    expect(window.location.reload).toHaveBeenCalled();
  });
  
  it('handles reload error', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => useConfigSchemaReload());
    
    await result.current.reload();
    
    // Wait for the error state to be set after async operation
    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });
    
    expect(window.location.reload).not.toHaveBeenCalled();
  });
  
  it('handles non-ok response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    
    const { result } = renderHook(() => useConfigSchemaReload());
    
    await result.current.reload();
    
    await waitFor(() => {
      expect(result.current.error).toBe('Failed to reload schema');
    });
    
    expect(window.location.reload).not.toHaveBeenCalled();
  });
});
