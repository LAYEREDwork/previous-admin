import React, { ReactElement } from 'react';
import { PAButton } from './PAButton';
import { ButtonProps as RSuiteButtonProps } from 'rsuite';

interface PAIconButtonProps extends Omit<RSuiteButtonProps, 'size' | 'color' | 'children'> {
    icon: ReactElement;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    color?: 'blue' | 'red' | 'green' | 'orange' | 'cyan' | 'indigo' | 'accent';
    className?: string;
    circle?: boolean;
}

/**
 * PAIconButton - A premium icon button matching the PASegmentedControl aesthetic.
 * PA prefix for Previous Admin.
 */
export function PAIconButton({
    icon,
    size = 'md',
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
            className={`${sizeClasses[size]} ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}
            icon={icon}
        />
    );
}
