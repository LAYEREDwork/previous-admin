/**
 * Number/Range Input Component
 * 
 * Number input with optional min/max constraints.
 * Supports both integer and float values.
 * 
 * @module frontend/components/controls/config-inputs/PANumberRangeInput
 */

import { InputNumber } from 'rsuite';

import type { ParameterSchema } from '@shared/previous-config/schema-types';

import { PASize } from '../../../lib/types/sizes';

interface PANumberRangeInputProps {
  /** Parameter schema with range metadata */
  schema: ParameterSchema;
  
  /** Current numeric value */
  value: number;
  
  /** Callback when value changes */
  onChange: (value: number) => void;
  
  /** Whether input is disabled */
  disabled?: boolean;
  
  /** Input size */
  size?: PASize;
}

/**
 * Number input with range validation
 * 
 * Creates input with min/max constraints from schema.
 * Automatically validates bounds on change.
 * 
 * @example
 * <PANumberRangeInput
 *   schema={parameterSchema}
 *   value={config.nMemorySize}
 *   onChange={(val) => updateConfig('nMemorySize', val)}
 *   size="md"
 * />
 */
export function PANumberRangeInput({
  schema,
  value,
  onChange,
  disabled,
  size = PASize.md,
}: PANumberRangeInputProps) {
  // Map PASize to RSuite-compatible size (InputNumber doesn't support 'xl')
  const rsuiteSize = size === PASize.xl ? PASize.lg : size;

  // Use default value if value is null or undefined
  const displayValue = value ?? (typeof schema.default === 'number' ? schema.default : 0);

  const handleChange = (val: string | number | null) => {
    if (val === null || val === '') {
      // Use default if value is cleared
      onChange(typeof schema.default === 'number' ? schema.default : 0);
      return;
    }

    const numValue = typeof val === 'string' ? parseFloat(val) : val;
    
    // Validate bounds
    if (schema.min !== undefined && numValue < schema.min) {
      onChange(schema.min);
      return;
    }
    
    if (schema.max !== undefined && numValue > schema.max) {
      onChange(schema.max);
      return;
    }

    onChange(numValue);
  };

  return (
    <InputNumber
      value={displayValue}
      onChange={handleChange}
      disabled={disabled}
      size={rsuiteSize}
      min={schema.min}
      max={schema.max}
      step={1}
      className="w-full"
    />
  );
}
