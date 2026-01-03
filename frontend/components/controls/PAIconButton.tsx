import { ReactElement } from 'react';
import { ButtonProps as RSuiteButtonProps } from 'rsuite';

import { PASize } from '../../lib/types/sizes';

import { PAButton } from './PAButton';

interface PAIconButtonProps extends Omit<RSuiteButtonProps, 'size' | 'color' | 'children'> {
    icon: ReactElement;
    size?: PASize;
    className?: string;
    circle?: boolean;
}

/**
 * PAIconButton - A premium icon button matching the PASegmentedControl aesthetic.
 * PA prefix for Previous Admin.
 */
export function PAIconButton({
    icon,
    size = PASize.md,
    className = '',
    circle = false,
    ...props
}: PAIconButtonProps) {

    // Adjusted padding for icon-only buttons to make them square/circle
    const sizeClasses = {
        xs: 'w-7 px-0',
        sm: 'w-[34px] px-0',
        md: 'w-10 px-0',
        lg: 'w-[46px] px-0',
    };

    return (
        <PAButton
            {...props}
            size={size}
            className={`${sizeClasses[size as keyof typeof sizeClasses]} ${circle ? 'rounded-full' : 'rounded-md'} ${className}`}
            icon={icon}
        />
    );
}
