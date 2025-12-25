import { adjustLightness, hslToString, parseColorToHsl } from './color';

export enum PANeomorphPalette {
  baseColor = '#1a1a1a',
  frameBackground = 'hsl(0, 0%, 6%)',
  ringBackground = 'hsl(0, 0%, 12%)',
  buttonBackground = 'hsl(0, 0%, 16%)',
  shadowDark = 'hsl(0, 0%, 0%)',
  shadowLight = 'hsl(0, 0%, 27%)',
  frameShadowDark = 'hsl(0, 0%, 0.5%)',
  frameShadowLight = 'hsl(0, 0%, 25%)',
  buttonShadowDark = 'hsl(0, 0%, 1%)',
  buttonShadowLight = 'hsl(0, 0%, 30%)',
  textColor = 'text-next-text',
}

export interface Palette {
  frameBackground: string;
  ringBackground: string;
  buttonBackground: string;
  shadowDark: string;
  shadowLight: string;
  frameShadowDark: string;
  frameShadowLight: string;
  buttonShadowDark: string;
  buttonShadowLight: string;
  base: string;
  text: string;
}

export function computePalette(baseColor: string): Palette {
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
      base: PANeomorphPalette.baseColor,
      text: PANeomorphPalette.textColor,
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
  const base = hslToString(baseHsl);
  const text = hslToString(adjustLightness(baseHsl, 80)); // Assuming light text

  return { frameBackground, ringBackground, buttonBackground, shadowDark, shadowLight, frameShadowDark, frameShadowLight, buttonShadowDark, buttonShadowLight, base, text };
}