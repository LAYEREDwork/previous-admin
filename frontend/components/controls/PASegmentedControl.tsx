import React, { ReactNode } from 'react';
import { ButtonGroup, Button } from 'rsuite';

import { PASize } from '../../lib/types/sizes';

interface SegmentOption<T extends string> {
  value: T;
  label?: string;
  icon?: React.ComponentType<any> | ReactNode;
}

interface PASegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size: PASize;
  iconOnly?: boolean;
  fullWidth?: boolean;
  justified?: boolean;
  className?: string;
}

/**
 * PASegmentedControl - RSuite ButtonGroup with segmented appearance
 */
export function PASegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = PASize.sm,
  iconOnly = false,
  fullWidth = false,
  justified = false,
  className = '',
}: PASegmentedControlProps<T>) {
  // Map PASize to RSuite size
  const rsuiteSize = size === PASize.xl ? PASize.lg : size;

  // Precise height mapping
  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
  };

  return (
    <ButtonGroup
      className={className}
      style={fullWidth ? { width: '100%' } : undefined}
      justified={justified}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        // Handle different icon formats safely
        const renderIcon = () => {
          if (!option.icon) return null;

          if (React.isValidElement(option.icon)) {
            return option.icon;
          }

          if (typeof option.icon === 'function') {
            const IconComponent = option.icon as React.ComponentType<any>;
            return <IconComponent size={iconSizes[size]} />;
          }

          return option.icon;
        };

        return (
          <Button
            key={option.value}
            size={rsuiteSize}
            appearance={isActive ? 'primary' : 'default'}
            onClick={() => onChange(option.value)}
            style={fullWidth ? { flex: 1 } : undefined}
          >
            {option.icon && renderIcon()}
            {!iconOnly && option.label && (
              <span className="ml-1">{option.label}</span>
            )}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}
