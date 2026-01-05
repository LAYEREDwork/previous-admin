/**
 * Tests for config schema generation pipeline
 * 
 * Tests the entire flow:
 * 1. parseCfgFile - parsing CFG format
 * 2. extractSchema - type interpretation
 * 3. validateConfigValue - value validation
 */

import { describe, it, expect } from 'vitest';

import { parseCfgFile, validateRawConfigStructure } from '../config-schema/config-parser';
import { extractSchema, toDisplayName } from '../config-schema/schema-extractor';
import { validateConfigValue, validateConfiguration } from '../config-schema/validator';

describe('Config Schema Generation', () => {
  describe('parseCfgFile', () => {
    it('should parse basic CFG structure with sections and parameters', () => {
      const cfgContent = `
[ConfigDialog]
# Type: Bool
# Meaning: Show dialog at startup
bShowDialog = TRUE

[System]
# Type: Int
# Meaning: Machine type
nMachineType = 0
`;

      const result = parseCfgFile(cfgContent);

      expect(result.sections).toHaveLength(2);
      expect(result.sections[0].name).toBe('ConfigDialog');
      expect(result.sections[0].parameters).toHaveLength(1);
      expect(result.sections[0].parameters[0].name).toBe('bShowDialog');
      expect(result.sections[0].parameters[0].value).toBe('TRUE');
    });

    it('should extract comments above parameters', () => {
      const cfgContent = `
[ConfigDialog]
# Type: Bool
# Meaning: Show dialog
# Default: TRUE
bShowDialog = TRUE
`;

      const result = parseCfgFile(cfgContent);
      const param = result.sections[0].parameters[0];

      expect(param.comments).toContain('# Type: Bool');
      expect(param.comments).toContain('# Meaning: Show dialog');
      expect(param.comments).toContain('# Default: TRUE');
    });

    it('should handle multiple parameters in a section', () => {
      const cfgContent = `
[System]
# Type: Int
nParam1 = 1

# Type: String
sParam2 = value
`;

      const result = parseCfgFile(cfgContent);
      const section = result.sections[0];

      expect(section.parameters).toHaveLength(2);
      expect(section.parameters[0].name).toBe('nParam1');
      expect(section.parameters[1].name).toBe('sParam2');
    });

    it('should validate raw config structure', () => {
      const cfgContent = `
[ConfigDialog]
# Type: Bool
bShowDialog = TRUE
`;

      const rawConfig = parseCfgFile(cfgContent);
      const valid = validateRawConfigStructure(rawConfig);

      expect(valid).toBe(true);
    });
  });

  describe('extractSchema', () => {
    it('should interpret boolean types from comments', () => {
      const cfgContent = `
[ConfigDialog]
# Type: Bool
# Meaning: Show dialog
bShowDialog = TRUE
`;

      const rawConfig = parseCfgFile(cfgContent);
      const schema = extractSchema(rawConfig);
      const configDialog = Object.values(schema.sections).find(s => s.name === 'ConfigDialog');
      const param = configDialog?.parameters[0];

      expect(param?.type).toBe('boolean');
      expect(param?.default).toBe(true);
    });

    it('should interpret number types from comments', () => {
      const cfgContent = `
[System]
# Type: Int
# Meaning: Machine type
# Default: 0
nMachineType = 0
`;

      const rawConfig = parseCfgFile(cfgContent);
      const schema = extractSchema(rawConfig);
      const system = Object.values(schema.sections).find(s => s.name === 'System');
      const param = system?.parameters[0];

      expect(param?.type).toBe('number');
      expect(param?.default).toBe(0);
    });

    it('should interpret enum types from possible values', () => {
      const cfgContent = `
[System]
# Type: Int
# Possible Values: 0, 1, 2
# Meaning: Machine type
nMachineType = 0
`;

      const rawConfig = parseCfgFile(cfgContent);
      const schema = extractSchema(rawConfig);
      const system = Object.values(schema.sections).find(s => s.name === 'System');
      const param = system?.parameters[0];

      expect(param?.type).toBe('enum');
      expect(param?.possibleValues).toEqual(['0', '1', '2']);
    });

    it('should interpret range types from range notation', () => {
      const cfgContent = `
[Memory]
# Type: Int
# Possible Values: 0-32
# Meaning: Memory size
nMemorySize = 16
`;

      const rawConfig = parseCfgFile(cfgContent);
      const schema = extractSchema(rawConfig);
      const memory = Object.values(schema.sections).find(s => s.name === 'Memory');
      const param = memory?.parameters[0];

      expect(param?.type).toBe('range');
      expect(param?.min).toBe(0);
      expect(param?.max).toBe(32);
    });

    it('should generate translation keys correctly', () => {
      const cfgContent = `
[ConfigDialog]
# Type: Bool
bShowDialog = TRUE
`;

      const rawConfig = parseCfgFile(cfgContent);
      const schema = extractSchema(rawConfig);
      const configDialog = Object.values(schema.sections).find(s => s.name === 'ConfigDialog');
      const param = configDialog?.parameters[0];

      expect(param?.translationKey).toBe('configEditor.parameters.bShowDialog');
      expect(configDialog?.translationKey).toBe('configEditor.sections.ConfigDialog');
    });

    it('should convert section names to display names', () => {
      const cfgContent = `
[ConfigDialog]
# Type: Bool
bShowDialog = TRUE

[SystemSettings]
# Type: Int
nValue = 0
`;

      const rawConfig = parseCfgFile(cfgContent);
      const schema = extractSchema(rawConfig);

      const configDialog = Object.values(schema.sections).find(s => s.name === 'ConfigDialog');
      const systemSettings = Object.values(schema.sections).find(s => s.name === 'SystemSettings');
      expect(configDialog?.displayName).toBe('Config Dialog');
      expect(systemSettings?.displayName).toBe('System Settings');
    });

    it('should apply symbol mapping', () => {
      const cfgContent = `
[ConfigDialog]
# Type: Bool
bShowDialog = TRUE
`;

      const rawConfig = parseCfgFile(cfgContent);
      const symbolMapping = { ConfigDialog: 'gearshape.fill' };
      const schema = extractSchema(rawConfig, symbolMapping);

      const configDialogSection = Object.values(schema.sections).find(s => s.name === 'ConfigDialog');
      expect(configDialogSection?.sfSymbol).toBe('gearshape.fill');
    });

    it('should use default symbol if not in mapping', () => {
      const cfgContent = `
[UnknownSection]
# Type: Bool
bValue = TRUE
`;

      const rawConfig = parseCfgFile(cfgContent);
      const schema = extractSchema(rawConfig, {});

      const unknownSection = Object.values(schema.sections).find(s => s.name === 'UnknownSection');
      expect(unknownSection?.sfSymbol).toBe('gearshape.fill');
    });
  });

  describe('toDisplayName', () => {
    it('should convert CamelCase to spaced format', () => {
      expect(toDisplayName('ConfigDialog')).toBe('Config Dialog');
      expect(toDisplayName('SystemSettings')).toBe('System Settings');
      expect(toDisplayName('NetworkConfiguration')).toBe('Network Configuration');
    });

    it('should handle single words', () => {
      expect(toDisplayName('System')).toBe('System');
      expect(toDisplayName('Memory')).toBe('Memory');
    });
  });

  describe('validateConfigValue', () => {
    const testSchema = {
      sections: {
        System: {
          name: 'System',
          displayName: 'System',
          translationKey: 'configEditor.sections.System',
          sfSymbol: 'server.rack',
          parameters: [
            {
              name: 'bEnabled',
              type: 'boolean' as const,
              default: true,
              description: 'Enable system',
              translationKey: 'configEditor.parameters.bEnabled'
            },
            {
              name: 'nValue',
              type: 'number' as const,
              default: 10,
              description: 'Some value',
              translationKey: 'configEditor.parameters.nValue',
              min: 0,
              max: 100
            },
            {
              name: 'eType',
              type: 'enum' as const,
              default: 'A',
              description: 'Type selection',
              translationKey: 'configEditor.parameters.eType',
              possibleValues: ['A', 'B', 'C']
            }
          ]
        }
      }
    };

    it('should validate boolean values', () => {
      expect(validateConfigValue('System', 'bEnabled', true, testSchema).valid).toBe(true);
      expect(validateConfigValue('System', 'bEnabled', 'TRUE', testSchema).valid).toBe(true);
      expect(validateConfigValue('System', 'bEnabled', 'invalid', testSchema).valid).toBe(false);
    });

    it('should validate numeric values with bounds', () => {
      expect(validateConfigValue('System', 'nValue', 50, testSchema).valid).toBe(true);
      expect(validateConfigValue('System', 'nValue', 0, testSchema).valid).toBe(true);
      expect(validateConfigValue('System', 'nValue', 100, testSchema).valid).toBe(true);
      expect(validateConfigValue('System', 'nValue', -1, testSchema).valid).toBe(false);
      expect(validateConfigValue('System', 'nValue', 101, testSchema).valid).toBe(false);
    });

    it('should validate enum values', () => {
      expect(validateConfigValue('System', 'eType', 'A', testSchema).valid).toBe(true);
      expect(validateConfigValue('System', 'eType', 'B', testSchema).valid).toBe(true);
      expect(validateConfigValue('System', 'eType', 'INVALID', testSchema).valid).toBe(false);
    });

    it('should return error for non-existent section', () => {
      const result = validateConfigValue('Invalid', 'bEnabled', true, testSchema);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Section not found');
    });

    it('should return error for non-existent parameter', () => {
      const result = validateConfigValue('System', 'bInvalid', true, testSchema);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Parameter not found');
    });
  });

  describe('validateConfiguration', () => {
    const testSchema = {
      sections: {
        System: {
          name: 'System',
          displayName: 'System',
          translationKey: 'configEditor.sections.System',
          sfSymbol: 'server.rack',
          parameters: [
            {
              name: 'bEnabled',
              type: 'boolean' as const,
              default: true,
              description: 'Enable',
              translationKey: 'configEditor.parameters.bEnabled'
            },
            {
              name: 'nValue',
              type: 'number' as const,
              default: 10,
              description: 'Value',
              translationKey: 'configEditor.parameters.nValue',
              min: 0,
              max: 100
            }
          ]
        }
      }
    };

    it('should validate complete configuration object', () => {
      const config = {
        System: {
          bEnabled: true,
          nValue: 50
        }
      };

      const result = validateConfiguration(config, testSchema);
      expect(result.valid).toBe(true);
    });

    it('should return error on first invalid value', () => {
      const config = {
        System: {
          bEnabled: 'invalid',
          nValue: 50
        }
      };

      const result = validateConfiguration(config, testSchema);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
