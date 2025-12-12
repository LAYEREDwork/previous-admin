import { ReactNode } from 'react';
import { ButtonGroup, Button, IconButton } from 'rsuite';

interface SegmentOption<T extends string> {
  value: T;
  label?: string;
  icon?: ReactNode;
}

interface AnimatedSegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  fullWidth?: boolean;
}

export function AnimatedSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'sm',
  iconOnly = false,
  fullWidth = false,
}: AnimatedSegmentedControlProps<T>) {
  return (
    <ButtonGroup justified={fullWidth} className={fullWidth ? 'w-full flex' : ''}>
      {options.map((option) => {
        const isActive = value === option.value;

        if (iconOnly && option.icon) {
          return (
            <IconButton
              key={option.value}
              icon={option.icon}
              onClick={() => onChange(option.value)}
              appearance={isActive ? 'primary' : 'default'}
              size={size}
              title={option.label}
              className={`transition-all duration-200 ease-in-out ${fullWidth ? 'flex-1' : ''}`}
              style={{
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          );
        }

        return (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            appearance={isActive ? 'primary' : 'default'}
            size={size}
            className={`transition-all duration-200 ease-in-out ${fullWidth ? 'flex-1' : ''}`}
            style={{
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {option.icon && <span className="inline-flex mr-2">{option.icon}</span>}
            {option.label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}
