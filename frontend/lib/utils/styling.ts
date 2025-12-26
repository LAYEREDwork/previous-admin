/**
 * Styling utilities for Previous Admin components
 * Provides centralized styling logic and consistent theming
 */

import { StylingKey } from '../../../shared/enums';
import { PASize } from '../types';
import { PATexture } from './color';
import { computePalette, Palette } from './palette';

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
  [PASize.xs]: 'h-7',      // 28px
  [PASize.sm]: 'h-[34px]', // 34px
  [PASize.md]: 'h-10',     // 40px
  [PASize.lg]: 'h-[46px]', // 46px
  [PASize.xl]: 'h-[50px]', // 50px
};

export const fontSizesCSS = {
  [PASize.xs]: 'text-[10px]',
  [PASize.sm]: 'text-xs',
  [PASize.md]: 'text-sm',
  [PASize.lg]: 'text-base',
  [PASize.xl]: 'text-lg',
};

export const iconSizesPixel = {
  [PASize.xs]: 12,
  [PASize.sm]: 14,
  [PASize.md]: 16,
  [PASize.lg]: 18,
  [PASize.xl]: 20,
};

export const containerHeightsPixel = {
  [PASize.xs]: 28,
  [PASize.sm]: 34,
  [PASize.md]: 40,
  [PASize.lg]: 46,
  [PASize.xl]: 50,
};

export const buttonRadii = {
    [PASize.xs]: 14,
    [PASize.sm]: 17,
    [PASize.md]: 20,
    [PASize.lg]: 23,
    [PASize.xl]: 26,
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

/**
 * Interface für die berechneten Styles eines neomorphen Controls.
 * Enthält die Styles für Frame, Ring, Button und die verwendete Palette.
 */
export interface PANeomorphControlStyle {
  frame: React.CSSProperties;  // Styles für den äußeren recessed Container
  ring: React.CSSProperties;   // Styles für den Ring
  button: React.CSSProperties; // Styles für den inneren embossed Bereich
  palette: Palette;            // Die berechnete Farb-Palette
}

/**
 * Berechnet die Styles für ein neomorphes Control basierend auf den gegebenen Parametern.
 * Diese Funktion zentralisiert die Logik für Schatten, Farben, Höhen und Texturen,
 * um Konsistenz über alle neomorphen Components zu gewährleisten.
 *
 * @param size - Die Größe des Controls, bestimmt die Gesamthöhe.
 * @param shape - Die Form des Controls: 'rect' oder 'pill'.
 * @param baseColor - Optionale Basis-Farbe; falls nicht angegeben, wird die Website-Hintergrundfarbe verwendet.
 * @param color - Optionale Farbe für den Ring; default ist palette.frameBackground.
 * @param frameWidth - Breite des äußeren Frames (default: 2px).
 * @param ringWidth - Breite des Rings (default: 1px).
 * @param buttonBorderWidth - Breite des inneren Buttons/Rands (default: 2px).
 * @returns Ein Objekt mit den berechneten Styles für frame, ring, button und palette.
 */
export function computeNeomorphControlStyle(
  size: PASize,
  shape: PANeomorphControlShape,
  baseColor?: string,
  color?: string,
  frameWidth: number = 2,
  ringWidth: number = 1,
  buttonBorderWidth: number = 2
): PANeomorphControlStyle {
  // Palette berechnen (fallback: Website-Hintergrundfarbe, hier angenommen als '#0a0a0a' oder ähnlich)
  const websiteBackgroundColor = '#0a0a0a'; // TODO: Aus Config holen
  const palette = computePalette(baseColor || websiteBackgroundColor);

  // Höhe und Corner-Radii berechnen
  const height = containerHeightsPixel[size];
  const cornerRadius = shape === PANeomorphControlShape.pill ? height / 2 : height / 4;

  // Schatten-Blur (festgelegt auf 4px für Konsistenz)
  const shadowBlur = 4;

  // Frame-Styles (recessed)
  const frame: React.CSSProperties = {
    height: `${height}px`,
    borderRadius: `${cornerRadius}px`,
    backgroundColor: palette.frameBackground,
    backgroundImage: PATexture.fineNoise,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: 'overlay',
    boxShadow: `
      inset ${frameWidth}px ${frameWidth}px ${shadowBlur}px ${palette.frameShadowDark},
      inset -${frameWidth}px -${frameWidth}px ${shadowBlur}px ${palette.frameShadowLight}
    `,
  };

  // Ring-Styles
  const ring: React.CSSProperties = {
    backgroundColor: color || palette.frameBackground,
    borderRadius: `${cornerRadius}px`,
  };

  // Button-Styles (embossed)
  const button: React.CSSProperties = {
    height: `${height - 2 * ringWidth}px`, // Höhe minus Ring-Breite oben und unten
    borderRadius: `${cornerRadius - ringWidth}px`,
    backgroundColor: palette.buttonBackground,
    backgroundImage: PATexture.fineNoise,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: 'overlay',
    boxShadow: `
      -${buttonBorderWidth}px -${buttonBorderWidth}px ${shadowBlur}px ${palette.buttonShadowLight},
      ${buttonBorderWidth}px ${buttonBorderWidth}px ${shadowBlur}px ${palette.buttonShadowDark}
    `,
  };

  return {
    frame,
    ring,
    button,
    palette,
  };
}
