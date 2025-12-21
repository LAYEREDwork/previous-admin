import { ReactNode } from 'react';
import { Button } from 'rsuite';
import { PASize, PABasicSize } from '../../lib/types/sizes';

// Enums for surface and shape
export const PASkeuomorphButtonSurface = {
  flat: 'flat',
  rounded: 'rounded',
} as const;
export type PASkeuomorphButtonSurface = typeof PASkeuomorphButtonSurface[keyof typeof PASkeuomorphButtonSurface];

export const PASkeuomorphButtonShape = {
  pill: 'pill',
  rect: 'rect',
  round: 'round',
} as const;
export type PASkeuomorphButtonShape = typeof PASkeuomorphButtonShape[keyof typeof PASkeuomorphButtonShape];

export const PASkeuomorphButtonType = {
  button: 'button',
  reset: 'reset',
  submit: 'submit',
} as const;
export type PASkeuomorphButtonType = typeof PASkeuomorphButtonType[keyof typeof PASkeuomorphButtonType];

interface PASkeuomorphButtonProps {
  children?: ReactNode;
  icon?: ReactNode;
  size?: PABasicSize;
  active?: boolean;
  disabled?: boolean;
  color?: 'primary' | 'red' | 'green' | 'orange' | 'cyan';
  surface?: PASkeuomorphButtonSurface;
  shape?: PASkeuomorphButtonShape;
  containerBg?: 'light' | 'dark' | 'auto';
  fullWidth?: boolean;
  buttonType?: PASkeuomorphButtonType;
  onClick?: () => void;
  className?: string;
  title?: string;
}

/**
 * PASkeuomorphButton - A skeuomorphic button with a 3D, hardware-inspired look.
 * Inspired by Boss Pocket GT design - convex surface, recessed into housing.
 */
