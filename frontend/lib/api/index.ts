// Combined API client
import { authApi, checkSetupRequired } from './auth';
import { configApi } from './config';

export const api = {
  ...authApi,
  ...configApi,
};

// Re-export frequently used functions and types for convenience.
// ApiError is exported from both auth and config, so we pick one.
export { ApiError } from './auth';
export { checkSetupRequired };