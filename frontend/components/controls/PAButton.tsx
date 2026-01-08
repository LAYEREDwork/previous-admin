import { ReactNode, forwardRef } from 'react';
import { Button, ButtonProps } from 'rsuite';

import { PAButtonType } from '@frontend/lib/types/button';
import { PASize } from '@frontend/lib/types/sizes';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Maps PAButtonType to RSuite appearance
 */
function getButtonAppearance(type?: PAButtonType): 'primary' | 'default' | 'ghost' | 'link' | 'subtle' {
    switch (type) {
        case PAButtonType.primary:
            return 'primary';
        case PAButtonType.ghost:
            return 'ghost';
        case PAButtonType.link:
            return 'link';
        case PAButtonType.subtle:
            return 'subtle';
        case PAButtonType.default:
        case PAButtonType.destructive:
        case PAButtonType.cancel:
        default:
            return 'default';
    }
}

/**
 * Maps PAButtonType to RSuite color
 */
function getButtonColor(buttonType?: PAButtonType): ButtonProps['color'] {
    switch (buttonType) {
        case PAButtonType.destructive:
            return 'red';
        case PAButtonType.primary:
        case PAButtonType.default:
        case PAButtonType.cancel:
        case PAButtonType.ghost:
        case PAButtonType.link:
        case PAButtonType.subtle:
        default:
            return undefined;
    }
}

export interface PAButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'size' | 'type'> {
    size?: PASize;
    buttonType?: PAButtonType;
    appearance?: 'primary' | 'default' | 'ghost' | 'link' | 'subtle';
    color?: ButtonProps['color'];
    loading?: boolean;
    block?: boolean;
    as?: React.ElementType;
    icon?: ReactNode;
    fullWidth?: boolean;
    // Omit RSuite onToggle to avoid React 19 compatibility issues
    onToggle?: never;
}

/**
 * PAButton - RSuite Button with consistent sizing and type-based styling
 */
export const PAButton = forwardRef<HTMLButtonElement, PAButtonProps>(
    ({ size = PASize.md, buttonType, appearance = 'default', color, loading = false, block = false, as, icon, children, fullWidth = false, disabled = false, className = '', ...rest }, ref) => {
        // Map PASize to RSuite size
        const rsuiteSize = size === PASize.xl ? PASize.lg : size;

        // Use buttonType-based styling if buttonType is provided, otherwise use appearance/color props
        const rsuiteAppearance = buttonType ? getButtonAppearance(buttonType) : (appearance === 'primary' ? 'primary' : appearance === 'ghost' ? 'ghost' : appearance === 'link' ? 'link' : 'default');
        const rsuiteColor = buttonType ? getButtonColor(buttonType) : color;

        return (
            <Button
                ref={ref}
                size={rsuiteSize}
                appearance={rsuiteAppearance}
                color={rsuiteColor}
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
