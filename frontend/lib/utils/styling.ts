/**
 * Styling utilities for Previous Admin components
 * Provides centralized styling logic and consistent theming
 */

import { StylingKey } from '../../../shared/enums';
import { PATexture } from './color';

/**
 * Calculate active glow shadow
 */
export function getActiveGlowShadow(
  color: string = activeGlowConfig.color,
  blurRadius: number = activeGlowConfig.blurRadius
): string {
  return `0 0 ${blurRadius}px ${color}`;
}

/**
 * Get background styling for config list items
 */
export function getConfigItemBackground(
  isDragged: boolean,
  isActive: boolean,
  isDarkMode: boolean
): {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundBlendMode?: string;
  backgroundSize?: string;
  backgroundRepeat?: string;
  backgroundOrigin?: string;
  backgroundClip?: string;
} {
  if (!isDarkMode) {
    return {};
  }

  const baseBackground = isDragged
    ? stylingDefaults[StylingKey.dragBackground]
    : stylingDefaults[StylingKey.itemBackground];

  const overlay = isActive
    ? `linear-gradient(${stylingDefaults[StylingKey.activeOverlay]}, ${stylingDefaults[StylingKey.activeOverlay]}), `
    : '';

  return {
    backgroundColor: baseBackground,
    backgroundImage: `${overlay}${PATexture.noise}`,
    backgroundBlendMode: 'soft-light',
    backgroundSize: 'auto',
    backgroundRepeat: 'repeat',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box',
  };
}

/**
 * Get box shadow for config list items
 */
export function getConfigItemBoxShadow(
  isActive: boolean,
  frameShadow: string = getFrameShadow()
): string {
  const activeGlow = isActive ? `${getActiveGlowShadow()}, ` : '';
  return `${activeGlow}${frameShadow}`;
}

/**
 * Get transition styles for config list items
 */
export function getConfigItemTransition(isActive: boolean): string {
  const duration = isActive ? activeGlowConfig.transitionDuration : 0.2;
  return `box-shadow ${duration}s ease-in-out, border-color ${duration}s ease-in-out`;
}

/**
 * Calculate frame shadow for skeuomorphic effects
 */
export function getFrameShadow(
  lightColor: string = stylingDefaults[StylingKey.frameShadowLight],
  darkColor: string = stylingDefaults[StylingKey.frameShadowDark],
  frameWidth: number = shadowConfig.frameWidth,
  blurRadius: number = shadowConfig.shadowBlurRadius
): string {
  return `inset ${frameWidth}px ${frameWidth}px ${blurRadius}px ${darkColor}, inset -${frameWidth}px -${frameWidth}px ${blurRadius}px ${lightColor}`;
}

/**
 * Active glow configuration
 */
export const activeGlowConfig = {
  blurRadius: 12,
  color: 'rgba(6, 182, 212, 0.6)',
  transitionDuration: 0.4,
};

/**
 * Enum for shape, kept for basic configuration
 */
export const PANeomorphControlShape = {
  pill: 'pill',
  rect: 'rect',
} as const;
export type PANeomorphControlShape = typeof PANeomorphControlShape[keyof typeof PANeomorphControlShape];

/**
 * Shadow configuration
 */
export const shadowConfig = {
  frameWidth: 2,
  shadowBlurRadius: 2,
};

export const containerHeightsCSS = {
  xs: 'h-7',      // 28px
  sm: 'h-[34px]', // 34px
  md: 'h-10',     // 40px
  lg: 'h-[46px]', // 46px
  xl: 'h-[50px]', // 50px
};

export const fontSizesCSS = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

export const iconSizesPixel = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

export const containerHeightsPixel = {
  xs: 28,
  sm: 34,
  md: 40,
  lg: 46,
  xl: 50,
};

/**
 * Default styling values
 */
export const stylingDefaults = {
  [StylingKey.itemBackground]: '#1A1A1A',
  [StylingKey.dragBackground]: '#181818',
  [StylingKey.activeOverlay]: 'rgba(6, 182, 212, 0.12)',
  [StylingKey.buttonBaseColor]: '#0d0d0d',
  [StylingKey.frameShadowLight]: 'rgba(55, 55, 55, 1)',
  [StylingKey.frameShadowDark]: '#000',
} as const;
