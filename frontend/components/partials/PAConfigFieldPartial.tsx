/**
 * Config Field Partial Component
 * 
 * Renders a single configuration parameter with label,
 * input control, and description.
 * 
 * @module frontend/components/partials/PAConfigFieldPartial
 */

import { Form } from 'rsuite';

import type { ParameterSchema } from '@shared/previous-config/schema-types';

import { PAConfigInput } from '../controls/PAConfigInput';

interface PAConfigFieldPartialProps {
  /** Parameter schema */
  schema: ParameterSchema;
  
  /** Current value */
  value: string | number | boolean;
  
  /** Callback when value changes */
  onChange: (value: string | number | boolean) => void;
  
  /** Whether field is disabled */
  disabled?: boolean;
  
  /** Validation error message (if any) */
  errorMessage?: string;
}

/**
 * Configuration field component
 * 
 * Renders label, input control, and description for a single parameter.
 * Uses schema metadata for display text and validation.
 * 
 * @example
 * <PAConfigFieldPartial
 *   schema={parameterSchema}
 *   value={currentValue}
 *   onChange={(val) => updateField(parameterSchema.name, val)}
 *   disabled={saving}
 *   errorMessage={validationError}
 * />
 */
export function PAConfigFieldPartial({
  schema,
  value,
  onChange,
  disabled,
  errorMessage,
}: PAConfigFieldPartialProps) {
  // Use displayName from schema, fallback to parameter name
  const label = schema.displayName || schema.name;
  
  return (
    <Form.Group>
      <Form.ControlLabel>
        {label}
        {schema.required && <span className="text-red-500 ml-1">*</span>}
      </Form.ControlLabel>
      
      <Form.Control
        name={schema.name}
        accepter={() => (
          <PAConfigInput
            schema={schema}
            value={value}
            onChange={onChange}
            disabled={disabled}
            size="md"
          />
        )}
        errorMessage={errorMessage}
      />
      
      {/* Description text below input */}
      {schema.description && (
        <Form.HelpText className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {schema.description}
        </Form.HelpText>
      )}
      
      {/* Display current bounds for number/range types */}
      {(schema.type === 'number' || schema.type === 'range') && (
        schema.min !== undefined && schema.max !== undefined
      ) && (
        <Form.HelpText className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
          Gültiger Bereich: {schema.min} – {schema.max}
        </Form.HelpText>
      )}
      
      {/* Display possible values for enum types */}
      {schema.type === 'enum' && schema.possibleValues && (
        <Form.HelpText className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
          Mögliche Werte: {schema.possibleValues.join(', ')}
        </Form.HelpText>
      )}
    </Form.Group>
  );
}
