/**
 * Previous Admin Backend Server
 *
 * Main server entry point that initializes Express application
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
import { collectMetrics, getNetworkTraffic, metricsHistory } from './metrics.js';
import { computeInstantNetworkRate } from './metrics.js';
import { getPlatform } from './platform';

// Prefix all console output with an ISO timestamp for backend logs
(() => {
  const methods: Array<keyof Console> = ['log', 'info', 'warn', 'error', 'debug'];
  methods.forEach((method) => {
    const original = console[method] as (...args: any[]) => void;
    console[method] = (...args: any[]) => {
      try {
        const ts = new Date().toISOString();
        original.call(console, `[${ts}]`, ...args);
      } catch {
        original.call(console, ...args);
      }
    };
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
    const serverPort = process.env.PORT || 3001;
    const serverHost = process.env.HOST || '0.0.0.0';

    // Non-blocking startup: do not perform blocking seeds here. Background async seeding
    // and a heuristic seed will ensure the UI doesn't see prolonged zeros.

    // Heuristic startup seed: push a small plausible non-zero value so UI doesn't show long zeros.
    try {
      const lastNet = metricsHistory.networkTraffic.length > 0 ? metricsHistory.networkTraffic[metricsHistory.networkTraffic.length - 1] : null;
      if (!lastNet || (lastNet.received === 0 && lastNet.sent === 0)) {
        let heuristicBytesPerSec = 100 * 1024; // default 100 KB/s
        try {
          const platform = await getPlatform();
          if (platform.getDefaultNetworkInterface && platform.getInterfaceSpeed) {
            const defaultIface = await platform.getDefaultNetworkInterface();
            if (defaultIface) {
              try {
                const ifaceSpeedMbps = await platform.getInterfaceSpeed(defaultIface);
                if (ifaceSpeedMbps && ifaceSpeedMbps > 0) {
                  const onePercentBytesPerSec = Math.round((ifaceSpeedMbps * 1000000) / 8 * 0.01);
                  heuristicBytesPerSec = Math.max(heuristicBytesPerSec, onePercentBytesPerSec);
                }
              } catch {
                // ignore iface speed lookup errors
              }
            }
          }
        } catch {
          // ignore platform lookup errors
        }

        metricsHistory.networkTraffic.push({ timestamp: Date.now(), received: heuristicBytesPerSec, sent: 0, heuristic: true });
        // Trigger an immediate collection so the background measured values appear quickly
        try {
          collectMetrics();
        } catch (err) {
          console.warn('⚠️ Failed to trigger immediate collectMetrics():', err);
        }
        // Also try a quick, non-blocking multi-sample instant sampler to replace heuristic sooner
        (async () => {
          try {
            const samples: Array<{ received: number; sent: number } | null> = [];
            const sampleCount = 3;
            const perSampleMs = 200;
            const interSampleDelayMs = 120;

            for (let i = 0; i < sampleCount; i++) {
              try {
                const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), perSampleMs + 200));
                const result = await Promise.race([computeInstantNetworkRate(perSampleMs), timeoutPromise]);
                samples.push(result as any || null);
                } catch {
                  samples.push(null);
                }
              // small delay between samples
              await new Promise((r) => setTimeout(r, interSampleDelayMs));
            }

            // pick the sample with the largest total bytes (received+sent)
            let best: { received: number; sent: number } | null = null;
            let bestTotal = 0;
            samples.forEach((s) => {
              if (s && (s.received > 0 || s.sent > 0)) {
                const total = (s.received || 0) + (s.sent || 0);
                if (total > bestTotal) {
                  bestTotal = total;
                  best = s;
                }
              }
            });

            if (best) {
              try {
                metricsHistory.networkTraffic = metricsHistory.networkTraffic.filter((entry) => !entry.heuristic);
              } catch {
                // ignore
              }
              metricsHistory.networkTraffic.push({ timestamp: Date.now(), received: best.received, sent: best.sent });
            }
          } catch (err) {
            console.warn('⚠️ Startup quick multi-sampler failed:', err);
          }
        })();
      }
    } catch (err) {
      console.warn('⚠️ Startup heuristic seed failed:', err);
    }

    // Start HTTP server
    HTTP_SERVER.listen(serverPort, String(serverHost), () => {
      console.log(`✅ Previous Admin Backend running on ${serverHost}:${serverPort}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Start metrics collection after server startup
    // Seed network baseline asynchronously to avoid blocking server startup
    try {
      getNetworkTraffic(true)
        .then((measured) => {
          try {
            console.log('✅ Initial network baseline seeded (async)', measured);
            if (measured && (measured.received > 0 || measured.sent > 0)) {
              // remove heuristic placeholders immediately
              try {
                metricsHistory.networkTraffic = metricsHistory.networkTraffic.filter((entry) => !entry.heuristic);
                } catch {
                  // ignore
                }
              metricsHistory.networkTraffic.push({ timestamp: Date.now(), received: measured.received, sent: measured.sent });
              // replaced heuristic seed with async measured baseline
            }
          } catch (err) {
            console.warn('⚠️ Error processing async baseline measurement:', err);
          }
        })
        .catch((err) => console.warn('⚠️ Failed to seed network baseline (async):', err));

      // Start a non-blocking retry loop to obtain the first non-zero network measurement.
      (async () => {
        const maxAttempts = 10;
        const delayMs = 300;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          try {
            // Try a deterministic instant rate sample first
            const measured = await (await import('./metrics')).computeInstantNetworkRate(300);
            if (measured && (measured.received > 0 || measured.sent > 0)) {
              metricsHistory.networkTraffic.push({ timestamp: Date.now(), received: measured.received, sent: measured.sent });
              console.log('✅ Initial network measurement pushed to metricsHistory (seeded non-zero)');
              return;
            }
            // If measurement is zero, attempt to seed baseline and retry sooner
            try {
              await getNetworkTraffic(true);
              console.log('ℹ️ Seeded baseline during startup retry');
              } catch {
                // ignore seed errors and continue retrying
              }
            } catch {
              // ignore and retry
            }
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }

        // Last-resort: push whatever value we get to avoid long zero stretches
        try {
          const measured = await getNetworkTraffic(false);
          metricsHistory.networkTraffic.push({ timestamp: Date.now(), received: measured.received, sent: measured.sent });
          console.log('⚠️ Initial network measurement pushed to metricsHistory (last-resort)');
        } catch (err) {
          console.warn('⚠️ Failed to get initial network measurement after retries:', err);
        }
      })();

      setTimeout(() => {
        setInterval(collectMetrics, 1000);
        console.log('✅ Background metrics collection started');
      }, 2000);
    } catch (err) {
      console.warn('⚠️ Failed to initialize metrics seeding:', err);
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Export server for testing purposes
export { HTTP_SERVER, EXPRESS_APPLICATION };
