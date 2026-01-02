/**
 * WebSocket server for real-time updates
 *
 * Handles WebSocket connections for streaming metrics, configuration updates,
 * and real-time notifications.
 *
 * @module backend/websocket
 */

import { WebSocketServer, WebSocket } from 'ws';
import { getMetricsSnapshot } from './metrics';

import type { WebSocketMessage } from './types';

/**
 * List of all active WebSocket connections
 */
const ACTIVE_WEBSOCKET_CONNECTIONS: WebSocket[] = [];

/**
 * Setup WebSocket server
 *
 * Creates and configures WebSocket server on top of HTTP server.
 *
 * @param httpServer - HTTP server instance from createServer()
 * @returns Configured WebSocket server instance
 */
export function setupWebSocket(httpServer: any): WebSocketServer {
  const websocketServer = new WebSocketServer({ server: httpServer });

  websocketServer.on('connection', (socket: WebSocket) => {
    handleWebSocketConnection(socket);
  });

  console.log('✅ WebSocket server initialized');
  return websocketServer;
}

/**
 * Handle new WebSocket connection
 *
 * @param socket - WebSocket connection
 */
function handleWebSocketConnection(socket: WebSocket): void {
  // Register connection
  ACTIVE_WEBSOCKET_CONNECTIONS.push(socket);

  console.log(`✅ WebSocket connected (${ACTIVE_WEBSOCKET_CONNECTIONS.length} active connections)`);

  let metricsStreamInterval: NodeJS.Timeout | null = null;

  /**
   * Handle incoming WebSocket messages
   */
  socket.on('message', (messageData: Buffer) => {
    try {
      handleWebSocketMessage(
        messageData,
        socket,
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
    console.error(`WebSocket error:`, error);
  });

  /**
   * Handle socket closure
   */
  socket.on('close', () => {
    // Cleanup metrics interval
    if (metricsStreamInterval) {
      clearInterval(metricsStreamInterval);
    }

    // Remove from connections list
    const index = ACTIVE_WEBSOCKET_CONNECTIONS.indexOf(socket);
    if (index > -1) {
      ACTIVE_WEBSOCKET_CONNECTIONS.splice(index, 1);
    }

    console.log(`WebSocket disconnected (${ACTIVE_WEBSOCKET_CONNECTIONS.length} active connections)`);
  });
}

/**
 * Handle WebSocket message processing
 *
 * Parses and routes messages to appropriate handlers.
 *
 * @param messageData - Raw message buffer
 * @param socket - WebSocket connection
 * @param setMetricsInterval - Callback to set metrics stream interval
 */
function handleWebSocketMessage(
  messageData: Buffer,
  socket: WebSocket,
  setMetricsInterval: (interval: NodeJS.Timeout | null) => void
): void {
  let parsedMessage: WebSocketMessage;

  // Safe JSON parsing with error handling
  try {
    const messageText = messageData.toString('utf-8');
    parsedMessage = JSON.parse(messageText) as WebSocketMessage;
  } catch (parseError) {
    console.warn(`Invalid WebSocket message:`, parseError);
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
      handleMetricsSubscription(socket, parsedMessage, setMetricsInterval);
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
 * @param message - Subscription message with optional frequency
 * @param setMetricsInterval - Callback to register interval
 */
async function handleMetricsSubscription(
  socket: WebSocket,
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
  console.log(`📊 Metrics subscription started at ${frequency}s interval`);
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
 * Broadcast configuration update to all connected clients
 *
 * @param configUpdate - Updated configuration data
 */
export function broadcastConfigUpdate(configUpdate: any): void {
  const message = JSON.stringify({
    type: 'config_update',
    data: configUpdate,
    timestamp: Date.now(),
  });

  ACTIVE_WEBSOCKET_CONNECTIONS.forEach((socket) => {
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
 * Get all active WebSocket connections
 *
 * @returns Array of active WebSocket connections
 */
export function getActiveConnections(): WebSocket[] {
  return ACTIVE_WEBSOCKET_CONNECTIONS;
}
