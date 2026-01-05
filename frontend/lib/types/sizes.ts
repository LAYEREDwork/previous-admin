/**
 * PA Size Enums and Types
 * Independent size definitions for Previous Admin components
 */

// Size Enum (xs, sm, md, lg, xl)
export const PASize = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

/**
 * Icon sizes mapping from PASize to pixel values
 * Used consistently across all icon components (SF Symbols, etc.)
 */
export const PAIconSize: Record<string, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

/**
 * Comprehensive size configuration mapping PASize to multiple CSS properties
 * Centralizes font sizes, icon sizes, and button sizes for consistent UI scaling
 * Used throughout the application for size-dependent components
 */
export const PASizeConfig = {
  xs: { fontSize: 11, iconSize: 12, buttonSize: 'xs' as const },
  sm: { fontSize: 12, iconSize: 14, buttonSize: 'sm' as const },
  md: { fontSize: 14, iconSize: 16, buttonSize: 'md' as const },
  lg: { fontSize: 16, iconSize: 20, buttonSize: 'lg' as const },
  xl: { fontSize: 18, iconSize: 24, buttonSize: 'lg' as const }, // RSuite doesn't have 'xl', use 'lg'
} as const;

// Typography Size Enum (xs through 6xl)
export const PATypographySize = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xl2: '2xl',
  xl3: '3xl',
  xl4: '4xl',
  xl5: '5xl',
  xl6: '6xl',
} as const;

// Size type derived from enum
export type PASize = typeof PASize[keyof typeof PASize];

// Basic size type (xs, sm, md, lg) - excludes xl
export type PABasicSize = Exclude<PASize, 'xl'>;

// Text/Typography size type
export type PATextSize = typeof PATypographySize[keyof typeof PATypographySize];

// Breakpoints for responsive values
export type PABreakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '2xl';

// Responsive value wrapper
export type PAResponsiveValue<T> = {
  [key in PABreakpoints]?: T;
};

// Helper type for responsive props
export type PAWithResponsive<T> = T | PAResponsiveValue<T>;
