/**
 * Previous Admin Backend Server
 *
 * Main server entry point that initializes Express application, WebSocket server,
 * and registers API routes. Handles graceful shutdown and metrics collection.
 *
 * Environment Variables:
 *   - PORT {number} (default: 3001): Server port
 *   - HOST {string} (default: 0.0.0.0): Server host address
 *   - SESSION_SECRET {string} (required in production): Session encryption secret
 *   - NODE_ENV {string} (default: development): Environment mode
 *
 * @module server
 */

import crypto from 'crypto';
import express, { Express, Request, Response } from 'express';
import { createServer, Server as HttpServer } from 'http';
import session, { SessionOptions } from 'express-session';
import cors from 'cors';
import { API_CONFIG, SESSION_CONFIG } from './constants';

// Import database to initialize on startup
import * as database from './database';

// Import route handlers
import authRoutes from './api/auth.js';
import configRoutes from './api/config.js';
import configurationsRoutes from './api/configurations.js';
import databaseRoutes from './api/database.js';
import systemRoutes from './api/system.js';
import updateRoutes from './api/update.js';

// Import utilities
import { setupWebSocket } from './websocket.js';
import { collectMetrics } from './metrics.js';

const EXPRESS_APPLICATION = express();
const HTTP_SERVER = createServer(EXPRESS_APPLICATION);

/**
 * Initialize session secret
 * In production, SESSION_SECRET must be provided via environment variable
 */
function initializeSessionSecret(): string {
  const sessionSecret = process.env.SESSION_SECRET;

  if (sessionSecret) {
    return sessionSecret;
  }

  if (process.env.NODE_ENV === 'production') {
    console.error('❌ SESSION_SECRET environment variable is required in production mode');
    process.exit(1);
  }

  console.warn('⚠️  Generating random SESSION_SECRET for development mode');
  console.warn('⚠️  Set SESSION_SECRET environment variable for persistence across restarts');

  return crypto.randomBytes(SESSION_CONFIG.SECRET_LENGTH_BYTES).toString('hex');
}

/**
 * Configure Express middleware
 */
function configureMiddleware(app: Express, sessionSecret: string): void {
  // CORS configuration
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // JSON body parsing
  app.use(express.json({ limit: API_CONFIG.MAX_PAYLOAD_SIZE }));

  // Session management
  const sessionMiddleware = session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: SESSION_CONFIG.MAX_AGE_MS,
    },
  } as SessionOptions);

  app.use(sessionMiddleware);

  // Store session middleware for WebSocket
  app.locals.sessionMiddleware = sessionMiddleware;
}

/**
 * Configure API routes
 */
function configureRoutes(app: Express): void {
  app.use('/api/auth', authRoutes);
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
    // Initialize session secret
    const sessionSecret = initializeSessionSecret();

    // Configure middleware
    configureMiddleware(EXPRESS_APPLICATION, sessionSecret);

    // Configure routes
    configureRoutes(EXPRESS_APPLICATION);

    // Setup WebSocket
    const websocketServer = setupWebSocket(HTTP_SERVER, EXPRESS_APPLICATION.locals.sessionMiddleware);

    // Setup graceful shutdown
    setupGracefulShutdown(HTTP_SERVER);

    // Get server configuration from environment
    const serverPort = process.env.PORT || API_CONFIG.DEFAULT_PORT;
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
