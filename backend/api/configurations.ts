/**
 * Configuration management API routes
 *
 * Provides CRUD operations for configuration profiles.
 * All routes require authentication.
 *
 * @module server/api/configurations
 */

import express, { Request, Response } from 'express';
import {
  getConfigurations,
  getConfigurationById,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
  setActiveConfiguration,
  getActiveConfiguration,
  updateConfigurationOrder
} from '../services/configurationService';
import { apiPaths } from '../../shared/constants';
import { requireAuth } from '../middleware';
import { AuthenticatedRequest, Configuration, PreviousConfig, UpdateConfigurationRequest } from '../types';

const router = express.Router();

// Response types
interface ConfigurationResponse {
  configuration: Configuration | null;
}

interface ConfigurationsListResponse {
  configurations: Array<{
    id: string;
    name: string;
    description: string;
    config_data: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    sort_order: number;
  }>;
}

interface SuccessResponse {
  success: boolean;
  message?: string;
}

interface ErrorResponse {
  error: string;
}

// Request body types
interface CreateConfigurationBody {
  name: string;
  description?: string;
  config_data: PreviousConfig | string;
  is_active?: boolean;
}

interface UpdateConfigurationBody {
  name?: string;
  description?: string;
  config_data?: PreviousConfig | string;
  is_active?: boolean;
}

interface UpdateOrderBody {
  orderedIds: string[];
}

/**
 * GET /api/configurations
 * Get all configurations
 *
 * @authentication required
 * @returns {Array} Array of configuration objects
 */
router.get(apiPaths.Configuration.list.relative, requireAuth, (
  _req: Request,
  res: Response<ConfigurationsListResponse | ErrorResponse>
) => {
  try {
    const authReq = _req as AuthenticatedRequest;
    console.log('Session userId:', authReq.session.userId, 'username:', authReq.session.username);
    const configurations = getConfigurations(authReq.session.userId!);

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
router.get(apiPaths.Configuration.getActive.relative, requireAuth, (
  _req: Request,
  res: Response<ConfigurationResponse | ErrorResponse>
) => {
  try {
    const authReq = _req as AuthenticatedRequest;
    const config = getActiveConfiguration(authReq.session.userId!);

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
router.get(apiPaths.Configuration.getById.relative, requireAuth, (
  req: Request<{ id: string }>,
  res: Response<ConfigurationResponse | ErrorResponse>
) => {
  try {
    const config = getConfigurationById(req.params.id);

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
router.post(apiPaths.Configuration.create.relative, requireAuth, (
  req: Request<object, ConfigurationResponse | ErrorResponse, CreateConfigurationBody>,
  res: Response<ConfigurationResponse | ErrorResponse>
) => {
  try {
    const { name, description, config_data, is_active } = req.body;
    const authReq = req as AuthenticatedRequest;

    console.log('API create config:', name, 'is_active:', is_active);

    if (!name || !config_data) {
      return res.status(400).json({ error: 'Name and config_data are required' });
    }

    const config = createConfiguration({
      name,
      description: description || '',
      config_data: typeof config_data === 'string' ? JSON.parse(config_data) : config_data,
      is_active: is_active || false,
    }, authReq.session.userId!);

    console.log('API created config:', config.name, 'is_active:', config.is_active);

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
router.put(apiPaths.Configuration.update.relative, requireAuth, (
  req: Request<{ id: string }, ConfigurationResponse | ErrorResponse, UpdateConfigurationBody>,
  res: Response<ConfigurationResponse | ErrorResponse>
) => {
  try {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    const updates: UpdateConfigurationRequest = {};

    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.config_data !== undefined) {
      updates.config = typeof req.body.config_data === 'string' ? JSON.parse(req.body.config_data) : req.body.config_data;
    }

    const config = updateConfiguration(id, updates);

    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    if (req.app.locals.broadcastConfigUpdate && updates.is_active) {
      req.app.locals.broadcastConfigUpdate(authReq.session.username, config.config_data);
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
router.delete(apiPaths.Configuration.delete.relative, requireAuth, (
  req: Request<{ id: string }>,
  res: Response<SuccessResponse | ErrorResponse>
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    deleteConfiguration(req.params.id, parseInt(authReq.session.userId));

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
router.post(apiPaths.Configuration.activate.relative, requireAuth, (
  req: Request<{ id: string }>,
  res: Response<ConfigurationResponse | ErrorResponse>
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    setActiveConfiguration(req.params.id, parseInt(authReq.session.userId));

    const config = getConfigurationById(req.params.id);

    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    if (req.app.locals.broadcastConfigUpdate) {
      req.app.locals.broadcastConfigUpdate(authReq.session.username, config.config_data);
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
router.put(apiPaths.Configuration.updateOrder.relative, requireAuth, (
  req: Request<object, SuccessResponse | ErrorResponse, UpdateOrderBody>,
  res: Response<SuccessResponse | ErrorResponse>
) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array' });
    }

    updateConfigurationOrder(orderedIds);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating configurations order:', error);
    res.status(500).json({ error: 'Failed to update configurations order' });
  }
});

/**
 * POST /api/configurations/deactivate-all
 * Deactivate all configurations
 *
 * @authentication required
 * @returns {Object} Success message
 */
router.post(apiPaths.Configuration.deactivateAll.relative, requireAuth, (
  req: Request,
  res: Response<SuccessResponse | ErrorResponse>
) => {
  const authReq = req as AuthenticatedRequest;
  console.log('Deactivate-all route called for user:', authReq.session.userId);
  try {
    const database = getDatabase();

    // Deactivate all configurations for this user
    if (authReq.session.userId !== undefined) {
      database
        .prepare('UPDATE configurations SET is_active = 0 WHERE created_by = ?')
        .run(Number(authReq.session.userId));
    } else {
      database.prepare('UPDATE configurations SET is_active = 0').run();
    }

    console.log('Successfully deactivated all configurations for user:', authReq.session.userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deactivating all configurations:', error);
    res.status(500).json({ error: 'Failed to deactivate all configurations' });
  }
});

export default router;
