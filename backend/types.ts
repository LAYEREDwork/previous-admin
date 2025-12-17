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
  created_by: string | null;
}

/**
 * User database record
 */
export interface User {
  id: string;
  username: string;
  password_hash: string;
  email: string | null;
  created_at: string;
  last_login: string | null;
}

/**
 * Request to create a new user
 */
export interface CreateUserRequest {
  username: string;
  password: string;
  email?: string;
}

/**
 * User session data stored in session store
 */
export interface UserSessionData {
  userId: string;
  username: string;
}

/**
 * Request to create a new configuration
 */
export interface CreateConfigurationRequest {
  name: string;
  description: string;
  config_data: any;
  is_active?: boolean;
  created_by?: string | null;
}

/**
 * Request to update an existing configuration
 */
export interface UpdateConfigurationRequest {
  name?: string;
  description?: string;
  config_data?: any;
  is_active?: boolean;
}

/**
 * Express request with authenticated user session
 */
export interface AuthenticatedRequest extends Express.Request {
  session: Express.SessionData & {
    userId?: string;
    username?: string;
  };
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
  ws: any;
  userId?: string;
}
