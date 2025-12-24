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
};

function computePalette(baseColor: string): Palette {
  const baseHsl = parseColorToHsl(baseColor) ?? parseColorToHsl(PANeomorphPalette.BASE_COLOR);

  if (!baseHsl) {
    return {
      frameBackground: PANeomorphPalette.FRAME_BACKGROUND,
      ringBackground: PANeomorphPalette.RING_BACKGROUND,
      buttonBackground: PANeomorphPalette.BUTTON_BACKGROUND,
      shadowDark: PANeomorphPalette.SHADOW_DARK,
      shadowLight: PANeomorphPalette.SHADOW_LIGHT,
    };
  }

  const frameBackground = hslToString(adjustLightness(baseHsl, -4));
  const ringBackground = hslToString(adjustLightness(baseHsl, 2));
  const buttonBackground = hslToString(adjustLightness(baseHsl, 6));
  const shadowDark = hslToString(adjustLightness(baseHsl, -24));
  const shadowLight = hslToString(adjustLightness(baseHsl, 22));

  return { frameBackground, ringBackground, buttonBackground, shadowDark, shadowLight };
}

interface PANeomorphButtonProps {
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
  disabled?: boolean;

  // Behavior
  buttonType?: PANeomorphButtonType;
  onClick?: () => void;

  // Styling
  className?: string;
  title?: string;
  color?: string;                                                   // Color for ring and active glow
  baseColor?: string;                                               // Optional base background color to derive palette from
}

/**
 * PASkeuomorphButton - A skeuomorphic button with a high-quality, industrial, dark-UI aesthetic.
 * It is seated in a recessed housing and appears embossed, with a matte, textured finish.
 */
export function PANeomorphButton({
  // Content
  children,
  icon,

  // Sizing
  size = PASize.MD,
  shape = PANeomorphButtonShape.rect,
  fullWidth = false,
  frameWidth = 2,
  ringWidth = 2,
  buttonBorderWidth = 2,

  // State
  active = false,
  disabled = false,

  // Behavior
  buttonType = PANeomorphButtonType.button,
  onClick,

  // Styling
  className = '',
  title,
  color,
  baseColor,
}: PANeomorphButtonProps) {
  const [palette, setPalette] = useState<Palette>(() => computePalette(baseColor || PANeomorphPalette.BASE_COLOR));
  const controlSize = useControlSize(size);

  useEffect(() => {
    setPalette(computePalette(baseColor || PANeomorphPalette.BASE_COLOR));
  }, [baseColor]);

  // Map size to height in px
  const sizeToHeight = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
  };
  const buttonHeight = sizeToHeight[size];                          // Calculate button height based on size

  // Calculate corner radii
  const cornerRadius = shape === PANeomorphButtonShape.rect ? buttonHeight / 3 : buttonHeight;
  const frameCornerRadius = cornerRadius;
  const ringCornerRadius = Math.max(frameCornerRadius - frameWidth, 0);
  const buttonCornerRadius = Math.max(ringCornerRadius - ringWidth, 0);

  // Size classes for padding and font size
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Content styling for icon and text
  // Default: gray. If active: color with glow, or white with glow if no color.
  // If buttonType is submit and color is set: use color for icon and text.
  const activeColor = color || undefined;
  const isSubmitWithColor = buttonType === PANeomorphButtonType.submit && color;
  const contentClass = active
    ? (activeColor ? '' : 'text-gray-100')
    : isSubmitWithColor ? '' : PANeomorphPalette.TEXT_COLOR;
  const contentStyle: React.CSSProperties = active
    ? {
        color: activeColor || undefined,
        textShadow: `0 0 6px ${activeColor}, 0 0 12px ${activeColor}`,
      }
    : isSubmitWithColor
    ? { color: color }
    : {};


  // Shadow colors from theme (CSS custom properties)
  const shadowDark = palette.shadowDark;
  const shadowLight = palette.shadowLight;
  const shadowBlurRadius = 2;

  const frameShadow = `inset ${frameWidth}px ${frameWidth}px ${shadowBlurRadius}px ${shadowDark}, inset -${frameWidth}px -${frameWidth}px ${shadowBlurRadius}px ${shadowLight}`;
  const buttonShadow = `-${buttonBorderWidth}px -${buttonBorderWidth}px ${shadowBlurRadius}px ${shadowLight}, ${buttonBorderWidth}px ${buttonBorderWidth}px ${shadowBlurRadius}px ${shadowDark}`;
  const buttonActiveShadow = `inset -${buttonBorderWidth}px -${buttonBorderWidth}px ${shadowBlurRadius}px ${shadowLight}, inset ${buttonBorderWidth}px ${buttonBorderWidth}px ${shadowBlurRadius}px ${shadowDark}`;

  const frameClass = `bg-next-panel transition-all duration-200 ease-in-out height=${buttonHeight + 2 * frameWidth}px`;
  // If color is not set, do not set a background color for the ring, but inherit from parent
  const ringClass = `${color ? 'bg-next-panel' : ''} transition-all duration-200 ease-in-out${color ? '' : ' border border-next-border'}`;
  const buttonClass = `w-full font-semibold border-none transition-all duration-200 ease-in-out focus:outline-none bg-next-panel disabled:opacity-70 disabled:shadow-none disabled:bg-next-panel`;

  // Three-layer hierarchy: Frame > Ring > Button
  return (
    <div
      className={`${frameClass} ${fullWidth ? 'w-full' : 'inline-block'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{
        borderRadius: frameCornerRadius,
        padding: frameWidth,
        boxShadow: frameShadow,
        backgroundColor: palette.frameBackground,
      }}
    >
        <div
          className={ringClass}
          style={{
            borderRadius: ringCornerRadius,
            padding: ringWidth,
            backgroundColor: color ? undefined : palette.ringBackground,
          }}
        >
          <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            type={buttonType}
            className={`h-full inline-flex items-center justify-center ${buttonClass} ${sizeClasses[controlSize]}`}
            style={{
              borderRadius: buttonCornerRadius,
              borderWidth: buttonBorderWidth,
              boxShadow: !disabled
                ? (active ? buttonActiveShadow : buttonShadow)
                : undefined,
              backgroundImage: PATextures.noise,
              backgroundColor: palette.buttonBackground,
            }}
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
