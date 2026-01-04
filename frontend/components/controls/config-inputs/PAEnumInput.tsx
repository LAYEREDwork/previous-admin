/**
 * Enum Input Component
 * 
 * Dropdown selector for enum configuration parameters.
 * Supports custom labels for enum values.
 * 
 * @module frontend/components/controls/config-inputs/PAEnumInput
 */

import { SelectPicker } from 'rsuite';

import type { ParameterSchema } from '@shared/previous-config/schema-types';

interface PAEnumInputProps {
  /** Parameter schema with enum metadata */
  schema: ParameterSchema;
  
  /** Current enum value (as string) */
  value: string;
  
  /** Callback when value changes */
  onChange: (value: string) => void;
  
  /** Whether input is disabled */
  disabled?: boolean;
}

/**
 * Enum input using dropdown select
 * 
 * Creates dropdown with possible values from schema.
 * Uses labels if available, otherwise displays raw values.
 * 
 * @example
 * <PAEnumInput
 *   schema={parameterSchema}
 *   value={config.nMachineType}
 *   onChange={(val) => updateConfig('nMachineType', val)}
 * />
 */
export function PAEnumInput({ schema, value, onChange, disabled }: PAEnumInputProps) {
  if (!schema.possibleValues || schema.possibleValues.length === 0) {
    return <div className="text-gray-500">No options available</div>;
  }

  // Create data items for SelectPicker
  const data = schema.possibleValues.map((val, index) => ({
    label: schema.labels?.[index] || val,
    value: val,
  }));

  return (
    <SelectPicker
      data={data}
      value={value}
      onChange={(val) => {
        if (val !== null) {
          onChange(val);
        }
      }}
      disabled={disabled}
      cleanable={false}
      searchable={false}
      size="md"
      className="w-full"
    />
  );
}
