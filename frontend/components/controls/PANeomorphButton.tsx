import { ReactNode, useEffect, useState } from 'react';
import { PASize, PABasicSize } from '../../lib/types/sizes';
import { NOISE_TEXTURE, adjustLightness, hslToString, parseColorToHsl } from '../../lib/utils/color';

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

interface PANeomorphButtonProps {
  children?: ReactNode;
  icon?: ReactNode;
  size?: PABasicSize;
  active?: boolean;
  disabled?: boolean;
  shape?: PANeomorphButtonShape;
  fullWidth?: boolean;
  buttonType?: PANeomorphButtonType;
  onClick?: () => void;
  className?: string;
  title?: string;
  color?: string; // Color for ring and active glow
  baseColor?: string; // Optional base background color to derive palette from
}

type Palette = {
  frameBackground: string;
  ringBackground: string;
  buttonBackground: string;
  shadowDark: string;
  shadowLight: string;
};

export enum PANeomorphButtonPaletteDefault {
  BASE_COLOR = '#1a1a1a',
  FRAME_BACKGROUND = 'hsl(0, 0%, 6%)',
  RING_BACKGROUND = 'hsl(0, 0%, 12%)',
  BUTTON_BACKGROUND = 'hsl(0, 0%, 16%)',
  SHADOW_DARK = 'hsl(0, 0%, 0%)',
  SHADOW_LIGHT = 'hsl(0, 0%, 32%)',
}

function computePalette(baseColor: string): Palette {
  const baseHsl = parseColorToHsl(baseColor) ?? parseColorToHsl(PANeomorphButtonPaletteDefault.BASE_COLOR);

  if (!baseHsl) {
    return {
      frameBackground: PANeomorphButtonPaletteDefault.FRAME_BACKGROUND,
      ringBackground: PANeomorphButtonPaletteDefault.RING_BACKGROUND,
      buttonBackground: PANeomorphButtonPaletteDefault.BUTTON_BACKGROUND,
      shadowDark: PANeomorphButtonPaletteDefault.SHADOW_DARK,
      shadowLight: PANeomorphButtonPaletteDefault.SHADOW_LIGHT,
    };
  }

  const frameBackground = hslToString(adjustLightness(baseHsl, -4));
  const ringBackground = hslToString(adjustLightness(baseHsl, 2));
  const buttonBackground = hslToString(adjustLightness(baseHsl, 6));
  const shadowDark = hslToString(adjustLightness(baseHsl, -24));
  const shadowLight = hslToString(adjustLightness(baseHsl, 22));

  return { frameBackground, ringBackground, buttonBackground, shadowDark, shadowLight };
}

/**
 * PASkeuomorphButton - A skeuomorphic button with a high-quality, industrial, dark-UI aesthetic.
 * It is seated in a recessed housing and appears embossed, with a matte, textured finish.
 */
export function PANeomorphButton({
  children,
  color,
  icon,
  title,
  baseColor,
  onClick,
  fullWidth = false,
  active = false,
  disabled = false,
  size = PASize.MD,
  shape = PANeomorphButtonShape.rect,
  buttonType = PANeomorphButtonType.button,
  className = '',
}: PANeomorphButtonProps) {
  const [palette, setPalette] = useState<Palette>(() => computePalette(baseColor || PANeomorphButtonPaletteDefault.BASE_COLOR));

  useEffect(() => {
    setPalette(computePalette(baseColor || PANeomorphButtonPaletteDefault.BASE_COLOR));
  }, [baseColor]);

  // Sizing and border widths
  const frameWidth = 2;
  const ringWidth = 2;
  const buttonBorderWidth = 2;

  // Map size to height in px
  const sizeToHeight = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
  };
  const buttonHeight = sizeToHeight[size];

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
  const activeColor = color || undefined;
  const contentClass = active
    ? (activeColor ? '' : 'text-gray-100')
    : 'text-next-text-dim';
  const contentStyle = active
    ? {
        color: activeColor || undefined,
        textShadow: `0 0 6px ${activeColor}, 0 0 12px ${activeColor}`,
      }
    : {};

  // Shadow colors from theme (CSS custom properties)
  const shadowDark = palette.shadowDark;
  const shadowLight = palette.shadowLight;
  const shadowBlurRadius = 2;

  const frameShadow = `inset ${frameWidth}px ${frameWidth}px ${shadowBlurRadius}px ${shadowDark}, inset -${frameWidth}px -${frameWidth}px ${shadowBlurRadius}px ${shadowLight}`;
  const buttonShadow = `-${buttonBorderWidth}px -${buttonBorderWidth}px ${shadowBlurRadius}px ${shadowLight}, ${buttonBorderWidth}px ${buttonBorderWidth}px ${shadowBlurRadius}px ${shadowDark}`;
  const buttonActiveShadow = `inset -${buttonBorderWidth}px -${buttonBorderWidth}px ${shadowBlurRadius}px ${shadowLight}, inset ${buttonBorderWidth}px ${buttonBorderWidth}px ${shadowBlurRadius}px ${shadowDark}`;

  const frameClass = `bg-next-panel transition-all duration-200 ease-in-out`;
  // If color is not set, do not set a background color for the ring, but inherit from parent
  const ringClass = `${color ? 'bg-next-panel' : ''} transition-all duration-200 ease-in-out${color ? '' : ' border border-next-border'}`;
  const buttonClass = `w-full h-full font-semibold border-none transition-all duration-200 ease-in-out focus:outline-none bg-next-panel disabled:opacity-70 disabled:shadow-none disabled:bg-next-panel`;

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
          className={`inline-flex items-center justify-center ${buttonClass} ${sizeClasses[size]}`}
          style={{
            borderRadius: buttonCornerRadius,
            borderWidth: buttonBorderWidth,
            boxShadow: !disabled
              ? (active ? buttonActiveShadow : buttonShadow)
              : undefined,
            backgroundImage: NOISE_TEXTURE,
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
