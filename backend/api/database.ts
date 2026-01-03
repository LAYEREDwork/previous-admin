/**
 * Database management API routes
 *
 * Provides endpoints for database backup, restore, and statistics.
 *
 * @module server/api/database
 */

import express, { Request } from 'express';

import { apiPaths } from '@shared/api/constants';

import { reinitializeDatabase } from '@backend/database/core';
import { TypedResponse } from '@backend/types';

import { exportDatabase, importDatabase, getDatabaseStatistics } from '../database';

const router = express.Router();

/**
 * GET /api/database/export
 * Export entire database as JSON
 *
 * @returns {Object} Complete database dump
 */
router.get(apiPaths.Database.export.relative, (req: Request, res: TypedResponse<any>) => {
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
 * @body {Object} dump - Database dump object
 * @body {boolean} merge - If true, merge with existing data; if false, replace
 * @returns {Object} Import statistics
 */
router.post(apiPaths.Database.import.relative, (req: Request, res: TypedResponse<{ success: boolean }>) => {
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
 * @returns {Object} Database statistics
 */
router.get(apiPaths.Database.stats.relative, (req: Request, res: TypedResponse<any>) => {
  try {
    const stats = getDatabaseStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching database stats:', error);
    res.status(500).json({ error: 'Failed to fetch database statistics' });
  }
});

export default router;
