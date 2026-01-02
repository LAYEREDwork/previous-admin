/**
 * Configuration service
 *
 * Business logic for configuration management.
 * Handles validation, processing, and coordination between database and platform.
 *
 * @module backend/services/configurationService
 */

import {
  getConfigurations as dbGetConfigurations,
  getConfiguration as dbGetConfiguration,
  createConfiguration as dbCreateConfiguration,
  updateConfiguration as dbUpdateConfiguration,
  deleteConfiguration as dbDeleteConfiguration,
  setActiveConfiguration as dbSetActiveConfiguration,
  updateConfigurationsOrder as dbUpdateConfigurationsOrder,
  getActiveConfiguration as dbGetActiveConfiguration,
} from '../database/configurations';
import type {
  Configuration,
  CreateConfigurationRequest,
  UpdateConfigurationRequest,
  PreviousConfig
} from '../types';

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
 * @throws Error if not found or in use
 */
export function deleteConfiguration(id: string): void {
  // Check if configuration exists
  const config = dbGetConfiguration(id);
  if (!config) {
    throw new Error('Configuration not found');
  }

  // Prevent deletion of active configuration
  const active = dbGetActiveConfiguration();
  if (active && active.id === id) {
    throw new Error('Cannot delete active configuration');
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
 * @param config - Configuration to validate
 * @throws Error if invalid
 */
function validateConfiguration(config: PreviousConfig): void {
  if (!config) {
    throw new Error('Configuration is required');
  }

  // Basic validation - could be extended
  if (typeof config.system !== 'object' || !config.system.cpu_type) {
    throw new Error('Invalid CPU configuration');
  }

  // Add more validation as needed
}
