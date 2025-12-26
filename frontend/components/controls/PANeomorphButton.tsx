import React, { ReactNode } from 'react';
import { PASize } from '../../lib/types/sizes';
import { PATexture } from '../../lib/utils/color';
import { PANeomorphPalette, computePalette} from '../../lib/utils/palette';
import { containerHeightsPixel, PANeomorphControlShape } from '../../lib/utils/styling';

export const PANeomorphButtonType = {
  button: 'button',
  reset: 'reset',
  submit: 'submit',
} as const;
export type PANeomorphButtonType = typeof PANeomorphButtonType[keyof typeof PANeomorphButtonType];

export interface CornerRadiusOverrides {
  topLeft?: number;
  topRight?: number;
  bottomLeft?: number;
  bottomRight?: number;
}

interface PANeomorphButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'> {
  // Content
  children?: ReactNode;
  icon?: ReactNode;

  // Sizing
  size: PASize;
  shape?: PANeomorphControlShape;
  fullWidth?: boolean;
  frameWidth?: number;
  ringWidth?: number;
  buttonBorderWidth?: number;

  // State
  active?: boolean;

  // Behavior
  type?: PANeomorphButtonType;

  // Styling
  color?: string; // Color for ring and active glow
  baseColor?: string; // Optional base background color to derive palette from

  // Corner radius overrides (for dropdown integration)
  cornerRadiusOverrides?: CornerRadiusOverrides;
}

/**
 * PASkeuomorphButton - A skeuomorphic button with a high-quality, industrial, dark-UI aesthetic.
 * It is seated in a recessed housing and appears embossed, with a matte, textured finish.
 */
