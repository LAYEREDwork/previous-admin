/**
 * Unit tests for configuration service
 *
 * Tests business logic in configurationService.ts
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import type { PreviousConfig } from '@shared/previous-config/types';

// Mock the database functions
vi.mock('@backend/database/configurations', () => ({
  getConfigurations: vi.fn(),
  getConfiguration: vi.fn(),
  createConfiguration: vi.fn(),
  updateConfiguration: vi.fn(),
  deleteConfiguration: vi.fn(),
  setActiveConfiguration: vi.fn(),
  updateConfigurationsOrder: vi.fn(),
  getActiveConfiguration: vi.fn(),
}));

// Also mock the relative path variant to cover compiled tests in /dist
vi.mock('../database/configurations', () => ({
  getConfigurations: vi.fn(),
  getConfiguration: vi.fn(),
  createConfiguration: vi.fn(),
  updateConfiguration: vi.fn(),
  deleteConfiguration: vi.fn(),
  setActiveConfiguration: vi.fn(),
  updateConfigurationsOrder: vi.fn(),
  getActiveConfiguration: vi.fn(),
}));

import {
  getConfigurations as dbGetConfigurations,
  getConfiguration as dbGetConfiguration,
  createConfiguration as dbCreateConfiguration,
  updateConfiguration as dbUpdateConfiguration,
  deleteConfiguration as dbDeleteConfiguration,
  setActiveConfiguration as dbSetActiveConfiguration,
  updateConfigurationsOrder as dbUpdateConfigurationsOrder,
  getActiveConfiguration as dbGetActiveConfiguration,
} from '@backend/database/configurations';

import {
  getConfigurations,
  getConfigurationById,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
  setActiveConfiguration,
  updateConfigurationOrder,
  getActiveConfiguration,
} from '@backend/services/configurationService';

import type { Configuration, CreateConfigurationRequest, UpdateConfigurationRequest } from '@backend/types';

describe('ConfigurationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getConfigurations', () => {
    it('should return configurations for user', () => {
      const mockConfigs: Configuration[] = [{ id: '1', name: 'Test' } as Configuration];
      vi.mocked(dbGetConfigurations).mockReturnValue(mockConfigs);

      const result = getConfigurations();
      expect(result).toEqual(mockConfigs);
      expect(dbGetConfigurations).toHaveBeenCalled();
    });
  });

  describe('getConfigurationById', () => {
    it('should return configuration by id', () => {
      const mockConfig: Configuration = { id: '1', name: 'Test' } as Configuration;
      vi.mocked(dbGetConfiguration).mockReturnValue(mockConfig);

      const result = getConfigurationById('1');
      expect(result).toEqual(mockConfig);
      expect(dbGetConfiguration).toHaveBeenCalledWith('1');
    });
  });

  describe('createConfiguration', () => {
    // Suppress console.warn during schema validation fallback tests
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create configuration with valid data', () => {
      const request: CreateConfigurationRequest = {
        name: 'Test Config',
        description: 'Test description',
        config_data: {
          system: { cpu_type: '68040', cpu_frequency: 25, memory_size: 32, turbo: false, fpu: true },
          display: { type: 'color', width: 640, height: 480, color_depth: 8, frameskip: 0 },
          scsi: { hd0: '', hd1: '', hd2: '', hd3: '', hd4: '', hd5: '', hd6: '' }
        } as PreviousConfig
      };
      const mockConfig: Configuration = { id: '1', name: 'Test Config' } as Configuration;
      vi.mocked(dbCreateConfiguration).mockReturnValue(mockConfig);

      const result = createConfiguration(request);
      expect(result).toEqual(mockConfig);
      expect(dbCreateConfiguration).toHaveBeenCalledWith(request);
    });

    it('should throw error for invalid configuration', () => {
      const request: CreateConfigurationRequest = {
        name: 'Test Config',
        description: 'Test description',
        config_data: {
          system: { cpu_type: '', cpu_frequency: 0, memory_size: 0, turbo: false, fpu: false },
          display: { type: '', width: 0, height: 0, color_depth: 0, frameskip: 0 },
          scsi: { hd0: '', hd1: '', hd2: '', hd3: '', hd4: '', hd5: '', hd6: '', cd: '' },
          network: { enabled: false, type: '' },
          sound: { enabled: false, output: '' },
          boot: { rom_file: '', scsi_id: 0 },
          keyboard: { type: '' },
          mouse: { enabled: false }
        }
      };

      expect(() => createConfiguration(request)).toThrow('Invalid CPU configuration');
    });
  });

  describe('updateConfiguration', () => {
    it('should update existing configuration', () => {
      const request: UpdateConfigurationRequest = { name: 'Updated Name' };
      const mockConfig: Configuration = { id: '1', name: 'Updated Name' } as Configuration;
      vi.mocked(dbGetConfiguration).mockReturnValue(mockConfig);
      vi.mocked(dbUpdateConfiguration).mockReturnValue(mockConfig);

      const result = updateConfiguration('1', request);
      expect(result).toEqual(mockConfig);
      expect(dbUpdateConfiguration).toHaveBeenCalledWith('1', request);
    });

    it('should throw error if configuration not found', () => {
      vi.mocked(dbGetConfiguration).mockReturnValue(undefined);

      expect(() => updateConfiguration('1', { name: 'Test' })).toThrow('Configuration not found');
    });
  });

  describe('deleteConfiguration', () => {
    it('should delete configuration if not active', () => {
      const mockConfig: Configuration = { id: '1', name: 'Test' } as Configuration;
      vi.mocked(dbGetConfiguration).mockReturnValue(mockConfig);
      vi.mocked(dbGetActiveConfiguration).mockReturnValue(null);

      deleteConfiguration('1');
      expect(dbDeleteConfiguration).toHaveBeenCalledWith('1');
    });

    it('should delete active configuration without error', () => {
      const mockConfig: Configuration = { id: '1', name: 'Test' } as Configuration;
      vi.mocked(dbGetConfiguration).mockReturnValue(mockConfig);
      vi.mocked(dbGetActiveConfiguration).mockReturnValue(mockConfig);

      deleteConfiguration('1');
      expect(dbDeleteConfiguration).toHaveBeenCalledWith('1');
    });
  });

  describe('setActiveConfiguration', () => {
    it('should set active configuration', () => {
      const mockConfig: Configuration = { id: '1', name: 'Test' } as Configuration;
      vi.mocked(dbGetConfiguration).mockReturnValue(mockConfig);

      setActiveConfiguration('1');
      expect(dbSetActiveConfiguration).toHaveBeenCalledWith('1');
    });

    it('should throw error if configuration not found', () => {
      vi.mocked(dbGetConfiguration).mockReturnValue(undefined);

      expect(() => setActiveConfiguration('1')).toThrow('Configuration not found');
    });
  });

  describe('updateConfigurationOrder', () => {
    it('should update configuration order', () => {
      const orderedIds = ['1', '2'];
      updateConfigurationOrder(orderedIds);
      expect(dbUpdateConfigurationsOrder).toHaveBeenCalledWith(orderedIds);
    });
  });

  describe('getActiveConfiguration', () => {
    it('should return active configuration', () => {
      const mockConfig: Configuration = { id: '1', name: 'Test' } as Configuration;
      vi.mocked(dbGetActiveConfiguration).mockReturnValue(mockConfig);

      const result = getActiveConfiguration();
      expect(result).toEqual(mockConfig);
      expect(dbGetActiveConfiguration).toHaveBeenCalled();
    });
  });
});