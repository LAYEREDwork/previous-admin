/**
 * Config Schema Hook
 * 
 * Fetches and caches the configuration schema from the backend.
 * Provides type-safe access to schema structure for dynamic UI generation.
 * 
 * @module frontend/hooks/useConfigSchema
 */

import { useState, useEffect } from 'react';

import { apiPaths } from '@shared/api/constants';
import type { ConfigSchema } from '@shared/previous-config/schema-types';

import { apiBaseUrl } from '../lib/constants';

/**
 * Hook to fetch and manage configuration schema
 * 
 * Loads schema from backend on mount and caches it.
 * Provides loading and error states for UI handling.
 * 
 * @returns Object with schema, loading state, and error state
 * 
 * @example
 * function ConfigEditor() {
 *   const { schema, loading, error } = useConfigSchema();
 *   
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage />;
 *   if (!schema) return null;
 *   
 *   return <div>{Object.keys(schema.sections).map(...)}</div>;
 * }
 */
export function useConfigSchema() {
  const [schema, setSchema] = useState<ConfigSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchema = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiBaseUrl}${apiPaths.ConfigSchema.get.full}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to load configuration schema');
        }

        const data = await response.json();
        setSchema(data);
      } catch (err) {
        console.error('Error loading config schema:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadSchema();
  }, []);

  return { schema, loading, error };
}

/**
 * Hook to reload schema (useful after schema regeneration)
 * 
 * @example
 * const { reload, reloading } = useConfigSchemaReload();
 * 
 * <Button onClick={reload} loading={reloading}>
 *   Reload Schema
 * </Button>
 */
export function useConfigSchemaReload() {
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setReloading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}${apiPaths.ConfigSchema.reload.full}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to reload schema');
      }

      // Trigger page reload to fetch new schema
      window.location.reload();
    } catch (err) {
      console.error('Error reloading schema:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setReloading(false);
    }
  };

  return { reload, reloading, error };
}
