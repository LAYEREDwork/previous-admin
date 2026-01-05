import { apiPaths } from '@shared/api/constants';
import type { PreviousConfig } from '@shared/previous-config/types';

import { apiBaseUrl } from '../constants';

/**
 * Converts a JSON configuration object to the Previous emulator's native configuration format (.cfg).
 * This calls the backend converter to ensure consistency between what's shown in the editor
 * and what would actually be written to disk.
 *
 * @param config {PreviousConfig} - The configuration object to convert
 * @returns {Promise<string>} - The formatted configuration file content
 * 
 * @remarks
 * The actual conversion logic lives on the backend (backend/config-schema/converter.ts).
 * This function acts as a client interface, ensuring the raw view preview always matches
 * what the server would actually write to disk.
 */
export async function convertToConfigFile(config: PreviousConfig): Promise<string> {
  try {
    const response = await fetch(`${apiBaseUrl}${apiPaths.Config.convertToCfg.full}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ config }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as { cfgContent: string };
    return data.cfgContent;
  } catch (error) {
    console.error('Error converting config to CFG:', error);
    // Return a fallback error message
    return `Error converting configuration: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}
