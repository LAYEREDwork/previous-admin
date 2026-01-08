/**
 * Config Input Dispatcher Component
 * 
 * Main entry point for configuration parameter inputs.
 * Dispatches to type-specific input components based on schema.
 * 
 * @module frontend/components/controls/PAConfigInput
 */

import type { ParameterSchema } from '@shared/previous-config/schema-types';

import { PASize } from '@frontend/lib/types/sizes';

import { PABooleanInput } from './config-inputs/PABooleanInput';
import { PAEnumInput } from './config-inputs/PAEnumInput';
import { PANumberRangeInput } from './config-inputs/PANumberRangeInput';
import { PAStringInput } from './config-inputs/PAStringInput';

interface PAConfigInputProps {
  /** Parameter schema defining type and constraints */
  schema: ParameterSchema;
  
  /** Current value (type matches schema.type) */
  value: string | number | boolean;
  
  /** Callback when value changes */
  onChange: (value: string | number | boolean) => void;
  
  /** Whether input is disabled */
  disabled?: boolean;
  
  /** Input size (for applicable components) */
  size?: PASize;
}

/**
 * Dynamic configuration input dispatcher
 * 
 * Renders appropriate input component based on parameter type.
 * Handles type conversion and validation automatically.
 * 
 * @example
 * <PAConfigInput
 *   schema={paramSchema}
 *   value={currentValue}
 *   onChange={(val) => handleChange(paramSchema.name, val)}
 *   disabled={saving}
 *   size="md"
 * />
 */
export function PAConfigInput({
  schema,
  value,
  onChange,
  disabled,
  size = PASize.md,
}: PAConfigInputProps) {
  // Dispatch to type-specific component
  switch (schema.type) {
    case 'boolean':
      return (
        <PABooleanInput
          value={value as boolean}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'enum':
      return (
        <PAEnumInput
          schema={schema}
          value={String(value)}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'number':
    case 'range':
      return (
        <PANumberRangeInput
          schema={schema}
          value={Number(value)}
          onChange={onChange}
          disabled={disabled}
          size={size}
        />
      );

    case 'string':
    default:
      return (
        <PAStringInput
          value={String(value)}
          onChange={onChange}
          disabled={disabled}
          size={size}
        />
      );
  }
}
