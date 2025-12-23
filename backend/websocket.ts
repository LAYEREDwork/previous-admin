/**
 * WebSocket server for real-time updates
 *
 * Handles WebSocket connections for streaming metrics, configuration updates,
 * and real-time notifications. Authenticates connections via session middleware.
 *
 * @module backend/websocket
 */

import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { getMetricsSnapshot } from './metrics';

import type { WebSocketMessage } from './types';

interface SessionRequest extends IncomingMessage {
  session?: {
    userId?: number;
    username?: string;
  };
}

/**
 * Map of username to list of WebSocket connections
 * Used for broadcasting updates to all connected clients of a user
 */
const USER_WEBSOCKET_SESSIONS = new Map<string, WebSocket[]>();

/**
 * Setup WebSocket server
 *
 * Creates and configures WebSocket server on top of HTTP server.
 * Uses session middleware for authentication on new connections.
 *
 * @param httpServer - HTTP server instance from createServer()
 * @param sessionMiddleware - Express session middleware for authentication
 * @returns Configured WebSocket server instance
 */
export function setupWebSocket(httpServer: any, sessionMiddleware: any): WebSocketServer {
  const websocketServer = new WebSocketServer({ server: httpServer });

  websocketServer.on('connection', (socket: WebSocket, request: SessionRequest) => {
    handleWebSocketConnection(socket, request, sessionMiddleware);
  });

  console.log('✅ WebSocket server initialized');
  return websocketServer;
}

/**
 * Handle new WebSocket connection
 *
 * Authenticates user, registers session, and sets up message handlers.
 * Closes connection with 1008 status if authentication fails.
 *
 * @param socket - WebSocket connection
 * @param request - HTTP upgrade request with session
 * @param sessionMiddleware - Express session middleware
 * @param websocketServer - WebSocket server instance
 */
function handleWebSocketConnection(
  socket: WebSocket,
  request: SessionRequest,
  sessionMiddleware: any
): void {
  // Create mock response object for session middleware
  const mockResponse = createMockResponse();

  sessionMiddleware(request, mockResponse, async () => {
    // Authenticate user
    if (!request.session?.username) {
      console.warn('⚠️  WebSocket connection rejected: Not authenticated');
      socket.close(1008, 'Not authenticated');
      return;
    }

    const username = request.session.username;

    // Register session
    if (!USER_WEBSOCKET_SESSIONS.has(username)) {
      USER_WEBSOCKET_SESSIONS.set(username, []);
    }
    const userSockets = USER_WEBSOCKET_SESSIONS.get(username)!;
    userSockets.push(socket);

    console.log(`✅ WebSocket connected: ${username}`);

    let metricsStreamInterval: NodeJS.Timeout | null = null;

    /**
     * Handle incoming WebSocket messages
     */
    socket.on('message', (messageData: Buffer) => {
      try {
        handleWebSocketMessage(
          messageData,
          socket,
          username,
          (interval: NodeJS.Timeout | null) => {
            metricsStreamInterval = interval;
          }
        );
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        sendErrorMessage(socket, 'Failed to process message');
      }
    });

    /**
     * Handle socket errors
     */
    socket.on('error', (error: Error) => {
      console.error(`WebSocket error for ${username}:`, error);
    });

    /**
     * Handle socket closure
     */
    socket.on('close', () => {
      // Cleanup metrics interval
      if (metricsStreamInterval) {
        clearInterval(metricsStreamInterval);
      }

      // Remove from session map
      const sockets = USER_WEBSOCKET_SESSIONS.get(username);
      if (sockets) {
        const index = sockets.indexOf(socket);
        if (index > -1) {
          sockets.splice(index, 1);
        }
        if (sockets.length === 0) {
          USER_WEBSOCKET_SESSIONS.delete(username);
        }
      }

      console.log(`WebSocket disconnected: ${username}`);
    });
  });
}

/**
 * Handle WebSocket message processing
 *
 * Parses and routes messages to appropriate handlers.
 *
 * @param messageData - Raw message buffer
 * @param socket - WebSocket connection
 * @param username - Authenticated username
 * @param setMetricsInterval - Callback to set metrics stream interval
 */
