import { ReactNode } from 'react';
import { Button as RSuiteButton, ButtonProps as RSuiteButtonProps } from 'rsuite';

interface PAButtonProps extends Omit<RSuiteButtonProps, 'size' | 'color'> {
    children?: ReactNode;
    icon?: ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    color?: 'blue' | 'red' | 'green' | 'orange' | 'cyan' | 'indigo' | 'accent';
    fullWidth?: boolean;
}

/**
 * PAButton - A premium button matching the PASegmentedControl aesthetic.
 * PA prefix for Previous Admin.
 */
export function PAButton({
    children,
    icon,
    size = 'md',
    appearance = 'default',
    color: customColor,
    className = '',
    fullWidth = false,
    block, // RSuite uses block for full width
    ...props
}: PAButtonProps) {

    const isFullWidth = fullWidth || block;

    // Height mapping (matching PASegmentedControl)
    const containerHeights = {
        xs: 'h-7',      // 28px
        sm: 'h-[34px]', // 34px
        md: 'h-10',     // 40px
        lg: 'h-[46px]', // 46px
    };

    const fontSizes = {
        xs: 'text-[10px]',
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    // Appearance & Color Logic
    const getAppearanceClasses = () => {
        if (appearance === 'primary') {
            switch (customColor) {
                case 'red': return 'bg-red-500 hover:bg-red-600 text-white shadow-sm';
                case 'green': return 'bg-green-600 hover:bg-green-700 text-white shadow-sm';
                case 'orange': return 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm';
                case 'accent': return 'bg-next-accent hover:opacity-90 text-white shadow-sm';
                case 'cyan': return 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm';
                default: return 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm';
            }
        }

        if (appearance === 'subtle') {
            return 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400';
        }

        if (appearance === 'ghost') {
            return 'bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300';
        }

        // Default (matches PASegmentedControl active item background or track)
        return 'bg-gray-200/50 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-transparent';
    };

    const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-semibold select-none 
    transition-all duration-200 
    ${containerHeights[size as keyof typeof containerHeights] || containerHeights.md} 
    ${fontSizes[size as keyof typeof fontSizes] || fontSizes.md} 
    ${isFullWidth ? 'w-full' : 'px-4'} 
    ${getAppearanceClasses()}
    ${props.disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
  `;

    const radiusClass = className.includes('rounded-') ? '' : 'rounded-full';

    return (
        <RSuiteButton
            className={`${baseClasses} ${radiusClass} ${className}`}
            {...props}
        >
            {icon && <span className="flex items-center justify-center">{icon}</span>}
            {children}
        </RSuiteButton>
    );
}