export const PANeomorphButton = React.forwardRef<HTMLButtonElement, PANeomorphButtonProps>(
  (
    {
      // Content
      children,
      icon,

      // Sizing
      size = PASize.md,
      shape = PANeomorphControlShape.rect,
      fullWidth = false,
      frameWidth = 2,
      ringWidth = 1,
      buttonBorderWidth = 2,

      // State
      active = false,
      disabled = false,

      // Behavior
      type = PANeomorphButtonType.button,

      // Styling
      className = '',
      color,
      baseColor,
      cornerRadiusOverrides,
      ...rest
    },
    ref
  ) => {
    const palette = computePalette(baseColor || PANeomorphPalette.baseColor);
    
    const buttonHeight = containerHeightsPixel[size]; // Calculate button height based on size
    const cornerRadius = shape === PANeomorphControlShape.rect ? buttonHeight / 4 : buttonHeight;
    const frameCornerRadius = cornerRadius;
    const ringCornerRadius = Math.max(frameCornerRadius - frameWidth, 0);
    const buttonCornerRadius = Math.max(ringCornerRadius - ringWidth, 0);

    // Helper functions for corner radius overrides
    const computeBorderRadius = (
      defaultRadius: number,
      overrides?: CornerRadiusOverrides
    ): string => {
      if (!overrides) return `${defaultRadius}px`;
      const tl = overrides.topLeft ?? defaultRadius;
      const tr = overrides.topRight ?? defaultRadius;
      const br = overrides.bottomRight ?? defaultRadius;
      const bl = overrides.bottomLeft ?? defaultRadius;
      return `${tl}px ${tr}px ${br}px ${bl}px`;
    };

    const computeLayerOverrides = (
      overrides: CornerRadiusOverrides | undefined,
      offset: number
    ): CornerRadiusOverrides | undefined => {
      if (!overrides) return undefined;
      return {
        topLeft: overrides.topLeft !== undefined ? Math.max(overrides.topLeft - offset, 0) : undefined,
        topRight: overrides.topRight !== undefined ? Math.max(overrides.topRight - offset, 0) : undefined,
        bottomRight: overrides.bottomRight !== undefined ? Math.max(overrides.bottomRight - offset, 0) : undefined,
        bottomLeft: overrides.bottomLeft !== undefined ? Math.max(overrides.bottomLeft - offset, 0) : undefined,
      };
    };

    const frameOverrides = cornerRadiusOverrides;
    const ringOverrides = computeLayerOverrides(cornerRadiusOverrides, frameWidth);
    const buttonOverrides = computeLayerOverrides(cornerRadiusOverrides, frameWidth + ringWidth);

    // Size classes for padding and font size
    const sizeClasses = {
      xs: 'px-2 py-0.2 text-xs',
      sm: 'px-3 py-0.7 text-sm',
      md: 'px-5 py-1.2 text-base',
      lg: 'px-6 py-1.7 text-lg',
      xl: 'px-8 py-2.5 text-xl',
    };

    // Content styling for icon and text
    // Default: gray. If active: color with glow, or white with glow if no color.
    // If type is submit and color is set: use color for icon and text.
    const activeColor = color || undefined;
    const isSubmitWithColor = type === PANeomorphButtonType.submit && color;
    const contentClass = active
      ? activeColor
        ? ''
        : 'text-gray-100'
      : isSubmitWithColor
      ? ''
      : PANeomorphPalette.textColor;
    const contentStyle: React.CSSProperties = active
      ? {
          color: activeColor || undefined,
          textShadow: `0 0 6px ${activeColor}, 0 0 12px ${activeColor}`,
        }
      : isSubmitWithColor
      ? { color: color }
      : {};

    // Shadow colors from theme (CSS custom properties)
    const frameShadowDark = palette.frameShadowDark;
    const frameShadowLight = palette.frameShadowLight;
    const buttonShadowDark = palette.buttonShadowDark;
    const buttonShadowLight = palette.buttonShadowLight;
    const shadowBlurRadius = 2;

    const frameShadow = `inset ${frameWidth}px ${frameWidth}px ${shadowBlurRadius}px ${frameShadowDark}, inset -${frameWidth}px -${frameWidth}px ${shadowBlurRadius}px ${frameShadowLight}`;
    const buttonShadow = `-${buttonBorderWidth}px -${buttonBorderWidth}px ${shadowBlurRadius}px ${buttonShadowLight}, ${buttonBorderWidth}px ${buttonBorderWidth}px ${shadowBlurRadius}px ${buttonShadowDark}`;
    const buttonActiveShadow = `inset -${buttonBorderWidth}px -${buttonBorderWidth}px ${shadowBlurRadius}px ${buttonShadowLight}, inset ${buttonBorderWidth}px ${buttonBorderWidth}px ${shadowBlurRadius}px ${buttonShadowDark}`;

    const frameClass = `bg-next-panel transition-all duration-200 ease-in-out`;
    // If color is not set, do not set a background color for the ring, but inherit from parent
    const ringClass = `${color ? 'bg-next-panel' : ''} transition-all duration-200 ease-in-out${
      color ? '' : ' border border-next-border'
    }`;
    const buttonClass = `w-full h-full font-semibold border-none transition-all duration-200 ease-in-out focus:outline-none bg-next-panel disabled:opacity-70 disabled:shadow-none disabled:bg-next-panel`;
    const buttonSizeClass = sizeClasses[size] as string;

    // Three-layer hierarchy: Frame > Ring > Button
    return (
      <div
        className={`${frameClass} ${fullWidth ? 'w-full' : 'inline-block'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
        style={{
          borderRadius: computeBorderRadius(frameCornerRadius, frameOverrides),
          padding: frameWidth,
          boxShadow: frameShadow,
          backgroundColor: palette.frameBackground,
          height: buttonHeight + 2 * frameWidth + 2 * ringWidth,
        }}
      >
        <div
          className={ringClass}
          style={{
            borderRadius: computeBorderRadius(ringCornerRadius, ringOverrides),
            padding: ringWidth,
            overflow: 'hidden',
            backgroundColor: color ? undefined : palette.ringBackground,
            height: buttonHeight + 2 * ringWidth,
          }}
        >
          <button
            ref={ref}
            type={type}
            disabled={disabled}
            className={`w-full inline-flex items-center justify-center ${buttonClass} ${buttonSizeClass}`}
            style={{
              borderRadius: computeBorderRadius(buttonCornerRadius, buttonOverrides),
              borderWidth: buttonBorderWidth,
              boxShadow: !disabled ? (active ? buttonActiveShadow : buttonShadow) : undefined,
              backgroundImage: PATexture.noise,
              backgroundColor: palette.buttonBackground,
              height: buttonHeight,
            }}
            {...rest}
          >
            <span
              className={`flex flex-nowrap items-center justify-center gap-2 ${contentClass}`}
              style={{ ...contentStyle, position: 'relative', top: '-1px' }}
            >
              {icon && <span>{icon}</span>}
              {children && <span className="whitespace-nowrap">{children}</span>}
            </span>
          </button>
        </div>
      </div>
    );
  }
);

PANeomorphButton.displayName = 'PANeomorphButton';
