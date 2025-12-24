/**
 * Database management API routes
 *
 * Provides endpoints for database backup, restore, and statistics.
 * All routes require authentication.
 *
 * @module server/api/database
 */

import express from 'express';
import { exportDatabase, importDatabase, getDatabaseStatistics, hasAnyUsers } from '../database';
import { reinitializeDatabase } from '../database/core';
import { apiPaths } from '../../shared/constants';
import { requireAuth } from '../middleware';
import { AuthenticatedRequest, TypedResponse } from '../types';

const router = express.Router();

/**
 * GET /api/database/export
 * Export entire database as JSON
 *
 * @authentication required
 * @returns {Object} Complete database dump
 */
router.get(apiPaths.Database.export.relative, requireAuth, (req: AuthenticatedRequest, res: TypedResponse<any>) => {
  try {
    const dump = exportDatabase();
    res.json(dump);
  } catch (error) {
    console.error('Error exporting database:', error);
    res.status(500).json({ error: 'Failed to export database' });
  }
});

/**
 * POST /api/database/import
 * Import database dump
 *
 * @authentication required
 * @body {Object} dump - Database dump object
 * @body {boolean} merge - If true, merge with existing data; if false, replace
 * @returns {Object} Import statistics
 */
router.post(apiPaths.Database.import.relative, requireAuth, (req: AuthenticatedRequest, res: TypedResponse<{ success: boolean }>) => {
  try {
    const { dump, merge = false } = req.body;

    if (!dump) {
      return res.status(400).json({ error: 'Database dump is required' });
    }

    const stats = importDatabase(dump, merge);
    console.log('Database import stats:', stats);
    
    // Reinitialize database connection after import
    try {
      reinitializeDatabase();
      console.log('Database reinitialized successfully after import');
    } catch (reinitError) {
      console.error('Warning: Failed to reinitialize database after import:', reinitError);
      // Continue anyway, the data should still be imported
    }
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error importing database:', error);
    res.status(500).json({
      error: 'Failed to import database',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/database/stats
 * Get database statistics
 *
 * @authentication required
 * @returns {Object} Database statistics
 */
router.get(apiPaths.Database.stats.relative, requireAuth, (req: AuthenticatedRequest, res: TypedResponse<any>) => {
  try {
    const stats = getDatabaseStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching database stats:', error);
    res.status(500).json({ error: 'Failed to fetch database statistics' });
  }
});

/**
 * POST /api/database/setup-import
 * Import database during initial setup (no authentication required)
 *
 * Only callable if no users exist in the system.
 * Used to restore from backup during initial setup.
 *
 * @body {Object} dump - Database dump object
 * @returns {Object} Import statistics
 */
router.post(apiPaths.Database.setupImport.relative, (req: express.Request, res: express.Response) => {
  try {
    if (hasAnyUsers()) {
      return res.status(400).json({
        error: 'Setup already completed. Use authenticated import endpoint instead.'
      });
    }

    const { dump } = req.body;

    if (!dump) {
      return res.status(400).json({ error: 'Database dump is required' });
    }

    const stats = importDatabase(dump, false);
    console.log('Database import stats:', stats);
    
    // Reinitialize database connection after import
    try {
      reinitializeDatabase();
      console.log('Database reinitialized successfully after import');
    } catch (reinitError) {
      console.error('Warning: Failed to reinitialize database after import:', reinitError);
      // Continue anyway, the data should still be imported
    }
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error importing database during setup:', error);
    res.status(500).json({
      error: 'Failed to import database',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
