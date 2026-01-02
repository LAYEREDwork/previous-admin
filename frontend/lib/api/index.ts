// Combined API client
import { configApi, ApiError } from './config';

export const api = {
  ...configApi,
};

// Re-export types for convenience
export { ApiError };
