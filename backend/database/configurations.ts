/**
 * Configuration management module
 *
 * Handles CRUD operations for configuration profiles.
 * Each configuration is stored with metadata and timestamps.
 *
 * @module backend/database/configurations
 */

import { v4 as uuidv4 } from 'uuid';

import type { PreviousConfig } from '@shared/previous-config/types';

import type { Configuration, CreateConfigurationRequest, UpdateConfigurationRequest } from '@backend/types';

import { getDatabase } from './core';

/**
 * Generate UUID v4 for configuration ID
 * Note: Using uuid package is more reliable than manual generation
 */
function generateConfigurationId(): string {
  return uuidv4();
}

/**
 * Get all configurations
 *
 * @returns Array of configuration objects
 */
export function getConfigurations(): Configuration[] {
  const database = getDatabase();
  
  const query = `
        SELECT id, name, description, config_data, is_active, 
          created_at, updated_at, sort_order
    FROM configurations
    ORDER BY sort_order ASC
  `;

  const configurations = database.prepare(query).all() as any[];

  return configurations.map((config: any) => ({
    id: config.id,
    name: config.name,
    description: config.description,
    config_data: JSON.parse(config.config_data),
    is_active: !!config.is_active,
    created_at: config.created_at,
    updated_at: config.updated_at,
    sort_order: config.sort_order,
  })) as Configuration[];
}

/**
 * Get configuration by ID
 *
 * @param configurationId - Configuration ID
 * @returns Configuration object or undefined if not found
 */
export function getConfiguration(configurationId: string): Configuration | undefined {
  const database = getDatabase();
  
  const config = database
    .prepare(`
            SELECT id, name, description, config_data, is_active, 
              created_at, updated_at, sort_order
      FROM configurations
      WHERE id = ?
    `)
    .get(configurationId);

  if (!config) {
    return undefined;
  }

  const c = config as any;

  return {
    id: c.id,
    name: c.name,
    description: c.description,
    config_data: JSON.parse(c.config_data) as PreviousConfig,
    is_active: !!c.is_active,
    created_at: c.created_at,
    updated_at: c.updated_at,
    sort_order: c.sort_order,
  } as Configuration;
}

/**
 * Get active configuration
 *
 * @returns Active configuration or undefined if none exists
 */
export function getActiveConfiguration(): Configuration | undefined {
  const database = getDatabase();
  
  const query = `
    SELECT id, name, description, config_data, is_active, 
           created_at, updated_at, sort_order
    FROM configurations 
    WHERE is_active = 1
    LIMIT 1
  `;

  const activeConfig = database.prepare(query).get() as any;

  if (!activeConfig) {
    return undefined;
  }

  return {
    id: activeConfig.id,
    name: activeConfig.name,
    description: activeConfig.description,
    config_data: JSON.parse(activeConfig.config_data) as PreviousConfig,
    is_active: !!activeConfig.is_active,
    created_at: activeConfig.created_at,
    updated_at: activeConfig.updated_at,
    sort_order: activeConfig.sort_order,
  } as Configuration;
}

/**
 * Create new configuration
 *
 * @param request - Configuration creation request
 * @returns Created configuration object
 */
export function createConfiguration(
  request: CreateConfigurationRequest
): Configuration {
  const configurationId = generateConfigurationId();
  const now = new Date().toISOString();
  const database = getDatabase();

  console.log('Creating configuration:', request.name, 'is_active:', request.is_active);

  database.prepare('BEGIN TRANSACTION').run();

  try {
    // If this config should be active, deactivate all others first
    if (request.is_active) {
      console.log('Deactivating all other configs');
      database
        .prepare('UPDATE configurations SET is_active = 0')
        .run();
    }

    // Get next sort order
    const maxOrderResult = database
      .prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as nextOrder FROM configurations')
      .get() as { nextOrder: number };

    database
      .prepare(`
        INSERT INTO configurations (id, name, description, config_data, is_active, created_at, updated_at, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        configurationId,
        request.name,
        request.description || '',
        JSON.stringify(request.config_data),
        request.is_active ? 1 : 0,
        now,
        now,
        maxOrderResult.nextOrder
      );

    database.prepare('COMMIT').run();

    const createdConfig = getConfiguration(configurationId);
    if (!createdConfig) {
      throw new Error('Failed to retrieve created configuration');
    }

    console.log('Created config:', createdConfig.name, 'is_active:', createdConfig.is_active);

    return createdConfig;
  } catch (error) {
    database.prepare('ROLLBACK').run();
    throw error;
  }
}

/**
 * Update configuration
 *
 * @param configurationId - Configuration ID
 * @param updates - Fields to update
 * @returns Updated configuration or undefined if not found
 */
export function updateConfiguration(
  configurationId: string,
  updates: UpdateConfigurationRequest
): Configuration | undefined {
  const database = getDatabase();
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }

  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }

  if (updates.config_data !== undefined) {
    fields.push('config_data = ?');
    values.push(JSON.stringify(updates.config_data));
  }

  if (updates.is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(updates.is_active ? 1 : 0);
  }

  if (fields.length === 0) {
    return getConfiguration(configurationId);
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(configurationId);

  database
    .prepare(`UPDATE configurations SET ${fields.join(', ')} WHERE id = ?`)
    .run(...values);

  return getConfiguration(configurationId);
}

/**
 * Delete configuration
 *
 * @param configurationId - Configuration ID
 * @returns true if deleted, false if not found
 */
export function deleteConfiguration(configurationId: string): boolean {
  const database = getDatabase();
  const result = database
    .prepare('DELETE FROM configurations WHERE id = ?')
    .run(configurationId);
  return (result as any).changes > 0;
}

/**
 * Set configuration as active
 * Deactivates all other configurations
 *
 * @param configurationId - Configuration ID to activate
 * @returns Activated configuration or undefined if not found
 */
export function setActiveConfiguration(
  configurationId: string
): Configuration | undefined {
  const database = getDatabase();

  database.prepare('BEGIN TRANSACTION').run();

  try {
    // Deactivate all others
    database.prepare('UPDATE configurations SET is_active = 0').run();

    // Activate this one
    database
      .prepare('UPDATE configurations SET is_active = 1, updated_at = ? WHERE id = ?')
      .run(new Date().toISOString(), configurationId);

    database.prepare('COMMIT').run();

    return getConfiguration(configurationId);
  } catch (error) {
    database.prepare('ROLLBACK').run();
    console.error('Transaction error:', error);
    throw error;
  }
}

/**
 * Update configurations sort order
 *
 * @param configurationIds - Configuration IDs in desired order
 */
export function updateConfigurationsOrder(configurationIds: string[]): void {
  const database = getDatabase();
  const statement = database.prepare('UPDATE configurations SET sort_order = ?, updated_at = ? WHERE id = ?');
  const now = new Date().toISOString();

  database.prepare('BEGIN TRANSACTION').run();

  try {
    configurationIds.forEach((configurationId, index) => {
      statement.run(index, now, configurationId);
    });
    database.prepare('COMMIT').run();
  } catch (error) {
    database.prepare('ROLLBACK').run();
    console.error('Sort order update error:', error);
    throw error;
  }
}
