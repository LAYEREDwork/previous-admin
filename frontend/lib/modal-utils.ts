import type { ReactNode } from 'react';

import { PAModalType, PAModalButton, PAModalButtonType } from '@frontend/lib/types/modal';

/**
 * Shared modal utility helpers extracted from PAModal to keep component files
 * focused on React components (avoids Fast Refresh warnings).
 */

export const MODAL_ICON_SIZE = 42;
export const MODAL_ICON_CLASS = 'inline-block mr-3 -mt-0.5';

/**
 * Returns the appropriate appearance for a button type
 */
export function getButtonAppearance(type: PAModalButtonType): 'default' | 'primary' | 'subtle' {
    switch (type) {
        case PAModalButtonType.default:
            return 'primary';
        case PAModalButtonType.destructive:
            return 'primary';
        case PAModalButtonType.cancel:
            return 'subtle';
        default:
            return 'primary';
    }
}

/**
 * Returns the appropriate color for a button type (theme-aware)
 */
export function getButtonColor(type: PAModalButtonType): 'blue' | 'red' | undefined {
    switch (type) {
        case PAModalButtonType.default:
            return 'blue';
        case PAModalButtonType.destructive:
            return 'red';
        case PAModalButtonType.cancel:
            return undefined; // Uses theme-aware subtle appearance
        default:
            return 'blue';
    }
}

/**
 * Returns theme-aware CSS classes for button styling
 */
export function getButtonClassName(type: PAModalButtonType): string {
    switch (type) {
        case PAModalButtonType.destructive:
            return 'hover:bg-[var(--rs-red-600)] hover:text-white focus:bg-[var(--rs-red-600)] focus:text-white';
        default:
            return '';
    }
}

/**
 * Returns the appropriate icon component for the given modal type.
 * NOTE: This function returns React nodes; the caller is responsible for
 * cloning or sizing the element as needed.
 */
export function getModalIcon(): ReactNode | null {
    // Default helper returns null; component files provide actual icons.
    return null;
}

/**
 * Returns default buttons for a modal type
 */
export function getDefaultModalButtons(
    type: PAModalType,
    onClose: () => void,
    translations: { common: { ok: string; cancel: string; confirm: string; close: string } }
): PAModalButton[] {
    switch (type) {
        case PAModalType.alert:
            return [
                {
                    label: translations.common.ok,
                    type: PAModalButtonType.default,
                    onClick: onClose,
                },
            ];
        case PAModalType.confirmation:
            return [
                {
                    label: translations.common.cancel,
                    type: PAModalButtonType.cancel,
                    onClick: onClose,
                },
                {
                    label: translations.common.confirm,
                    type: PAModalButtonType.default,
                    onClick: onClose,
                },
            ];
        case PAModalType.info:
            return [
                {
                    label: translations.common.ok,
                    type: PAModalButtonType.default,
                    onClick: onClose,
                },
            ];
        case PAModalType.error:
            return [
                {
                    label: translations.common.close,
                    type: PAModalButtonType.default,
                    onClick: onClose,
                },
            ];
        default:
            return [];
    }
}
