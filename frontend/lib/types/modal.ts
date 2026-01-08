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

/**
 * PAModalButtonType Enum
 *
 * Defines the visual type of a PAModal button, which determines its color.
 */
export enum PAModalButtonType {
  /** Default button with primary color */
  default = 'default',
  /** Destructive button with red color */
  destructive = 'destructive',
  /** Cancel button with gray color */
  cancel = 'cancel',
}

/**
 * PAModalButton Interface
 *
 * Defines a button configuration for PAModal.
 */
export interface PAModalButton {
  /** Button label text */
  label: string;
  /** Button type for styling */
  type: PAModalButtonType;
  /** Callback when button is clicked */
  onClick: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button shows loading state */
  loading?: boolean;
  /** Optional SF Symbol icon to display */
  icon?: React.ReactNode;
}
