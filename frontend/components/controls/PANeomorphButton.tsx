import React, { ReactNode, useEffect, useState } from 'react';
import { PASize, PABasicSize } from '../../lib/types/sizes';
import { PATextures, adjustLightness, hslToString, parseColorToHsl } from '../../lib/utils/color';
import { PANeomorphPalette } from '../../lib/utils/palette';
import { useControlSize } from '../../hooks/useControlSize';

// Enum for shape, kept for basic configuration
export const PANeomorphButtonShape = {
  pill: 'pill',
  rect: 'rect',
} as const;
export type PANeomorphButtonShape = typeof PANeomorphButtonShape[keyof typeof PANeomorphButtonShape];

export const PANeomorphButtonType = {
  button: 'button',
  reset: 'reset',
  submit: 'submit',
} as const;
export type PANeomorphButtonType = typeof PANeomorphButtonType[keyof typeof PANeomorphButtonType];

type Palette = {
  frameBackground: string;
  ringBackground: string;
  buttonBackground: string;
  shadowDark: string;
  shadowLight: string;
  frameShadowDark: string;
  frameShadowLight: string;
  buttonShadowDark: string;
  buttonShadowLight: string;
};

function computePalette(baseColor: string): Palette {
  const baseHsl = parseColorToHsl(baseColor) ?? parseColorToHsl(PANeomorphPalette.baseColor);

  if (!baseHsl) {
    return {
      frameBackground: PANeomorphPalette.frameBackground,
      ringBackground: PANeomorphPalette.ringBackground,
      buttonBackground: PANeomorphPalette.buttonBackground,
      shadowDark: PANeomorphPalette.shadowDark,
      shadowLight: PANeomorphPalette.shadowLight,
      frameShadowDark: PANeomorphPalette.frameShadowDark,
      frameShadowLight: PANeomorphPalette.frameShadowLight,
      buttonShadowDark: PANeomorphPalette.buttonShadowDark,
      buttonShadowLight: PANeomorphPalette.buttonShadowLight,
    };
  }

  const frameBackground = hslToString(adjustLightness(baseHsl, -4));
  const ringBackground = hslToString(adjustLightness(baseHsl, 2));
  const buttonBackground = hslToString(adjustLightness(baseHsl, 6));
  const shadowDark = hslToString(adjustLightness(baseHsl, -24));
  const shadowLight = hslToString(adjustLightness(baseHsl, 20));
  const frameShadowDark = hslToString(adjustLightness(baseHsl, -30));
  const frameShadowLight = hslToString(adjustLightness(baseHsl, 20));
  const buttonShadowDark = hslToString(adjustLightness(baseHsl, -20));
  const buttonShadowLight = hslToString(adjustLightness(baseHsl, 30));

  return { frameBackground, ringBackground, buttonBackground, shadowDark, shadowLight, frameShadowDark, frameShadowLight, buttonShadowDark, buttonShadowLight };
}

interface PANeomorphButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'> {
  // Content
  children?: ReactNode;
  icon?: ReactNode;

  // Sizing
  size?: PABasicSize;
  shape?: PANeomorphButtonShape;
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
      shape = PANeomorphButtonShape.rect,
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
      ...rest
    },
    ref
  ) => {
    const [palette, setPalette] = useState<Palette>(() => computePalette(baseColor || PANeomorphPalette.baseColor));
    const controlSize = useControlSize(size);

    useEffect(() => {
      setPalette(computePalette(baseColor || PANeomorphPalette.baseColor));
    }, [baseColor]);

    // Map size to height in px
    const sizeToHeight = {
      xs: 30,
      sm: 34,
      md: 40,
      lg: 46,
    };
    const buttonHeight = sizeToHeight[size]; // Calculate button height based on size

    // Calculate corner radii
    const cornerRadius = shape === PANeomorphButtonShape.rect ? buttonHeight / 4 : buttonHeight;
    const frameCornerRadius = cornerRadius;
    const ringCornerRadius = Math.max(frameCornerRadius - frameWidth, 0);
    const buttonCornerRadius = Math.max(ringCornerRadius - ringWidth, 0);

    // Size classes for padding and font size
    const sizeClasses = {
      xs: 'px-2 py-0.2 text-xs',
      sm: 'px-3 py-0.7 text-sm',
      md: 'px-5 py-1.2 text-base',
      lg: 'px-6 py-1.7 text-lg',
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

    const frameClass = `bg-next-panel transition-all duration-200 ease-in-out height=${
      buttonHeight + 2 * frameWidth
    }px`;
    // If color is not set, do not set a background color for the ring, but inherit from parent
    const ringClass = `${color ? 'bg-next-panel' : ''} transition-all duration-200 ease-in-out${
      color ? '' : ' border border-next-border'
    }`;
    const buttonClass = `w-full h-full font-semibold border-none transition-all duration-200 ease-in-out focus:outline-none bg-next-panel disabled:opacity-70 disabled:shadow-none disabled:bg-next-panel`;

    // Three-layer hierarchy: Frame > Ring > Button
    return (
      <div
        className={`${frameClass} ${fullWidth ? 'w-full' : 'inline-block'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
        style={{
          borderRadius: frameCornerRadius,
          padding: frameWidth,
          boxShadow: frameShadow,
          backgroundColor: palette.frameBackground,
          height: buttonHeight + 2 * frameWidth + 2 * ringWidth,
        }}
      >
        <div
          className={ringClass}
          style={{
            borderRadius: ringCornerRadius,
            padding: ringWidth,
            backgroundColor: color ? undefined : palette.ringBackground,
            height: buttonHeight + 2 * ringWidth,
          }}
        >
          <button
            ref={ref}
            type={type}
            disabled={disabled}
            className={`w-full inline-flex items-center justify-center ${buttonClass} ${sizeClasses[controlSize]}`}
            style={{
              borderRadius: buttonCornerRadius,
              borderWidth: buttonBorderWidth,
              boxShadow: !disabled ? (active ? buttonActiveShadow : buttonShadow) : undefined,
              backgroundImage: PATextures.noise,
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
