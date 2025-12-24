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
