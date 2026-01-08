/**
 * Boolean Input Component
 * 
 * Toggle control for boolean configuration parameters.
 * Uses Rsuite Toggle component with consistent styling.
 * 
 * @module frontend/components/controls/config-inputs/PABooleanInput
 */

import { Toggle } from 'rsuite';

import { PASize } from '@frontend/lib/types/sizes';

interface PABooleanInputProps {
  /** Current boolean value */
  value: boolean;
  
  /** Callback when value changes */
  onChange: (value: boolean) => void;
  
  /** Whether input is disabled */
  disabled?: boolean;
}

/**
 * Boolean input using toggle switch
 * 
 * @example
 * <PABooleanInput
 *   value={config.bShowDialog}
 *   onChange={(val) => updateConfig('bShowDialog', val)}
 *   disabled={saving}
 * />
 */
export function PABooleanInput({ value, onChange, disabled }: PABooleanInputProps) {
  return (
    <Toggle
      checked={value}
      onChange={(newValue) => onChange(newValue)}
      disabled={disabled}
      size={PASize.md}
    />
  );
}
