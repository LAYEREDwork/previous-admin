/**
 * Configuration service
 *
 * Business logic for configuration management.
 * Handles validation, processing, and coordination between database and platform.
 *
 * @module backend/services/configurationService
 */

import { readFileSync } from 'fs';
import { join } from 'path';

import { validateConfiguration as schemaValidateConfiguration } from '@backend/config-schema/validator';
import {
  getConfigurations as dbGetConfigurations,
  getConfiguration as dbGetConfiguration,
  createConfiguration as dbCreateConfiguration,
  updateConfiguration as dbUpdateConfiguration,
  deleteConfiguration as dbDeleteConfiguration,
  setActiveConfiguration as dbSetActiveConfiguration,
  updateConfigurationsOrder as dbUpdateConfigurationsOrder,
  getActiveConfiguration as dbGetActiveConfiguration,
} from '@backend/database/configurations';
import type {
  Configuration,
  CreateConfigurationRequest,
  UpdateConfigurationRequest,
  PreviousConfig
} from '@backend/types';

import type { ConfigSchema } from '../../shared/previous-config/schema-types';

// Cache for schema (loaded once)
let schemaCache: ConfigSchema | null = null;

/**
 * Load configuration schema
 * 
 * Loads schema from generated JSON file. Caches result for performance.
 */
function loadSchema(): ConfigSchema {
  if (schemaCache) {
    return schemaCache;
  }

  try {
    const schemaPath = join(__dirname, '../../shared/previous-config/schema.json');
    const schemaContent = readFileSync(schemaPath, 'utf-8');
    schemaCache = JSON.parse(schemaContent) as ConfigSchema;
    return schemaCache;
  } catch (error) {
    console.error('Failed to load config schema:', error);
    throw new Error('Config schema not found. Run "npm run generate:schema" first.');
  }
}

/**
 * Get all configurations
 *
 * @returns Array of configurations
 */
export function getConfigurations(): Configuration[] {
  return dbGetConfigurations();
}

/**
 * Get configuration by ID
 *
 * @param id - Configuration ID
 * @returns Configuration object or null
 */
export function getConfigurationById(id: string): Configuration | null {
  return dbGetConfiguration(id) || null;
}

/**
 * Create new configuration
 *
 * @param request - Configuration creation request
 * @returns Created configuration
 * @throws Error if validation fails
 */
export function createConfiguration(
  request: CreateConfigurationRequest
): Configuration {
  // Validate configuration data
  validateConfiguration(request.config_data);

  return dbCreateConfiguration(request);
}

/**
 * Update existing configuration
 *
 * @param id - Configuration ID
 * @param request - Update request
 * @returns Updated configuration
 * @throws Error if validation fails or not found
 */
export function updateConfiguration(
  id: string,
  request: UpdateConfigurationRequest
): Configuration {
  // Validate if configuration exists
  const existing = dbGetConfiguration(id);
  if (!existing) {
    throw new Error('Configuration not found');
  }

  // Validate configuration data if provided
  if (request.config_data) {
    validateConfiguration(request.config_data);
  }

  const result = dbUpdateConfiguration(id, request);
  if (!result) {
    throw new Error('Configuration not found');
  }

  return result;
}

/**
 * Delete configuration
 *
 * @param id - Configuration ID
 * @throws Error if not found
 */
export function deleteConfiguration(id: string): void {
  // Check if configuration exists
  const config = dbGetConfiguration(id);
  if (!config) {
    throw new Error('Configuration not found');
  }

  dbDeleteConfiguration(id);
}

/**
 * Set active configuration
 *
 * @param id - Configuration ID
 * @throws Error if not found
 */
export function setActiveConfiguration(id: string): void {
  const config = dbGetConfiguration(id);
  if (!config) {
    throw new Error('Configuration not found');
  }

  dbSetActiveConfiguration(id);
}

/**
 * Update configuration order
 *
 * @param orderedIds - Array of configuration IDs in new order
 */
export function updateConfigurationOrder(
  orderedIds: string[]
): void {
  dbUpdateConfigurationsOrder(orderedIds);
}

/**
 * Get active configuration
 *
 * @returns Active configuration or null
 */
export function getActiveConfiguration(): Configuration | null {
  return dbGetActiveConfiguration();
}

/**
 * Validate configuration object
 *
 * Uses schema-based validation for comprehensive type checking and
 * constraint validation. Falls back to basic validation if schema
 * is not available.
 *
 * @param config - Configuration to validate
 * @throws Error if invalid
 */
function validateConfiguration(config: PreviousConfig): void {
  if (!config) {
    throw new Error('Configuration is required');
  }

  // Try schema-based validation first
  try {
    const schema = loadSchema();
    
    // Convert config to Record<string, Record<string, any>> for validation
    const configObj: Record<string, Record<string, any>> = {};
    
    // Map PreviousConfig structure to section-based structure
    // This is a simplified mapping - in production you might need more sophisticated conversion
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'object' && value !== null) {
        configObj[key] = value as Record<string, any>;
      }
    }
    
    const result = schemaValidateConfiguration(configObj, schema);
    
    if (!result.valid) {
      throw new Error(result.error || 'Configuration validation failed');
    }
  } catch (schemaError) {
    // Schema validation failed - fall back to basic validation
    console.warn('Schema validation unavailable, using basic validation:', schemaError);
    
    // Basic validation
    if (typeof config.system !== 'object' || !config.system.cpu_type) {
      throw new Error('Invalid CPU configuration');
    }
  }
}
