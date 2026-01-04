/**
 * Configuration value validator
 * 
 * Validates configuration values against schema definitions.
 * Provides type checking and range validation for all parameter types.
 * 
 * @module backend/config-schema/validator
 */

import type { ConfigSchema, ParameterType, ValidationResult } from '@shared/previous-config/schema-types';

/**
 * Validate a single configuration value against schema
 * 
 * Performs type checking and bounds validation based on parameter schema.
 * Returns detailed validation result with error message if validation fails.
 * 
 * @param sectionName Name of the section containing the parameter
 * @param parameterName Name of the parameter to validate
 * @param value Value to validate (can be any type)
 * @param schema Configuration schema
 * @returns Validation result with optional error message
 * 
 * @example
 * const result = validateConfigValue(
 *   'System',
 *   'nMachineType',
 *   '1',
 *   schema
 * );
 * 
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export function validateConfigValue(
  sectionName: string,
  parameterName: string,
  value: any,
  schema: ConfigSchema
): ValidationResult {
  // Find section
  const section = schema.sections[sectionName];
  if (!section) {
    return {
      valid: false,
      error: `Section not found: ${sectionName}`
    };
  }
  
  // Find parameter
  const parameter = section.parameters.find(p => p.name === parameterName);
  if (!parameter) {
    return {
      valid: false,
      error: `Parameter not found in section ${sectionName}: ${parameterName}`
    };
  }
  
  // Perform type-specific validation
  return validateParameterValue(value, parameter.type, {
    possibleValues: parameter.possibleValues,
    min: parameter.min,
    max: parameter.max
  });
}

/**
 * Validate parameter value based on type
 * 
 * @param value Value to validate
 * @param type Parameter type
 * @param constraints Type-specific constraints (range, enum values, etc.)
 * @returns Validation result
 */
function validateParameterValue(
  value: any,
  type: ParameterType,
  constraints: {
    possibleValues?: string[];
    min?: number;
    max?: number;
  }
): ValidationResult {
  switch (type) {
    case 'boolean':
      return validateBoolean(value);
    
    case 'number':
      return validateNumber(value, constraints.min, constraints.max);
    
    case 'range':
      return validateRange(value, constraints.min, constraints.max);
    
    case 'enum':
      return validateEnum(value, constraints.possibleValues);
    
    case 'string':
    default:
      return validateString();
  }
}

/**
 * Validate boolean value
 * 
 * Accepts: true, false, 'true', 'false', 'TRUE', 'FALSE', 1, 0
 */
function validateBoolean(value: any): ValidationResult {
  if (typeof value === 'boolean') {
    return { valid: true };
  }
  
  if (typeof value === 'string') {
    if (['true', 'false', 'TRUE', 'FALSE', '1', '0'].includes(value)) {
      return { valid: true };
    }
  }
  
  if (typeof value === 'number' && [0, 1].includes(value)) {
    return { valid: true };
  }
  
  return {
    valid: false,
    error: `Invalid boolean value: ${value}. Expected: true, false, TRUE, FALSE, 1, or 0`
  };
}

/**
 * Validate numeric value
 * 
 * Accepts any parseable number within optional min/max bounds
 */
function validateNumber(value: any, min?: number, max?: number): ValidationResult {
  // Try to parse as number
  const num = Number(value);
  
  if (Number.isNaN(num)) {
    return {
      valid: false,
      error: `Invalid number: ${value}. Expected a numeric value`
    };
  }
  
  // Check bounds if specified
  if (min !== undefined && num < min) {
    return {
      valid: false,
      error: `Number ${num} is below minimum: ${min}`
    };
  }
  
  if (max !== undefined && num > max) {
    return {
      valid: false,
      error: `Number ${num} is above maximum: ${max}`
    };
  }
  
  return { valid: true };
}

/**
 * Validate range value (same as number with bounds)
 */
function validateRange(value: any, min?: number, max?: number): ValidationResult {
  return validateNumber(value, min, max);
}

/**
 * Validate enum value
 * 
 * Value must be one of the defined possible values
 */
function validateEnum(value: any, possibleValues?: string[]): ValidationResult {
  if (!possibleValues || possibleValues.length === 0) {
    return {
      valid: false,
      error: 'Enum type has no possible values defined'
    };
  }
  
  const valueStr = String(value);
  
  if (possibleValues.includes(valueStr)) {
    return { valid: true };
  }
  
  return {
    valid: false,
    error: `Invalid enum value: ${value}. Allowed values: ${possibleValues.join(', ')}`
  };
}

/**
 * Validate string value
 * 
 * Any value is acceptable as string (will be converted to string)
 */
function validateString(): ValidationResult {
  // Strings accept any value
  return { valid: true };
}

/**
 * Validate entire configuration object against schema
 * 
 * Checks all parameters in a config object for validity.
 * Returns first validation error encountered, or valid if all pass.
 * 
 * @param config Configuration object with section/parameter structure
 * @param schema Configuration schema
 * @returns Validation result
 */
export function validateConfiguration(
  config: Record<string, Record<string, any>>,
  schema: ConfigSchema
): ValidationResult {
  for (const [sectionName, sectionData] of Object.entries(config)) {
    if (typeof sectionData !== 'object' || sectionData === null) {
      continue;
    }
    
    for (const [parameterName, value] of Object.entries(sectionData)) {
      const result = validateConfigValue(sectionName, parameterName, value, schema);
      
      if (!result.valid) {
        return result;
      }
    }
  }
  
  return { valid: true };
}
