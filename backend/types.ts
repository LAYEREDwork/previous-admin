import type { Response } from 'express';

import type { PreviousConfig } from '@shared/previous-config/types';

// Re-export shared types for convenience
export type { PreviousConfig };

/**
 * Typed Express response
 */
export type TypedResponse<T = unknown> = Response<T>;

/**
 * Stored configuration metadata
 */
export interface Configuration {
  id: string;
  name: string;
  description: string;
  config_data: PreviousConfig;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

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
