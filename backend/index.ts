/**
 * Previous Admin Backend Server
 *
 * Main server entry point that initializes Express application, WebSocket server,
 * and registers API routes. Handles graceful shutdown and metrics collection.
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


// Import database to initialize on startup

// Import route handlers
import configRoutes from './api/config';
import configurationsRoutes from './api/configurations';
import databaseRoutes from './api/database';
import systemRoutes from './api/system';
import updateRoutes from './api/update';
import { API_CONFIG } from './constants';
import * as database from './database';

// Import utilities
import { collectMetrics } from './metrics.js';
import { setupWebSocket } from './websocket.js';

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

  // JSON body parsing
  app.use(express.json({ limit: API_CONFIG.MAX_PAYLOAD_SIZE }));
}

/**
 * Configure API routes
 */
function configureRoutes(app: Express): void {
  app.use('/api', configRoutes);
  app.use('/api/configurations', configurationsRoutes);
  app.use('/api/database', databaseRoutes);
  app.use('/api/system', systemRoutes);
  app.use('/api/update', updateRoutes);

  // Health check endpoint
  app.get('/api/health', (request: Request, response: Response) => {
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

    // Setup WebSocket
    setupWebSocket(HTTP_SERVER);

    // Setup graceful shutdown
    setupGracefulShutdown(HTTP_SERVER);

    // Get server configuration from environment
    const serverPort = process.env.PORT || API_CONFIG.PORT;
    const serverHost = process.env.HOST || '0.0.0.0';

    // Start HTTP server
    HTTP_SERVER.listen(serverPort, String(serverHost), () => {
      console.log(`✅ Previous Admin Backend running on ${serverHost}:${serverPort}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Start metrics collection after server startup
    setTimeout(() => {
      setInterval(collectMetrics, 1000);
      console.log('✅ Background metrics collection started');
    }, 2000);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Export server for testing purposes
export { HTTP_SERVER, EXPRESS_APPLICATION };
