/**
 * PAModalType Enum
 *
 * Defines the visual type of a PAModal, which determines
 * the icon displayed in the modal title.
 */
export enum PAModalType {
  /** Alert modal with exclamation icon - for warnings */
  alert = 'alert',
  /** Confirmation modal with checkmark icon - for success confirmations */
  confirmation = 'confirmation',
  /** Info modal with info icon - for informational messages */
  info = 'info',
  /** Error modal with error icon - for error messages */
  error = 'error',
}
