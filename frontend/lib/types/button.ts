/**
 * PAButtonType Enum
 *
 * Defines the visual type of a PAButton, which determines its appearance and color.
 */
export enum PAButtonType {
  /** Default button with standard styling */
  default = 'default',
  /** Primary button with primary color */
  primary = 'primary',
  /** Destructive button with red color */
  destructive = 'destructive',
  /** Cancel button with gray color */
  cancel = 'cancel',
  /** Ghost button with minimal styling */
  ghost = 'ghost',
  /** Link button styled as a link */
  link = 'link',
  /** Subtle button with subtle styling */
  subtle = 'subtle',
}