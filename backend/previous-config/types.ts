/**
 * Backend-specific types for Previous configuration domain
 */
import type { Response } from 'express';

import type { PreviousConfig } from '@shared/previous-config/types';

// Re-export shared types for convenience
export type { PreviousConfig };

/**
 * Typed Express response
 */
export type TypedResponse<T = unknown> = Response<T>;

/**
 * Request to create a new configuration
 */
export interface CreateConfigurationRequest {
  name: string;
  description: string;
  config_data: PreviousConfig;
  is_active?: boolean;
}

/**
 * Request to update an existing configuration
 */
export interface UpdateConfigurationRequest {
  name?: string;
  description?: string;
  config_data?: PreviousConfig;
  is_active?: boolean;
}

/**
 * WebSocket message structure
 */
export interface WebSocketMessage {
  type: string;
  data?: any;
}

/**
 * WebSocket client connection
 */
export interface WebSocketClient {
  id: string;
  ws: WebSocket;
}
