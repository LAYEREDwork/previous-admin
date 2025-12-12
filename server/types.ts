/**
 * Central type definitions and interfaces for the backend
 * Ensures type safety across all modules
 */

import { Request, Response } from 'express';
import { WebSocket } from 'ws';

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface UserSessionData {
  userId: number;
  username: string;
  loginTime: number;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface Configuration {
  id?: number;
  userId: number;
  name: string;
  description: string;
  configContent: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConfigurationRequest {
  name: string;
  description: string;
  configContent: string;
}

export interface UpdateConfigurationRequest {
  name?: string;
  description?: string;
  configContent?: string;
  isActive?: boolean;
}

// ============================================================================
// SYSTEM TYPES
// ============================================================================

export interface SystemInfo {
  os: string;
  platform: string;
  hostname: string;
  arch: string;
  kernel: string;
  hostModel: { name: string };
  release: string;
}

export interface MetricsSnapshot {
  timestamp: number;
  cpu: CPUMetrics;
  memory: MemoryMetrics;
  disk: DiskMetrics;
  network: NetworkMetrics;
}

export interface CPUMetrics {
  usage: number; // 0-100
  cores: number;
  temperature?: number;
}

export interface MemoryMetrics {
  used: number;
  total: number;
  percentage: number;
}

export interface DiskMetrics {
  read: number; // bytes/sec
  write: number; // bytes/sec
  usagePercentage: number;
}

export interface NetworkMetrics {
  received: number; // bytes
  transmitted: number; // bytes
}

export interface VersionInfo {
  current: string;
  latest: string;
  updateAvailable: boolean;
  downloadUrl?: string;
}

// ============================================================================
// FILE OPERATIONS
// ============================================================================

export interface FileWatcherConfig {
  stabilityThreshold: number;
  pollInterval: number;
  debounceDelay: number;
}

export interface ConfigFileContent {
  [key: string]: unknown;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
  timestamp: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  errorCode: string;
  timestamp: number;
}

export interface PaginatedResponse<TData> {
  items: TData[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// MIDDLEWARE / REQUEST CONTEXT
// ============================================================================

export interface AuthenticatedRequest extends Request {
  session?: {
    userId?: number;
    username?: string;
  };
}

export interface WebSocketMessage {
  type: 'subscribe' | 'unsubscribe' | 'update' | 'error' | 'ping' | 'pong';
  data?: unknown;
  error?: string;
  timestamp?: number;
}

export interface WebSocketClient {
  socket: WebSocket;
  userId: number;
  subscriptions: Set<string>;
}

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface DatabaseConfig {
  filename: string;
  timeout: number;
  integrityCheck: boolean;
}

export interface DatabaseQueryResult<TRow = unknown> {
  rows: TRow[];
  rowsAffected: number;
}

// ============================================================================
// EXPORT UTILITY FUNCTIONS
// ============================================================================

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T> | ApiErrorResponse
): response is ApiResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(
  response: unknown
): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false
  );
}
