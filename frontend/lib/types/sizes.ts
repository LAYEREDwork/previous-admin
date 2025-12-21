/**
 * PA Size Enums and Types
 * Independent size definitions for Previous Admin components
 */

// Size Enum (xs, sm, md, lg, xl)
export const PASize = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const;

// Typography Size Enum (xs through 6xl)
export const PATypographySize = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XL2: '2xl',
  XL3: '3xl',
  XL4: '4xl',
  XL5: '5xl',
  XL6: '6xl',
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
