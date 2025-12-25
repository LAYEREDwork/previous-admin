// Combined database client
import { configurations } from './configurations';
import { maintenance } from './maintenance';

export const database = {
  ...configurations,
  ...maintenance,
};

// Re-export types
export type { Configuration, PreviousConfig } from './configurations';