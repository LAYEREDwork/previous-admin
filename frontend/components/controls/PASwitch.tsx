import { forwardRef } from 'react';
import { Toggle } from 'rsuite';
import { PASize } from '../../lib/types/sizes';

export interface PASwitchProps {
    size?: PASize;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

/**
 * PASwitch - RSuite Toggle with consistent sizing
 */
export const PASwitch = forwardRef<HTMLLabelElement, PASwitchProps>(
    ({ size = PASize.md, checked = false, onChange, disabled = false, className = '', ...rest }, ref) => {
        // Map PASize to RSuite size
        const rsuiteSize = size === PASize.xs ? 'sm' : size === PASize.sm ? 'sm' : size === PASize.lg ? 'lg' : 'md';

        return (
            <Toggle
                ref={ref}
                size={rsuiteSize}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className={className}
                {...rest}
            />
        );
    }
);

PASwitch.displayName = 'PASwitch';