/**
 * Styling utilities for Previous Admin components
 * Provides centralized styling logic and consistent theming
 */

import { StylingKey } from '@shared/previous-config/enums';

import { PASize } from '../types';

import { adjustLightness, hslToString, parseColorToHsl } from './color';
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
  isDarkMode: boolean
): {
  backgroundColor?: string;
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

  return {
    backgroundColor: baseBackground,
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
 * Default configuration values for neomorphic controls containing all sizing and styling parameters
 */
export const PANeomorphControlConfigDefaults = {
  size: PASize.md,
  shape: PANeomorphControlShape.rect,
  baseColor: '',
  color: '#00000000',
  frameWidth: 2,
  ringWidth: 1,
  buttonBorderWidth: 2,
} as const;

export type PANeomorphControlConfig = {
  size?: PASize;
  shape?: PANeomorphControlShape;
  baseColor?: string;
  color?: string;
  frameWidth?: number;
  ringWidth?: number;
  buttonBorderWidth?: number;
};

/**
 * Merges the provided config with default values for neomorphic controls
 * @param config - Partial configuration object
 * @returns Complete configuration object with defaults applied
 */
export function mergeNeomorphControlConfig(
  config: PANeomorphControlConfig = {}
): Required<PANeomorphControlConfig> {
  return {
    size: config.size ?? PANeomorphControlConfigDefaults.size,
    shape: config.shape ?? PANeomorphControlConfigDefaults.shape,
    baseColor: config.baseColor ?? PANeomorphControlConfigDefaults.baseColor,
    color: config.color ?? PANeomorphControlConfigDefaults.color,
    frameWidth: config.frameWidth ?? PANeomorphControlConfigDefaults.frameWidth,
    ringWidth: config.ringWidth ?? PANeomorphControlConfigDefaults.ringWidth,
    buttonBorderWidth: config.buttonBorderWidth ?? PANeomorphControlConfigDefaults.buttonBorderWidth,
  };
}

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

/**
 * Use PAIconSize from types/sizes.ts instead of iconSizesPixel
 * This centralized constant ensures consistent icon sizing across the application
 */
export { PAIconSize as iconSizesPixel } from '../types/sizes';

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
export interface PANeomorphControlCSS {
  frame: React.CSSProperties;  // Styles für den äußeren recessed Container
  ring: React.CSSProperties;   // Styles für den Ring
  button: React.CSSProperties; // Styles für den inneren embossed Bereich
  palette: Palette;            // Die berechnete Farb-Palette
  inactiveTextColor: string;   // Textfarbe für inaktive Zustände
  activeTextColor: string;     // Textfarbe für aktive Zustände
  backgroundColor: string;     // Hintergrundfarbe des recessed Bereiches (dunkler als baseColor)
  hoverBackgroundColor: string; // Hover-Hintergrundfarbe
  buttonBackgroundColor: string; // Hintergrundfarbe des Buttons (heller als baseColor)
  frameShadowLightColor: string; // Helle Schattenfarbe für Frame
  frameShadowDarkColor: string;  // Dunkle Schattenfarbe für Frame
  buttonFrameLightColor: string; // Helle Schattenfarbe für Button
  buttonFrameDarkColor: string;  // Dunkle Schattenfarbe für Button
}

/**
 * Berechnet die Styles für ein neomorphes Control basierend auf den gegebenen Parametern.
 * Diese Funktion zentralisiert die Logik für Schatten, Farben, Höhen und Texturen,
 * um Konsistenz über alle neomorphen Components zu gewährleisten.
 *
 * @param config - Configuration object containing all sizing and styling parameters
 * @returns Ein Objekt mit den berechneten Styles für frame, ring, button und palette.
 */
export function computeNeomorphControlCSS(
  config: PANeomorphControlConfig = {}
): PANeomorphControlCSS {
  // Merge config with defaults
  const {
    size,
    shape,
    baseColor,
    color,
    frameWidth,
    ringWidth,
    buttonBorderWidth,
  } = mergeNeomorphControlConfig(config);
  // Palette berechnen (fallback: Website-Hintergrundfarbe, hier angenommen als '#0a0a0a' oder ähnlich)
  const websiteBackgroundColor = '#0a0a0a'; // TODO: Aus Config holen
  const palette = computePalette(baseColor || websiteBackgroundColor);

  // Basis-HSL für zusätzliche Farbberechnungen
  const baseHsl = parseColorToHsl(baseColor || websiteBackgroundColor)!;

  // Zusätzliche Farben berechnen
  const inactiveTextColor = hslToString(adjustLightness(parseColorToHsl(palette.textColor)!, -40)); // 40% dunkler
  const activeTextColor = 'white'; // Standard für aktive Zustände
  const backgroundColor = hslToString(adjustLightness(baseHsl, -1)); // Nuance dunkler als baseColor
  const hoverBackgroundColor = hslToString(adjustLightness(parseColorToHsl(palette.frameBackground)!, 16)); // Heller für Hover
  const buttonBackgroundColor = hslToString(adjustLightness(baseHsl, 1)); // Nuance heller als baseColor
  const frameShadowLightColor = hslToString(adjustLightness(parseColorToHsl(palette.frameShadowLight)!, 10));
  const frameShadowDarkColor = palette.frameShadowDark;
  const buttonFrameLightColor = palette.buttonShadowLight;
  const buttonFrameDarkColor = palette.buttonShadowDark;

  // Höhe und Corner-Radii berechnen
  const height = containerHeightsPixel[size];
  const cornerRadius = shape === PANeomorphControlShape.pill ? height / 2 : height / 4;

  // Schatten-Blur (festgelegt auf 2px für Konsistenz mit SegmentedControl)
  const shadowBlur = 2;

  // Frame-Styles (recessed)
  const frame: React.CSSProperties = {
    height: `${height}px`,
    borderRadius: `${cornerRadius}px`,
    backgroundColor: palette.frameBackground,
    boxShadow: `
      inset ${frameWidth}px ${frameWidth}px ${shadowBlur}px ${palette.frameShadowDark},
      inset -${frameWidth}px -${frameWidth}px ${shadowBlur}px ${palette.frameShadowLight}
    `,
  };

  // Ring-Styles
  const ring: React.CSSProperties = {
    backgroundColor: (color && color !== PANeomorphControlConfigDefaults.color) ? color : palette.frameBackground,
    borderRadius: `${cornerRadius}px`,
  };

  // Button-Styles (embossed)
  const button: React.CSSProperties = {
    height: `${height - 2 * ringWidth}px`, // Höhe minus Ring-Breite oben und unten
    borderRadius: `${cornerRadius - ringWidth}px`,
    backgroundColor: palette.buttonBackground,
    boxShadow: `
      -${buttonBorderWidth}px -${buttonBorderWidth}px ${shadowBlur}px ${palette.buttonShadowLight},
      ${buttonBorderWidth}px ${buttonBorderWidth}px ${shadowBlur}px ${palette.buttonShadowDark}
    `,
  };

  const result: PANeomorphControlCSS = {
    frame,
    ring,
    button,
    palette,
    inactiveTextColor,
    activeTextColor,
    backgroundColor,
    hoverBackgroundColor,
    buttonBackgroundColor,
    frameShadowLightColor,
    frameShadowDarkColor,
    buttonFrameLightColor,
    buttonFrameDarkColor,
  };

  return result;
}
