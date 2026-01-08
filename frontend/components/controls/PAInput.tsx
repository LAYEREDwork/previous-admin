import { forwardRef } from 'react';
import { Input } from 'rsuite';

import { PASize } from '@frontend/lib/types/sizes';

export interface PAInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
    size?: PASize;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * PAInput - RSuite Input with consistent sizing
 */
export const PAInput = forwardRef<HTMLInputElement, PAInputProps>(
    ({ size = PASize.md, className = '', onChange, ...rest }, ref) => {
        // Map PASize to RSuite size
        const rsuiteSize = size === PASize.xl ? PASize.lg : size;

        // Handle onChange compatibility
        const handleChange = (_value: string, event: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(event);
            }
        };

        return (
            <Input
                ref={ref}
                size={rsuiteSize}
                className={className}
                onChange={handleChange}
                {...rest}
            />
        );
    }
);

PAInput.displayName = 'PAInput';
