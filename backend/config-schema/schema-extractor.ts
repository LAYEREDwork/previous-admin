/**
 * Schema extraction from raw CFG data
 * 
 * Takes raw CFG data (from parser) and interprets types from comments.
 * Converts untyped RawConfigData into strongly typed ParameterSchema.
 * 
 * This is the second step in the two-step parsing process:
 * 1. ConfigParser: Type-agnostic extraction (raw values + comments)
 * 2. SchemaExtractor: Type interpretation (assigns types based on comments)
 * 
 * @module backend/config-schema/schema-extractor
 */

import type { 
  ParameterType, 
  ParameterSchema, 
  SectionSchema, 
  ConfigSchema 
} from '../../shared/previous-config/schema-types';

import type { RawConfigData, RawConfigParameter } from './config-parser';

/**
 * Convert CamelCase to display name with spaces
 * 
 * @param camelCaseName Input (e.g., "ConfigDialog")
 * @returns Display name (e.g., "Config Dialog")
 * 
 * @example
 * toDisplayName("ConfigDialog") // "Config Dialog"
 * toDisplayName("SystemSettings") // "System Settings"
 */
export function toDisplayName(camelCaseName: string): string {
  return camelCaseName.replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Parse type from comment
 * 
 * Looks for "# Type: X" pattern in comments
 * 
 * @param comments Array of comment lines
 * @returns Determined parameter type
 */
function parseTypeFromComments(comments: string[]): ParameterType {
  for (const comment of comments) {
    const typeMatch = comment.match(/Type:\s*(\w+)/i);
    if (typeMatch) {
      const typeStr = typeMatch[1].toLowerCase();
      
      if (typeStr === 'bool' || typeStr === 'boolean') return 'boolean';
      if (typeStr === 'int' || typeStr === 'integer') return 'number';
      if (typeStr === 'float' || typeStr === 'double') return 'number';
      if (typeStr === 'key') return 'number';
      if (typeStr === 'string') return 'string';
    }
  }
  
  return 'string'; // Default type
}

/**
 * Parse possible values from comments
 * 
 * Looks for "# Possible Values: A, B, C" or "# Possible Values: X-Y"
 * 
 * @param comments Array of comment lines
 * @returns Tuple of [values, labels, type] or [undefined, undefined, type]
 */
function parsePossibleValuesFromComments(
  comments: string[]
): [string[] | undefined, string[] | undefined, ParameterType | undefined] {
  for (const comment of comments) {
    const valuesMatch = comment.match(/Possible Values:\s*(.+?)(?:\n|$)/i);
    if (valuesMatch) {
      const valuesStr = valuesMatch[1].trim();
      
      // Check if it's a range (X-Y)
      const rangeMatch = valuesStr.match(/^(\d+)\s*-\s*(\d+)$/);
      if (rangeMatch) {
        // Range detected, types will be assigned during schema extraction
        return [undefined, undefined, 'range'];
      }
      
      // Parse comma-separated values
      const values = valuesStr.split(',').map(v => v.trim()).filter(v => v);
      
      if (values.length > 0) {
        // Extract labels if format is "VALUE=Label"
        const labels: string[] = [];
        const cleanValues: string[] = [];
        
        for (const val of values) {
          if (val.includes('=')) {
            const [cleanVal, label] = val.split('=').map(s => s.trim());
            cleanValues.push(cleanVal);
            labels.push(label);
          } else {
            cleanValues.push(val);
            labels.push(val);
          }
        }
        
        return [cleanValues, labels, 'enum'];
      }
    }
  }
  
  return [undefined, undefined, undefined];
}

/**
 * Parse default value from comments
 * 
 * Looks for "# Default: value" pattern
 * 
 * @param comments Array of comment lines
 * @returns Default value as string or null if not found
 */
function parseDefaultFromComments(comments: string[]): string | null {
  for (const comment of comments) {
    const defaultMatch = comment.match(/Default:\s*(.+?)(?:\n|$)/i);
    if (defaultMatch) {
      return defaultMatch[1].trim();
    }
  }
  return null;
}

/**
 * Parse description from comments
 * 
 * Looks for "# Meaning: ..." pattern
 * 
 * @param comments Array of comment lines
 * @returns Description string or empty string
 */
function parseDescriptionFromComments(comments: string[]): string {
  for (const comment of comments) {
    const meaningMatch = comment.match(/Meaning:\s*(.+?)(?:\n|$)/i);
    if (meaningMatch) {
      return meaningMatch[1].trim();
    }
  }
  return '';
}

/**
 * Convert raw parameter to typed parameter schema
 * 
 * @param rawParam Raw parameter from parser
 * @returns Typed parameter schema
 */
function extractParameterSchema(rawParam: RawConfigParameter): ParameterSchema {
  const baseType = parseTypeFromComments(rawParam.comments);
  const [possibleValues, labels, enumOrRangeType] = parsePossibleValuesFromComments(
    rawParam.comments
  );
  
  // Determine final type (enum/range take precedence)
  const finalType: ParameterType = enumOrRangeType || baseType;
  
  // Parse default value
  const defaultStr = parseDefaultFromComments(rawParam.comments) || rawParam.value;
  const defaultValue = convertStringToType(defaultStr, finalType);
  
  // Extract min/max for range types
  let min: number | undefined;
  let max: number | undefined;
  
  if (finalType === 'range') {
    for (const comment of rawParam.comments) {
      const rangeMatch = comment.match(/Possible Values:\s*(\d+)\s*-\s*(\d+)/i);
      if (rangeMatch) {
        min = parseInt(rangeMatch[1]);
        max = parseInt(rangeMatch[2]);
      }
    }
  }
  
  return {
    name: rawParam.name,
    type: finalType,
    default: defaultValue,
    description: parseDescriptionFromComments(rawParam.comments),
    translationKey: `configEditor.parameters.${rawParam.name}`,
    possibleValues,
    labels,
    min,
    max
  };
}

/**
 * Convert string value to appropriate type
 * 
 * @param value String value
 * @param type Target type
 * @returns Converted value
 */
function convertStringToType(value: string, type: ParameterType): string | number | boolean {
  if (type === 'boolean') {
    return value.toUpperCase() === 'TRUE';
  }
  if (type === 'number' || type === 'range') {
    return parseInt(value) || 0;
  }
  return value;
}

/**
 * Extract schema from raw config data
 * 
 * Interprets types from comments and creates typed schema.
 * Maps section names to display names and assigns SF symbols.
 * 
 * @param rawConfig Parsed raw config data (from ConfigParser)
 * @param symbolMapping Optional section name to SF symbol mapping
 * @returns Strongly typed config schema
 */
export function extractSchema(
  rawConfig: RawConfigData,
  symbolMapping: Record<string, string> = {}
): ConfigSchema {
  const sections: Record<string, SectionSchema> = {};
  
  for (const rawSection of rawConfig.sections) {
    const sectionName = rawSection.name;
    const parameters = rawSection.parameters.map(extractParameterSchema);
    
    sections[sectionName] = {
      name: sectionName,
      displayName: toDisplayName(sectionName),
      translationKey: `configEditor.sections.${sectionName}`,
      sfSymbol: symbolMapping[sectionName] || 'gearshape.fill',
      parameters
    };
  }
  
  return { sections };
}