export function PASkeuomorphButton({
  children,
  icon,
  size = PASize.MD,
  active = false,
  disabled = false,
  color,
  surface = PASkeuomorphButtonSurface.flat,
  shape = PASkeuomorphButtonShape.rect,
  containerBg = 'auto',
  fullWidth = false,
  buttonType = PASkeuomorphButtonType.button,
  onClick,
  className = '',
  title,
}: PASkeuomorphButtonProps) {
  // Size configurations (without corner-radius, handled by shape)
  const sizeConfig = {
    xs: {
      padding: 'py-[3px] px-[2px]',
      inner: 'px-[0.6875rem] py-1',
      roundInner: 'p-1',
      text: 'text-[10px]',
      iconSize: 12,
    },
    sm: {
      padding: 'py-[3px] px-[2px]',
      inner: 'px-[0.9375rem] py-1.5',
      roundInner: 'p-1.5',
      text: 'text-xs',
      iconSize: 14,
    },
    md: {
      padding: 'py-[4px] px-[3px]',
      inner: 'px-[1.1875rem] py-2',
      roundInner: 'p-2',
      text: 'text-sm',
      iconSize: 18,
    },
    lg: {
      padding: 'py-[5px] px-[4px]',
      inner: 'px-[1.4375rem] py-2.5',
      roundInner: 'p-2.5',
      text: 'text-base',
      iconSize: 22,
    },
  };

  // Color configurations for ring and glow effects
  const colorConfig = {
    primary: {
      ring: 'rgba(6, 182, 212, 0.4)',
      glow: 'rgba(6, 182, 212, 0.8)',
      textClass: 'text-primary-400',
    },
    red: {
      ring: 'rgba(239, 68, 68, 0.4)',
      glow: 'rgba(239, 68, 68, 0.8)',
      textClass: 'text-red-400',
    },
    green: {
      ring: 'rgba(34, 197, 94, 0.4)',
      glow: 'rgba(34, 197, 94, 0.8)',
      textClass: 'text-green-400',
    },
    orange: {
      ring: 'rgba(249, 115, 22, 0.4)',
      glow: 'rgba(249, 115, 22, 0.8)',
      textClass: 'text-orange-400',
    },
    cyan: {
      ring: 'rgba(6, 182, 212, 0.4)',
      glow: 'rgba(6, 182, 212, 0.8)',
      textClass: 'text-cyan-400',
    },
  };

  const config = sizeConfig[size];

  // Default colors when no color is specified: transparent ring, white glow when active
  const defaultColors = {
    ring: 'transparent',
    glow: 'rgba(255, 255, 255, 0.8)',
    textClass: 'text-white',
  };

  // Submit type always uses primary colors
  const submitColors = {
    ring: 'rgba(6, 182, 212, 0.4)',
    glow: 'rgba(6, 182, 212, 0.8)',
    textClass: 'text-primary-400',
  };

  const colors = buttonType === PASkeuomorphButtonType.submit ? submitColors : (color ? colorConfig[color] : defaultColors);

  // Shape-specific corner radius
  const shapeRadius = {
    pill: 'rounded-full',
    rect: size === PASize.XS ? 'rounded-[7px]' : size === PASize.SM ? 'rounded-[8px]' : size === PASize.MD ? 'rounded-[10px]' : 'rounded-[12px]',
    round: 'rounded-full',
  }[shape];

  // Inner padding based on shape (round needs equal padding for square aspect)
  const innerPadding = shape === PASkeuomorphButtonShape.round ? config.roundInner : config.inner;

  // Surface-specific styling
  const getSurfaceStyle = () => {
    const baseBoxShadow = surface === PASkeuomorphButtonSurface.flat
      ? 'inset 0 0 0 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
      : 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 2px rgba(0,0,0,0.4), inset 0 0 4px rgba(0,0,0,0.3)';

    if (surface === PASkeuomorphButtonSurface.flat) {
      if (containerBg === 'light') {
        return {
          className: 'bg-gray-200',
          boxShadow: baseBoxShadow,
        };
      } else if (containerBg === 'dark') {
        return {
          className: 'bg-gray-600',
          boxShadow: baseBoxShadow,
        };
      } else { // auto
        return {
          className: 'bg-gray-200 dark:bg-gray-700',
          boxShadow: baseBoxShadow,
        };
      }
    } else {
      return {
        className: 'bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900',
        boxShadow: baseBoxShadow,
      };
    }
  };

  const surfaceStyle = getSurfaceStyle();

  // Content styling based on active state
  const contentStyle = active ? colors.textClass : 'text-gray-400';

  // Inner-shadow for engraved text effect (light from top)
  // Active: glow effect from inside
  const textShadowStyle = active
    ? { textShadow: `0 0 8px ${colors.glow}, 0 0 16px ${colors.glow}` }
    : { textShadow: '0 1px 0 rgba(255,255,255,0.1), 0 -1px 1px rgba(0,0,0,0.8)' };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      title={title}
      block={fullWidth}
      type={buttonType}
      className={`
        relative
        ${config.padding}
        ${shapeRadius}
        bg-next-bg
        transition-all duration-150
        inline-flex items-center gap-2 flex-nowrap
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
        ${className}
      `}
      style={{
        // Outer ring / housing gap effect + colored plastic ring
        boxShadow: `
          inset 0 2px 4px rgba(0,0,0,0.9),
          0 0 0 2px ${colors.ring},
          0 1px 0 rgba(255,255,255,0.03)
        `,
      }}
    >
      {/* Inner button surface */}
      <div
        className={`
          ${innerPadding}
          ${shapeRadius}
          ${surfaceStyle.className}
          ${shape === PASkeuomorphButtonShape.round ? 'aspect-square' : fullWidth ? 'w-full' : ''}
          flex items-center justify-center gap-2 flex-nowrap
          transition-all duration-150
        `}
        style={{
          boxShadow: surfaceStyle.boxShadow,
        }}
      >
        {/* Icon with conditional glow */}
        {icon && (
          <span
            className={`flex items-center justify-center transition-all duration-200 ${contentStyle}`}
            style={textShadowStyle}
          >
            {icon}
          </span>
        )}

        {/* Text with conditional glow (not shown for round shape) */}
        {shape !== PASkeuomorphButtonShape.round && children && (
          <span
            className={`font-medium ${config.text} transition-all duration-200 ${contentStyle} -translate-y-px whitespace-nowrap`}
            style={textShadowStyle}
          >
            {children}
          </span>
        )}
      </div>
    </Button>
  );
}
