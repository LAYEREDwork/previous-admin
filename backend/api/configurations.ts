/**
 * Configuration management API routes
 *
 * Provides CRUD operations for configuration profiles.
 * All routes require authentication.
 *
 * @module server/api/configurations
 */

import express from 'express';
import {
  getConfigurations,
  getConfiguration,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
  setActiveConfiguration,
  getActiveConfiguration,
  updateConfigurationsOrder
} from '../database';
import { requireAuth } from '../middleware';

const router = express.Router();

/**
 * GET /api/configurations
 * Get all configurations
 *
 * @authentication required
 * @returns {Array} Array of configuration objects
 */
router.get('/', requireAuth, (req: any, res: any) => {
  try {
    const configurations = getConfigurations();

    const parsed = configurations.map(config => ({
      id: config.id,
      name: config.name,
      description: config.description,
      config_data: JSON.stringify(config.config_data),
      is_active: Boolean(config.is_active),
      created_at: config.created_at,
      updated_at: config.updated_at,
      created_by: config.created_by,
      sort_order: config.sort_order
    }));

    res.json({ configurations: parsed });
  } catch (error) {
    console.error('Error fetching configurations:', error);
    res.status(500).json({ error: 'Failed to fetch configurations' });
  }
});

/**
 * GET /api/configurations/active
 * Get currently active configuration
 *
 * @authentication required
 * @returns {Object|null} Active configuration or null
 */
router.get('/active', requireAuth, (req: any, res: any) => {
  try {
    const config = getActiveConfiguration();

    if (!config) {
      return res.json({ configuration: null });
    }

    res.json({
      configuration: {
        id: config.id,
        name: config.name,
        description: config.description,
        config_data: config.config_data,
        is_active: Boolean(config.is_active),
        created_at: config.created_at,
        updated_at: config.updated_at,
        created_by: config.created_by,
        sort_order: config.sort_order
      }
    });
  } catch (error) {
    console.error('Error fetching active configuration:', error);
    res.status(500).json({ error: 'Failed to fetch active configuration' });
  }
});

/**
 * GET /api/configurations/:id
 * Get specific configuration by ID
 *
 * @authentication required
 * @param {string} id - Configuration ID
 * @returns {Object} Configuration object
 */
router.get('/:id', requireAuth, (req: any, res: any) => {
  try {
    const config = getConfiguration(req.params.id);

    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json({
      configuration: {
        id: config.id,
        name: config.name,
        description: config.description,
        config_data: config.config_data,
        is_active: Boolean(config.is_active),
        created_at: config.created_at,
        updated_at: config.updated_at,
        created_by: config.created_by,
        sort_order: config.sort_order
      }
    });
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

/**
 * POST /api/configurations
 * Create new configuration
 *
 * @authentication required
 * @body {Object} data - Configuration data
 * @returns {Object} Created configuration
 */
router.post('/', requireAuth, (req: any, res: any) => {
  try {
    const { name, description, config_data, is_active } = req.body;

    if (!name || !config_data) {
      return res.status(400).json({ error: 'Name and config_data are required' });
    }

    const config = createConfiguration(req.session.userId, {
      name,
      description: description || '',
      config_data: typeof config_data === 'string' ? JSON.parse(config_data) : config_data,
      is_active: Boolean(is_active)
    });

    res.status(201).json({
      configuration: config
    });
  } catch (error) {
    console.error('Error creating configuration:', error);
    res.status(500).json({ error: 'Failed to create configuration' });
  }
});

/**
 * PUT /api/configurations/:id
 * Update configuration
 *
 * @authentication required
 * @param {string} id - Configuration ID
 * @body {Object} updates - Fields to update
 * @returns {Object} Updated configuration
 */
router.put('/:id', requireAuth, (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updates = {};

    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.config_data !== undefined) {
      updates.config_data = typeof req.body.config_data === 'string' ? JSON.parse(req.body.config_data) : req.body.config_data;
    }
    if (req.body.is_active !== undefined) updates.is_active = req.body.is_active;

    const config = updateConfiguration(id, updates);

    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    if (req.app.locals.broadcastConfigUpdate && updates.is_active) {
      req.app.locals.broadcastConfigUpdate(req.session.username, config.config_data);
    }

    res.json({
      configuration: config
    });
  } catch (error) {
    console.error('Error updating configuration:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

/**
 * DELETE /api/configurations/:id
 * Delete configuration
 *
 * @authentication required
 * @param {string} id - Configuration ID
 * @returns {Object} Success message
 */
router.delete('/:id', requireAuth, (req: any, res: any) => {
  try {
    const deleted = deleteConfiguration(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json({ success: true, message: 'Configuration deleted' });
  } catch (error) {
    console.error('Error deleting configuration:', error);
    res.status(500).json({ error: 'Failed to delete configuration' });
  }
});

/**
 * POST /api/configurations/:id/activate
 * Set configuration as active
 *
 * @authentication required
 * @param {string} id - Configuration ID
 * @returns {Object} Activated configuration
 */
router.post('/:id/activate', requireAuth, (req: any, res: any) => {
  try {
    const config = setActiveConfiguration(req.params.id, req.session.userId);

    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    if (req.app.locals.broadcastConfigUpdate) {
      req.app.locals.broadcastConfigUpdate(req.session.username, config.config_data);
    }

    res.json({
      configuration: config
    });
  } catch (error) {
    console.error('Error activating configuration:', error);
    res.status(500).json({ error: 'Failed to activate configuration' });
  }
});

/**
 * PUT /api/configurations/order
 * Update configurations display order
 *
 * @authentication required
 * @body {Array<string>} orderedIds - Configuration IDs in desired order
 * @returns {Object} Success message
 */
router.put('/order/update', requireAuth, (req: any, res: any) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array' });
    }

    updateConfigurationsOrder(orderedIds);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating configurations order:', error);
    res.status(500).json({ error: 'Failed to update configurations order' });
  }
});

export default router;
