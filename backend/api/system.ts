/**
 * System information and administration API routes
 *
 * Provides system details, performance metrics, and administrative operations
 * such as system reset and database management.
 *
 * Routes:
 *   GET  /health        - Simple health check
 *   GET  /system-info   - Comprehensive system information
 *   GET  /metrics       - Real-time performance metrics
 *   POST /reset         - Reset system to initial state (requires confirmation)
 *
 * @module server/api/system
 */

import express, { Request, Response } from 'express';
import { existsSync, unlinkSync } from 'fs';

import { getSystemInfo } from '@backend/platform/system-info';
import { getMetricsSnapshot } from '../metrics';
import { apiPaths } from '@shared/api/constants';
import { DATABASE_PATH } from '@backend/database/core';
import { closeDatabase, reinitializeDatabase } from '../database';

const SYSTEM_ROUTER = express.Router();

/**
 * Health check endpoint
 *
 * Provides a simple health status indicator.
 *
 * GET /api/system/health
 *
 * @param _request - Express request object
 * @param response - Express response object
 * @returns JSON with status 'ok'
 */
SYSTEM_ROUTER.get(apiPaths.System.health.relative, (_request: Request, response: Response) => {
  response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Get system information
 *
 * Retrieves comprehensive system information including:
 * - Operating system and architecture
 * - CPU information
 * - Memory status
 * - Disk information
 * - Network details
 *
 * GET /api/system/system-info
 *
 * @param request - Express request object
 * @param response - Express response object
 * @returns System information object
 * @throws 500 if unable to gather system information
 */
SYSTEM_ROUTER.get(apiPaths.System.systemInfo.relative, async (request: Request, response: Response) => {
  try {
    const systemInfo = await getSystemInfo();
    response.json(systemInfo);
  } catch (error) {
    console.error('Error retrieving system information:', error);
    response.status(500).json({
      error: 'Failed to retrieve system information',
      errorCode: 'SYSTEM_INFO_ERROR',
    });
  }
});

/**
 * Get performance metrics
 *
 * Provides real-time performance metrics including:
 * - CPU usage
 * - Memory usage
 * - Disk I/O
 * - Network traffic
 *
 * GET /api/system/metrics
 *
 * @param request - Express request object
 * @param response - Express response object
 * @returns Metrics snapshot object
 * @throws 500 if unable to collect metrics
 */
SYSTEM_ROUTER.get(apiPaths.System.metrics.relative, async (request: Request, response: Response) => {
  try {
    const metricsSnapshot = await getMetricsSnapshot();
    response.json(metricsSnapshot);
  } catch (error) {
    console.error('Error collecting metrics:', error);
    response.status(500).json({
      error: 'Failed to collect metrics',
      errorCode: 'METRICS_ERROR',
    });
  }
});

/**
 * Initiate system reset
 *
 * This endpoint initiates a system reset by:
 * 1. Closing the database connection
 * 2. Deleting the database file
 * 3. Reinitializing the database with fresh schema
 *
 * WARNING: This operation is destructive and cannot be undone!
 * All configurations will be permanently deleted.
 *
 * POST /api/system/reset
 *
 * @param request - Express request object
 * @param response - Express response object
 * @returns Success confirmation
 * @throws 500 if reset operation fails
 */
SYSTEM_ROUTER.post(apiPaths.System.reset.relative, (request: Request, response: Response) => {
  try {
    // Step 1: Close database connection
    closeDatabase();
    console.log('Database connection closed for reset');

    // Step 2: Delete database file
    if (existsSync(DATABASE_PATH)) {
      try {
        unlinkSync(DATABASE_PATH);
        console.log(`Database file deleted: ${DATABASE_PATH}`);
      } catch (deleteError) {
        console.error('Error deleting database file:', deleteError);
        throw new Error('Failed to delete database file');
      }
    }

    // Step 3: Reinitialize database
    reinitializeDatabase();
    console.log('Database reinitialized with fresh schema');

    response.json({
      success: true,
      message: 'System reset successfully completed',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('System reset failed:', error);
    response.status(500).json({
      error: 'Failed to reset system',
      errorCode: 'RESET_FAILED',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default SYSTEM_ROUTER;
