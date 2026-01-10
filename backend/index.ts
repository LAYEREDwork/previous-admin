/**
 * Previous Admin Backend Server
 *
 * Main server entry point that initializes Express application
 * and registers API routes. Handles graceful shutdown.
 *
 * Environment Variables:
 *   - PORT {number} (default: 3001): Server port
 *   - HOST {string} (default: 0.0.0.0): Server host address
 *   - NODE_ENV {string} (default: development): Environment mode
 *
 * @module backend
 */

import { createServer, Server as HttpServer } from 'http';

import cors from 'cors';
import express, { Express, Request, Response } from 'express';

import { apiPaths } from '@shared/api/constants';

// Import database to initialize on startup

// Import route handlers
import configRoutes from './api/config';
import configSchemaRoutes from './api/config-schema';
import configurationsRoutes from './api/configurations';
import databaseRoutes from './api/database';
import systemRoutes from './api/system';
import updateRoutes from './api/update';
import * as database from './database';

// Import utilities

// Prefix all console output with an ISO timestamp for backend logs
(() => {
  const methods = ['log', 'info', 'warn', 'error', 'debug'] as const;
  methods.forEach((method) => {
    const original = (console as any)[method] as (...args: any[]) => void;
    Object.defineProperty(console, method, {
      value: (...args: any[]) => {
        try {
          const ts = new Date().toISOString();
          original.call(console, `[${ts}]`, ...args);
        } catch {
          original.call(console, ...args);
        }
      },
      writable: true,
      configurable: true,
    });
  });
})();

const EXPRESS_APPLICATION = express();
const HTTP_SERVER = createServer(EXPRESS_APPLICATION);



/**
 * Configure Express middleware
 */
function configureMiddleware(app: Express): void {
  // CORS configuration
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // JSON body parsing with 50MB payload limit
  app.use(express.json({ limit: '50mb' }));
}

/**
 * Configure API routes
 */
function configureRoutes(app: Express): void {
  // Mount routers with base paths
  app.use('/api', configRoutes);
  app.use('/api', configSchemaRoutes);
  app.use(apiPaths.Configuration.list.full.replace(apiPaths.Configuration.list.relative, ''), configurationsRoutes);
  app.use(apiPaths.Database.export.full.replace(apiPaths.Database.export.relative, ''), databaseRoutes);
  app.use(apiPaths.System.health.full.replace(apiPaths.System.health.relative, ''), systemRoutes);
  app.use(apiPaths.Update.update.full.replace(apiPaths.Update.update.relative, ''), updateRoutes);

  // Health check endpoint
  app.get(apiPaths.Health.health.full, (request: Request, response: Response) => {
    response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });
}

/**
 * Setup graceful shutdown handlers
 */
function setupGracefulShutdown(server: HttpServer): void {
  const shutdownSignals = ['SIGTERM', 'SIGINT'];

  shutdownSignals.forEach((signal) => {
    process.on(signal, () => {
      console.log(`\n${signal} received - shutting down gracefully...`);

      server.close(() => {
        console.log('HTTP server closed');

        try {
          database.closeDatabase();
          console.log('Database connection closed');
        } catch (error) {
          console.error('Error closing database:', error);
        }

        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown - timeout reached');
        process.exit(1);
      }, 10000);
    });
  });
}

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    // Configure middleware
    configureMiddleware(EXPRESS_APPLICATION);

    // Configure routes
    configureRoutes(EXPRESS_APPLICATION);

    // Setup graceful shutdown
    setupGracefulShutdown(HTTP_SERVER);

    // Get server configuration from environment (default port: 3001)
    const serverPort = parseInt(process.env.PORT || '3001', 10);
    const serverHost = process.env.HOST || '0.0.0.0';

    // Start HTTP server
    HTTP_SERVER.listen(serverPort, String(serverHost), () => {
      console.log(`✅ Previous Admin Backend running on ${serverHost}:${serverPort}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Export server for testing purposes
export { HTTP_SERVER, EXPRESS_APPLICATION };
