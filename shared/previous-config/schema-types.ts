/**
 * Schema type definitions for config editor
 * 
 * Shared types used by both backend (schema generation) and frontend (UI rendering).
 * Provides type-safe access to configuration schema structure.
 * 
 * @module shared/previous-config/schema-types
 */

/**
 * Supported parameter types in the configuration schema
 */
export type ParameterType = 'string' | 'number' | 'boolean' | 'enum' | 'range';

/**
 * Single parameter schema definition
 * 
 * Contains all metadata needed to render an input control for a configuration parameter.
 * Type information determines which UI component is rendered.
 */
export interface ParameterSchema {
  /** Unique parameter name within section (e.g., "bShowConfigDialogAtStartup") */
  name: string;
  
  /** Parameter type determines UI component and validation */
  type: ParameterType;
  
  /** Default value (already converted to correct type) */
  default: string | number | boolean;
  
  /** Human-readable description (from config file "Meaning" comment) */
  description: string;
  
  /** Display name formatted for UI (e.g., "Show Config Dialog At Startup") */
  displayName?: string;
  
  /** Translation key for multi-language support (e.g., "configEditor.parameters.bShowConfigDialogAtStartup") */
  translationKey?: string;
  
  /** Whether this parameter is required (cannot be empty) */
  required?: boolean;
  
  /** Possible values for enum types (when type === 'enum') */
  possibleValues?: string[];
  
  /** User-facing labels for enum values (parallel to possibleValues) */
  labels?: string[];
  
  /** Minimum value for numeric types (when type === 'number' or 'range') */
  min?: number;
  
  /** Maximum value for numeric types (when type === 'number' or 'range') */
  max?: number;
}

/**
 * Section schema definition
 * 
 * Represents a logical grouping of related configuration parameters.
 * Displayed as a collapsible section in the UI with a section header.
 */
export interface SectionSchema {
  /** Unique section name from config file (e.g., "ConfigDialog") */
  name: string;
  
  /** Display name formatted for UI (e.g., "Config Dialog") */
  displayName: string;
  
  /** Description of what this section contains */
  description?: string;
  
  /** Translation key for section header (e.g., "configEditor.sections.ConfigDialog") */
  translationKey?: string;
  
  /** SF Symbol name for section icon (Apple SF Symbols format, e.g., "gearshape.fill") */
  sfSymbol?: string;
  
  /** All parameters contained in this section */
  parameters: ParameterSchema[];
}

/**
 * Complete configuration schema
 * 
 * Top-level container for the entire configuration structure.
 * Generated from reference config file (default_for_admin.cfg).
 * Used by both backend (type validation) and frontend (UI generation).
 */
export interface ConfigSchema {
  /** All sections as object keyed by section name */
  sections: Record<string, SectionSchema>;
}

/**
 * Validation result from schema validation
 */
export interface ValidationResult {
  /** Whether the value is valid */
  valid: boolean;
  
  /** Error message if validation failed */
  error?: string;
}
