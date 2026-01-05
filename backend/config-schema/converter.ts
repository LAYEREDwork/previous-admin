/**
 * CFG ↔ JSON Converter
 * 
 * Converts between Previous emulator CFG file format and JSON representation.
 * Uses the configuration schema for type information and validation.
 * 
 * @module backend/config-schema/converter
 */

import type { ConfigSchema } from '../../shared/previous-config/schema-types';

import { parseCfgFile, type RawConfigData } from './config-parser';

/**
 * Generic configuration object (JSON representation)
 * 
 * Structure: { SectionName: { parameterName: value, ... }, ... }
 */
export type ConfigObject = Record<string, Record<string, string | number | boolean>>;

/**
 * Extract creation date from CFG file header
 * 
 * Looks for "Created: DD.MM.YYYY HH:MM:SS" pattern in header comments
 * 
 * @param headerComments Header comment lines from parsed CFG file
 * @returns ISO date string or null if not found
 * 
 * @example
 * const headers = ['# Previous Emulator Configuration', '# Created: 05.01.2026 16:23:57'];
 * const date = extractCreatedDate(headers); // "2026-01-05T16:23:57"
 */
export function extractCreatedDate(headerComments: string[]): string | null {
  for (const comment of headerComments) {
    const match = comment.match(/Created:\s+(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, day, month, year, hours, minutes, seconds] = match;
      // Convert DD.MM.YYYY HH:MM:SS to ISO string
      const isoDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      ).toISOString();
      return isoDate;
    }
  }
  return null;
}

/**
 * Convert CFG file content to JSON object
 * 
 * Parses CFG file and converts values to appropriate types based on schema.
 * 
 * @param cfgContent Raw CFG file content
 * @param schema Configuration schema (for type conversion)
 * @returns Typed configuration object
 * 
 * @example
 * const cfgContent = fs.readFileSync('config.cfg', 'utf-8');
 * const schema = loadSchema();
 * const config = cfgToJson(cfgContent, schema);
 * // config = { ConfigDialog: { bShowDialog: true }, System: { nMachineType: 0 } }
 */
export function cfgToJson(cfgContent: string, schema: ConfigSchema): ConfigObject {
  const rawConfig = parseCfgFile(cfgContent);
  const config: ConfigObject = {};

  for (const section of rawConfig.sections) {
    const sectionSchema = Object.values(schema.sections).find(s => s.name === section.name);
    if (!sectionSchema) {
      // Section not in schema - skip or store as-is
      console.warn(`Section not found in schema: ${section.name}`);
      continue;
    }

    config[section.name] = {};

    for (const param of section.parameters) {
      const paramSchema = sectionSchema.parameters.find(p => p.name === param.name);
      if (!paramSchema) {
        console.warn(`Parameter not found in schema: ${section.name}.${param.name}`);
        continue;
      }

      // Convert value based on schema type
      config[section.name][param.name] = convertStringToType(
        param.value,
        paramSchema.type
      );
    }
  }

  return config;
}

/**
 * Convert JSON object to CFG file content
 * 
 * Generates CFG file format from configuration object.
 * Includes section headers and comments for readability.
 * 
 * @param config Configuration object
 * @param schema Configuration schema (for ordering and metadata)
 * @returns CFG file content
 * 
 * @example
 * const config = { ConfigDialog: { bShowDialog: true }, System: { nMachineType: 0 } };
 * const schema = loadSchema();
 * const cfgContent = jsonToCfg(config, schema);
 * // Returns properly formatted CFG file content
 */
/**
 * Convert JSON object to CFG file format
 * 
 * Takes typed configuration object and schema, generates formatted CFG file.
 * Sections are written in schema order, parameters in definition order.
 * 
 * @param config Typed configuration object
 * @param schema Configuration schema (defines sections and parameter order)
 * @param appVersion Application version for header (optional)
 * @returns Formatted CFG file content as string
 * 
 * @example
 * const config = { System: { nMachineType: 0, bShowDialog: true } };
 * const cfgContent = jsonToCfg(config, schema, '1.2.0');
 * // Returns: "# Previous Emulator Configuration\n# Version: 1.2.0\n..."
 */
export function jsonToCfg(config: ConfigObject, schema: ConfigSchema, appVersion?: string): string {
  const lines: string[] = [];

  // Format current date in human-readable format (German locale: DD.MM.YYYY HH:MM:SS)
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const dateString = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

  // Header comment with metadata
  lines.push('# Previous Emulator Configuration');
  lines.push(`# Generated by Previous Admin${appVersion ? ` v${appVersion}` : ''}`);
  lines.push(`# Created: ${dateString}`);
  lines.push('');

  // Iterate through sections in schema order
  for (const sectionSchema of Object.values(schema.sections)) {
    const sectionData = config[sectionSchema.name];

    if (!sectionData) {
      // Section not in config - skip
      continue;
    }

    // Section header
    lines.push(`[${sectionSchema.name}]`);

    // Parameters
    for (const paramSchema of sectionSchema.parameters) {
      const value = sectionData[paramSchema.name];
      
      if (value === undefined) {
        // Parameter not in config - use default
        lines.push(`${paramSchema.name} = ${convertTypeToString(paramSchema.default)}`);
      } else {
        lines.push(`${paramSchema.name} = ${convertTypeToString(value)}`);
      }
    }

    lines.push(''); // Empty line between sections
  }

  return lines.join('\n');
}

/**
 * Convert string value to typed value based on parameter type
 * 
 * @param value String value from CFG file
 * @param type Parameter type from schema
 * @returns Converted value with appropriate type
 */
function convertStringToType(
  value: string,
  type: string
): string | number | boolean {
  const trimmedValue = value.trim();

  switch (type) {
    case 'boolean':
      // Accept TRUE/FALSE, true/false, 1/0
      return (
        trimmedValue.toUpperCase() === 'TRUE' ||
        trimmedValue === '1' ||
        trimmedValue === 'true'
      );

    case 'number':
    case 'range':
      // Parse as integer or float
      return trimmedValue.includes('.') 
        ? parseFloat(trimmedValue) 
        : parseInt(trimmedValue, 10);

    case 'enum':
    case 'string':
    default:
      // Return as string
      return trimmedValue;
  }
}

/**
 * Convert typed value to string for CFG file
 * 
 * @param value Typed value
 * @returns String representation for CFG file
 */
function convertTypeToString(value: string | number | boolean): string {
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }
  
  return String(value);
}

/**
 * Parse CFG file to raw data structure
 * 
 * Re-export for convenience
 */
export function parseCfg(cfgContent: string): RawConfigData {
  return parseCfgFile(cfgContent);
}
