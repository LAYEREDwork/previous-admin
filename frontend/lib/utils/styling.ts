/**
 * Styling utilities for Previous Admin components
 * Provides centralized styling logic and consistent theming
 */

import { StylingKey } from '~shared/enums';

/**
 * Default styling values
 */
export const STYLING_DEFAULTS = {
  [StylingKey.ITEM_BACKGROUND]: '#1A1A1A',
  [StylingKey.DRAG_BACKGROUND]: '#181818',
  [StylingKey.ACTIVE_OVERLAY]: 'rgba(6, 182, 212, 0.12)',
  [StylingKey.BUTTON_BASE_COLOR]: '#0d0d0d',
  [StylingKey.FRAME_SHADOW_LIGHT]: 'rgba(55, 55, 55, 1)',
  [StylingKey.FRAME_SHADOW_DARK]: '#000',
} as const;

/**
 * Shadow configuration
 */
export const SHADOW_CONFIG = {
  frameWidth: 2,
  shadowBlurRadius: 2,
} as const;

/**
 * Active glow configuration
 */
export const ACTIVE_GLOW_CONFIG = {
  blurRadius: 12,
  color: 'rgba(6, 182, 212, 0.6)',
  transitionDuration: 0.4,
} as const;

/**
 * Calculate frame shadow for skeuomorphic effects
 */
export function getFrameShadow(
  lightColor: string = STYLING_DEFAULTS[StylingKey.FRAME_SHADOW_LIGHT],
  darkColor: string = STYLING_DEFAULTS[StylingKey.FRAME_SHADOW_DARK],
  frameWidth: number = SHADOW_CONFIG.frameWidth,
  blurRadius: number = SHADOW_CONFIG.shadowBlurRadius
): string {
  return `inset ${frameWidth}px ${frameWidth}px ${blurRadius}px ${darkColor}, inset -${frameWidth}px -${frameWidth}px ${blurRadius}px ${lightColor}`;
}

/**
 * Calculate active glow shadow
 */
export function getActiveGlowShadow(
  color: string = ACTIVE_GLOW_CONFIG.color,
  blurRadius: number = ACTIVE_GLOW_CONFIG.blurRadius
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
    ? STYLING_DEFAULTS[StylingKey.DRAG_BACKGROUND]
    : STYLING_DEFAULTS[StylingKey.ITEM_BACKGROUND];

  const overlay = isActive ? `linear-gradient(${STYLING_DEFAULTS[StylingKey.ACTIVE_OVERLAY]}, ${STYLING_DEFAULTS[StylingKey.ACTIVE_OVERLAY]}), ` : '';

  return {
    backgroundColor: baseBackground,
    backgroundImage: `${overlay}url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
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
  const duration = isActive ? ACTIVE_GLOW_CONFIG.transitionDuration : 0.2;
  return `box-shadow ${duration}s ease-in-out, border-color ${duration}s ease-in-out`;
}