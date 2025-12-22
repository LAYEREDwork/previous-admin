import { ReactNode } from 'react';
import { PASize, PABasicSize } from '../../lib/types/sizes';

// Enum for shape, kept for basic configuration
export const PASkeuomorphButtonShape = {
  pill: 'pill',
  rect: 'rect',
} as const;
export type PASkeuomorphButtonShape =
  typeof PASkeuomorphButtonShape[keyof typeof PASkeuomorphButtonShape];

export const PASkeuomorphButtonType = {
  button: 'button',
  reset: 'reset',
  submit: 'submit',
} as const;
export type PASkeuomorphButtonType =
  typeof PASkeuomorphButtonType[keyof typeof PASkeuomorphButtonType];

interface PASkeuomorphButtonProps {
  children?: ReactNode;
  icon?: ReactNode;
  size?: PABasicSize;
  active?: boolean;
  disabled?: boolean;
  shape?: PASkeuomorphButtonShape;
  fullWidth?: boolean;
  buttonType?: PASkeuomorphButtonType;
  onClick?: () => void;
  className?: string;
  title?: string;
  color?: string; // Color for ring and active glow
}

/**
 * PASkeuomorphButton - A skeuomorphic button with a high-quality, industrial, dark-UI aesthetic.
 * It is seated in a recessed housing and appears embossed, with a matte, textured finish.
 */
export function PASkeuomorphButton({
  children,
  color,
  icon,
  title,
  onClick,
  fullWidth = false,
  active = false,
  disabled = false,
  size = PASize.MD,
  shape = PASkeuomorphButtonShape.rect,
  buttonType = PASkeuomorphButtonType.button,
  className = '',
  }: PASkeuomorphButtonProps) {

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
  const cornerRadius = shape === PASkeuomorphButtonShape.rect ? buttonHeight / 3 : buttonHeight;
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
  const activeColor = color || '#fff';
  const contentClass = active
    ? (color ? '' : 'text-white')
    : 'text-next-text-dim';
  const contentStyle = active
    ? {
        color: color || undefined,
        textShadow: `0 0 6px ${activeColor}, 0 0 12px ${activeColor}`,
      }
    : {};

  const noiseTexture = "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3cfilter id='n'%3e%3cfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3e%3c/filter%3e%3crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3e%3c/svg%3e\")";

  // Color constants for styles
  const buttonColorShadowDark  = '#111';                // dark drop shadow (bottom right)
  const buttonColorShadowLight = 'rgba(70, 70, 70, 1)';    // light highlight (top left)
  const frameColorShadowDark   = '#000';                   // dark frame shadow
  const frameColorShadowLight  = 'rgba(45, 45, 45, 1)';    // light frame highlight

  const frameShadow = `inset ${frameWidth}px ${frameWidth}px 1px ${frameColorShadowDark}, inset -${frameWidth}px -${frameWidth}px 1px ${frameColorShadowLight}`;
  const buttonShadow = `-${buttonBorderWidth}px -${buttonBorderWidth}px 1px ${buttonColorShadowLight}, ${buttonBorderWidth}px ${buttonBorderWidth}px 1px ${buttonColorShadowDark}`;
  const buttonActiveShadow = `inset -${buttonBorderWidth}px -${buttonBorderWidth}px 1px ${buttonColorShadowLight}, inset ${buttonBorderWidth}px ${buttonBorderWidth}px 1px ${buttonColorShadowDark}`;

  const frameClass = `bg-next-panel transition-all duration-200 ease-in-out`;
  // If color is not set, do not set a background color for the ring, but inherit from parent
  const ringClass = `${color ? 'bg-next-panel' : ''} transition-all duration-200 ease-in-out${color ? '' : ' border border-next-border'}`;
  const buttonClass = `w-full h-full font-semibold border-none transition-all duration-200 ease-in-out focus:outline-none bg-next-panel disabled:opacity-70 disabled:shadow-none disabled:bg-next-panel`;

  // Three-layer hierarchy: Frame > Ring > Button
  // Three-layer hierarchy: Frame > Ring > Button, with dynamic borderRadius and padding
  return (
    <div
      className={`${frameClass} ${fullWidth ? 'w-full' : 'inline-block'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{ borderRadius: frameCornerRadius, padding: frameWidth, boxShadow: frameShadow }}
    >
      <div
        className={ringClass}
        style={{
          borderRadius: ringCornerRadius,
          padding: ringWidth,
          backgroundColor: color ? undefined : 'inherit',
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
            backgroundImage: noiseTexture,
          }}
        >
          <span
            className={`flex flex-nowrap items-center justify-center gap-2 ${contentClass}`}
            style={contentStyle}
          >
            {icon && <span>{icon}</span>}
            {children && <span className="whitespace-nowrap">{children}</span>}
          </span>
        </button>
      </div>
    </div>
  );
}
