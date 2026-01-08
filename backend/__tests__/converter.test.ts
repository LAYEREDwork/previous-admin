/**
 * Tests for CFG converter and config-schema API endpoint
 * 
 * Tests:
 * 1. CFG to JSON conversion
 * 2. JSON to CFG conversion
 * 3. Round-trip conversion (CFG → JSON → CFG)
 */

import { describe, it, expect } from 'vitest';

import type { ConfigSchema } from '@shared/previous-config/schema-types';

import { cfgToJson, jsonToCfg } from '../config-schema/converter';

describe('CFG Converter', () => {
  // Test schema
  const testSchema: ConfigSchema = {
    sections: {
      ConfigDialog: {
        name: 'ConfigDialog',
        displayName: 'Config Dialog',
        translationKey: 'configEditor.sections.ConfigDialog',
        sfSymbol: 'gearshape.fill',
        parameters: [
          {
            name: 'bShowDialog',
            type: 'boolean',
            default: true,
            description: 'Show config dialog',
            translationKey: 'configEditor.parameters.bShowDialog'
          },
          {
            name: 'nDialogWidth',
            type: 'number',
            default: 800,
            description: 'Dialog width',
            translationKey: 'configEditor.parameters.nDialogWidth',
            min: 400,
            max: 1200
          }
        ]
      },
      System: {
        name: 'System',
        displayName: 'System',
        translationKey: 'configEditor.sections.System',
        sfSymbol: 'server.rack',
        parameters: [
          {
            name: 'nMachineType',
            type: 'enum',
            default: '0',
            description: 'Machine type',
            translationKey: 'configEditor.parameters.nMachineType',
            possibleValues: ['0', '1', '2'],
            labels: ['CUBE030', 'CUBE040', 'STATION']
          },
          {
            name: 'sModelName',
            type: 'string',
            default: 'NeXT',
            description: 'Model name',
            translationKey: 'configEditor.parameters.sModelName'
          }
        ]
      }
    }
  };

  describe('cfgToJson', () => {
    it('should convert basic CFG to JSON with correct types', () => {
      const cfgContent = `
[ConfigDialog]
bShowDialog = TRUE
nDialogWidth = 800

[System]
nMachineType = 1
sModelName = NeXT Computer
`;

      const result = cfgToJson(cfgContent, testSchema);

      expect(result.ConfigDialog.bShowDialog).toBe(true);
      expect(result.ConfigDialog.nDialogWidth).toBe(800);
      expect(result.System.nMachineType).toBe('1');
      expect(result.System.sModelName).toBe('NeXT Computer');
    });

    it('should handle boolean values (TRUE/FALSE)', () => {
      const cfgContent = `
[ConfigDialog]
bShowDialog = TRUE
nDialogWidth = 800
`;

      const result = cfgToJson(cfgContent, testSchema);

      expect(result.ConfigDialog.bShowDialog).toBe(true);
      expect(typeof result.ConfigDialog.bShowDialog).toBe('boolean');
    });

    it('should handle boolean values (lowercase true/false)', () => {
      const cfgContent = `
[ConfigDialog]
bShowDialog = true
nDialogWidth = 800
`;

      const result = cfgToJson(cfgContent, testSchema);

      expect(result.ConfigDialog.bShowDialog).toBe(true);
    });

    it('should parse numbers correctly', () => {
      const cfgContent = `
[ConfigDialog]
bShowDialog = TRUE
nDialogWidth = 1024
`;

      const result = cfgToJson(cfgContent, testSchema);

      expect(result.ConfigDialog.nDialogWidth).toBe(1024);
      expect(typeof result.ConfigDialog.nDialogWidth).toBe('number');
    });

    it('should handle enum values as strings', () => {
      const cfgContent = `
[System]
nMachineType = 2
sModelName = NeXT
`;

      const result = cfgToJson(cfgContent, testSchema);

      expect(result.System.nMachineType).toBe('2');
      expect(typeof result.System.nMachineType).toBe('string');
    });

    it('should warn about sections not in schema', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const cfgContent = `
[UnknownSection]
param = value
`;

      cfgToJson(cfgContent, testSchema);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Section not found in schema: UnknownSection')
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('jsonToCfg', () => {
    it('should convert JSON to CFG format', () => {
      const config = {
        ConfigDialog: {
          bShowDialog: true,
          nDialogWidth: 800
        },
        System: {
          nMachineType: '1',
          sModelName: 'NeXT Computer'
        }
      };

      const result = jsonToCfg(config, testSchema);

      expect(result).toContain('[ConfigDialog]');
      expect(result).toContain('bShowDialog = TRUE');
      expect(result).toContain('nDialogWidth = 800');
      expect(result).toContain('[System]');
      expect(result).toContain('nMachineType = 1');
      expect(result).toContain('sModelName = NeXT Computer');
    });

    it('should convert boolean true to TRUE', () => {
      const config = {
        ConfigDialog: {
          bShowDialog: true,
          nDialogWidth: 800
        }
      };

      const result = jsonToCfg(config, testSchema);

      expect(result).toContain('bShowDialog = TRUE');
      expect(result).not.toContain('bShowDialog = true');
    });

    it('should convert boolean false to FALSE', () => {
      const config = {
        ConfigDialog: {
          bShowDialog: false,
          nDialogWidth: 800
        }
      };

      const result = jsonToCfg(config, testSchema);

      expect(result).toContain('bShowDialog = FALSE');
    });

    it('should use defaults for missing parameters', () => {
      const config = {
        ConfigDialog: {
          bShowDialog: true
          // nDialogWidth missing - should use default
        }
      };

      const result = jsonToCfg(config, testSchema);

      expect(result).toContain('bShowDialog = TRUE');
      expect(result).toContain('nDialogWidth = 800'); // Default value
    });

    it('should skip sections not in config', () => {
      const config = {
        ConfigDialog: {
          bShowDialog: true,
          nDialogWidth: 800
        }
        // System section omitted
      };

      const result = jsonToCfg(config, testSchema);

      expect(result).toContain('[ConfigDialog]');
      expect(result).not.toContain('[System]');
    });
  });

  describe('Round-trip conversion', () => {
    it('should preserve data through CFG → JSON → CFG conversion', () => {
      const originalCfg = `[ConfigDialog]
bShowDialog = TRUE
nDialogWidth = 800

[System]
nMachineType = 1
sModelName = NeXT Computer
`;

      const json = cfgToJson(originalCfg, testSchema);
      const convertedCfg = jsonToCfg(json, testSchema);

      // Parse both to compare structure (ignoring whitespace/comments)
      const originalJson = cfgToJson(originalCfg, testSchema);
      const roundtripJson = cfgToJson(convertedCfg, testSchema);

      expect(roundtripJson).toEqual(originalJson);
    });

    it('should preserve boolean values through round-trip', () => {
      const originalCfg = `[ConfigDialog]
bShowDialog = TRUE
nDialogWidth = 800
`;

      const json = cfgToJson(originalCfg, testSchema);
      const convertedCfg = jsonToCfg(json, testSchema);

      expect(convertedCfg).toContain('bShowDialog = TRUE');
      
      const roundtripJson = cfgToJson(convertedCfg, testSchema);
      expect(roundtripJson.ConfigDialog.bShowDialog).toBe(true);
    });

    it('should preserve numeric values through round-trip', () => {
      const originalCfg = `[ConfigDialog]
bShowDialog = TRUE
nDialogWidth = 1024
`;

      const json = cfgToJson(originalCfg, testSchema);
      const convertedCfg = jsonToCfg(json, testSchema);
      const roundtripJson = cfgToJson(convertedCfg, testSchema);

      expect(roundtripJson.ConfigDialog.nDialogWidth).toBe(1024);
    });
  });
});
