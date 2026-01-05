/**
 * String Input Component
 * 
 * Text input for string configuration parameters.
 * Supports any string value without validation.
 * 
 * @module frontend/components/controls/config-inputs/PAStringInput
 */

import { Input } from 'rsuite';

import { PASize } from '../../../lib/types/sizes';

interface PAStringInputProps {
  /** Current string value */
  value: string;
  
  /** Callback when value changes */
  onChange: (value: string) => void;
  
  /** Whether input is disabled */
  disabled?: boolean;
  
  /** Input size */
  size?: PASize;
  
  /** Placeholder text */
  placeholder?: string;
}

/**
 * String input component
 * 
 * Simple text input for string values.
 * No validation applied.
 * 
 * @example
 * <PAStringInput
 *   value={config.sModelName}
 *   onChange={(val) => updateConfig('sModelName', val)}
 *   placeholder="Enter model name"
 *   size="md"
 * />
 */
export function PAStringInput({
  value,
  onChange,
  disabled,
  size = PASize.md,
  placeholder,
}: PAStringInputProps) {
  return (
    <Input
      value={value}
      onChange={onChange}
      disabled={disabled}
      size={size}
      placeholder={placeholder}
      className="w-full"
    />
  );
}