function handleWebSocketMessage(
  messageData: Buffer,
  socket: WebSocket,
  username: string,
  setMetricsInterval: (interval: NodeJS.Timeout | null) => void
): void {
  let parsedMessage: WebSocketMessage;

  // Safe JSON parsing with error handling
  try {
    const messageText = messageData.toString('utf-8');
    parsedMessage = JSON.parse(messageText) as WebSocketMessage;
  } catch (parseError) {
    console.warn(`Invalid WebSocket message from ${username}:`, parseError);
    sendErrorMessage(socket, 'Invalid message format - expected valid JSON');
    return;
  }

  // Validate message structure
  if (!parsedMessage.type) {
    sendErrorMessage(socket, 'Message must include "type" field');
    return;
  }

  // Route to appropriate handler
  switch (parsedMessage.type) {
    case 'subscribe_metrics':
      handleMetricsSubscription(socket, username, parsedMessage, setMetricsInterval);
      break;

    case 'unsubscribe_metrics':
      handleMetricsUnsubscription(setMetricsInterval);
      break;

    case 'ping':
      socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;

    default:
      console.warn(`Unknown message type: ${parsedMessage.type}`);
      sendErrorMessage(socket, `Unknown message type: ${parsedMessage.type}`);
  }
}

/**
 * Handle metrics subscription
 *
 * @param socket - WebSocket connection
 * @param username - Authenticated username
 * @param message - Subscription message with optional frequency
 * @param setMetricsInterval - Callback to register interval
 */
async function handleMetricsSubscription(
  socket: WebSocket,
  username: string,
  message: WebSocketMessage,
  setMetricsInterval: (interval: NodeJS.Timeout | null) => void
): Promise<void> {
  // Support both message.data.frequency and message.frequency for backwards compatibility
  const frequency = (message.data as any)?.frequency ?? (message as any).frequency ?? 0.2;

  // Validate frequency
  if (typeof frequency !== 'number' || frequency <= 0) {
    sendErrorMessage(socket, 'Invalid frequency - must be a positive number');
    return;
  }

  const intervalMs = Math.max(100, frequency * 1000);

  // Send initial snapshot
  try {
    const initialMetrics = await getMetricsSnapshot();
    socket.send(
      JSON.stringify({
        type: 'metrics_update',
        data: initialMetrics,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error('Error getting initial metrics:', error);
    sendErrorMessage(socket, 'Failed to get metrics');
    return;
  }

  // Start streaming interval
  const interval = setInterval(async () => {
    if (socket.readyState === WebSocket.OPEN) {
      try {
        const metrics = await getMetricsSnapshot();
        socket.send(
          JSON.stringify({
            type: 'metrics_update',
            data: metrics,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error('Error streaming metrics:', error);
      }
    } else {
      clearInterval(interval);
    }
  }, intervalMs);

  setMetricsInterval(interval);
  console.log(`📊 Metrics subscription started for ${username} at ${frequency}s`);
}

/**
 * Handle metrics unsubscription
 *
 * @param setMetricsInterval - Callback to clear interval
 */
function handleMetricsUnsubscription(setMetricsInterval: (interval: NodeJS.Timeout | null) => void): void {
  setMetricsInterval(null);
}

/**
 * Send error message to client
 *
 * @param socket - WebSocket connection
 * @param errorMessage - Error description
 */
function sendErrorMessage(socket: WebSocket, errorMessage: string): void {
  try {
    socket.send(
      JSON.stringify({
        type: 'error',
        error: errorMessage,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error('Failed to send error message:', error);
  }
}

/**
 * Broadcast configuration update to all users
 *
 * @param username - Username whose config changed
 * @param configUpdate - Updated configuration data
 */
export function broadcastConfigUpdate(username: string, configUpdate: any): void {
  const userSockets = USER_WEBSOCKET_SESSIONS.get(username);

  if (!userSockets) {
    return;
  }

  const message = JSON.stringify({
    type: 'config_update',
    data: configUpdate,
    timestamp: Date.now(),
  });

  userSockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(message);
      } catch (error) {
        console.error('Error broadcasting config update:', error);
      }
    }
  });
}

/**
 * Get all active user sessions
 *
 * @returns Map of username to WebSocket connections
 */
export function getUserSessions(): Map<string, WebSocket[]> {
  return USER_WEBSOCKET_SESSIONS;
}

/**
 * Create mock response object for session middleware
 * Session middleware requires response object for compatibility
 *
 * @returns Mock response object
 */
function createMockResponse(): any {
  return {
    headers: {},
    statusCode: 200,
    end() {},
    setHeader(key: string, value: string) {
      this.headers[key] = value;
    },
    getHeader(key: string) {
      return this.headers[key];
    },
    removeHeader(key: string) {
      delete this.headers[key];
    },
    writableEnded: false,
    writable: true,
  };
}
