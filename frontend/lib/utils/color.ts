export type HslColor = { h: number; s: number; l: number };

export enum PATextures {
  noise = "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3cfilter id='n'%3e%3cfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3e%3c/filter%3e%3crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3e%3c/svg%3e\")",
}

/**
 * Clamp a numeric value into the provided inclusive range.
 *
 * @param value - Value to clamp.
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (inclusive).
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Convert a 3- or 6-digit hex color string to RGB components.
 *
 * Supports `#fff` and `#ffffff` notations.
 *
 * @param hex - Hex color string starting with or without `#`.
 * @returns RGB object or null if the string cannot be parsed.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '');
  if (normalized.length === 3) {
    const [r, g, b] = normalized.split('').map((char) => parseInt(char + char, 16));
    return { r, g, b };
  }
  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

/**
 * Convert RGB values to HSL (hue/saturation/lightness).
 *
 * @param rgb - Object with red, green, blue in range 0–255.
 * @returns HSL object with h in 0–360, s/l in 0–100.
 */
export function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }): HslColor {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      default:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }

    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * Parse a color string into HSL.
 *
 * Currently supports only hex input (`#rgb` or `#rrggbb`).
 *
 * @param color - Color string to parse.
 * @returns HSL object or null if the input is not supported.
 */
export function parseColorToHsl(color: string): HslColor | null {
  if (!color) return null;
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    return rgb ? rgbToHsl(rgb) : null;
  }
  return null;
}

/**
 * Convert an HSL object to a CSS `hsl()` string.
 *
 * @param hsl - HSL color values.
 * @returns CSS string like `hsl(210, 50%, 40%)`.
 */
export function hslToString({ h, s, l }: HslColor): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Adjust the lightness of an HSL color by a delta.
 *
 * Useful for generating lighter/darker variants from a base color.
 *
 * @param base - Base HSL color.
 * @param delta - Lightness delta in percentage points (positive to lighten, negative to darken).
 * @returns New HSL color with clamped lightness in [0, 100].
 */
export function adjustLightness(base: HslColor, delta: number): HslColor {
  return { ...base, l: clamp(base.l + delta, 0, 100) };
}
