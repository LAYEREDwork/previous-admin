/**
 * Editor Dropdown Partial Component
 * 
 * Custom select dropdown for configuration parameters.
 * Supports configurable sizing to match other input controls.
 * 
 * @module frontend/components/partials/config-editor/PAEditorDropdownPartial
 */

import { PASize } from '../../../lib/types/sizes';

interface PAEditorDropdownPartialProps {
  /** Current selected value */
  value: string;
  
  /** Array of possible values */
  possibleValues: string[];
  
  /** Optional labels for each value (fallback to raw value if not provided) */
  labels?: string[];
  
  /** Callback when value changes */
  onChange: (value: string) => void;
  
  /** Size of the dropdown to match other inputs */
  size?: PASize;
  
  /** Whether dropdown is disabled */
  disabled?: boolean;
}

/**
 * Get height and padding based on size
 */
const getSizeStyles = (size: PASize = PASize.md) => {
  const sizeMap = {
    [PASize.xs]: {
      height: '28px',
      padding: '4px 8px',
      fontSize: '10px',
      lineHeight: '20px',
    },
    [PASize.sm]: {
      height: '34px',
      padding: '5px 10px',
      fontSize: '12px',
      lineHeight: '24px',
    },
    [PASize.md]: {
      height: '40px',
      padding: '6px 12px',
      fontSize: '14px',
      lineHeight: '28px',
    },
    [PASize.lg]: {
      height: '46px',
      padding: '8px 14px',
      fontSize: '15px',
      lineHeight: '30px',
    },
    [PASize.xl]: {
      height: '50px',
      padding: '10px 16px',
      fontSize: '16px',
      lineHeight: '30px',
    },
  };

  return sizeMap[size];
};

/**
 * Editor Dropdown - Native select element with consistent sizing
 * 
 * @example
 * <PAEditorDropdownPartial
 *   value={config.nMachineType}
 *   possibleValues={['0', '1', '2']}
 *   labels={['CUBE', 'STATION', 'SLAB']}
 *   onChange={(val) => updateConfig('nMachineType', val)}
 *   size={PASize.md}
 * />
 */
export function PAEditorDropdownPartial({
  value,
  possibleValues,
  labels,
  onChange,
  size = PASize.md,
  disabled = false,
}: PAEditorDropdownPartialProps) {
  const sizeStyles = getSizeStyles(size);

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      style={{
        width: '100%',
        height: sizeStyles.height,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        lineHeight: sizeStyles.lineHeight,
        borderRadius: '4px',
        border: '1px solid var(--rs-border-primary)',
        backgroundColor: 'var(--rs-bg-input)',
        color: disabled ? 'var(--rs-text-disabled)' : 'var(--rs-text-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontFamily: 'inherit',
        transition: 'border-color 0.2s, background-color 0.2s',
      }}
    >
      <option value="">Select...</option>
      {possibleValues.map((val, idx) => (
        <option key={val} value={val}>
          {labels?.[idx] || val}
        </option>
      ))}
    </select>
  );
}
