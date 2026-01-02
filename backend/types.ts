import type { Response } from 'express';

/**
 * Typed Express response
 */
export type TypedResponse<T = unknown> = Response<T>;

/**
 * Previous system configuration object
 */
export interface PreviousConfig {
  system: {
    cpu_type: string;
    cpu_frequency: number;
    memory_size: number;
    turbo: boolean;
    fpu: boolean;
  };
  display: {
    type: string;
    width: number;
    height: number;
    color_depth: number;
    frameskip: number;
  };
  scsi: {
    hd0: string;
    hd1: string;
    hd2: string;
    hd3: string;
    hd4: string;
    hd5: string;
    hd6: string;
    cd: string;
  };
  network: {
    enabled: boolean;
    type: string;
  };
  sound: {
    enabled: boolean;
    output: string;
  };
  boot: {
    rom_file: string;
    scsi_id: number;
  };
  keyboard: {
    type: string;
  };
  mouse: {
    enabled: boolean;
  };
}

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
