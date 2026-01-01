import { ReactNode, forwardRef } from 'react';
import { Button, ButtonProps } from 'rsuite';
import { PASize } from '../../lib/types/sizes';

/* eslint-disable @typescript-eslint/no-unused-vars */

export interface PAButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'size'> {
    size?: PASize;
    appearance?: 'primary' | 'default' | 'ghost' | 'link' | 'subtle';
    color?: ButtonProps['color'];
    loading?: boolean;
    block?: boolean;
    as?: React.ElementType;
    icon?: ReactNode;
    fullWidth?: boolean;
}

/**
 * PAButton - RSuite Button with consistent sizing
 */
export const PAButton = forwardRef<HTMLButtonElement, PAButtonProps>(
    ({ size = PASize.md, appearance = 'default', color, loading = false, block = false, as, icon, children, fullWidth = false, disabled = false, className = '', ...rest }, ref) => {
        // Map PASize to RSuite size
        const rsuiteSize = size === PASize.xs ? 'xs' : size === PASize.sm ? 'sm' : size === PASize.lg ? 'lg' : 'md';

        // Map appearance to RSuite appearance
        const rsuiteAppearance = appearance === 'primary' ? 'primary' : appearance === 'ghost' ? 'ghost' : appearance === 'link' ? 'link' : 'default';

        return (
            <Button
                ref={ref}
                size={rsuiteSize}
                appearance={rsuiteAppearance}
                color={color}
                loading={loading}
                block={block || fullWidth}
                disabled={disabled}
                className={className}
                {...rest}
            >
                {icon && <span className={`${children ? 'mr-2' : ''} inline-flex items-center justify-center`}>{icon}</span>}
                {children}
            </Button>
        );
    }
);

PAButton.displayName = 'PAButton';
