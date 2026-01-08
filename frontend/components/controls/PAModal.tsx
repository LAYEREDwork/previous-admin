import React, { createContext, ReactNode, useContext, useEffect, useCallback } from 'react';
import { Modal, ModalProps, Button } from 'rsuite';

import {
    SFCheckmarkBubbleFill,
    SFExclamationmarkBubbleFill,
    SFInfoBubbleFill
} from '@frontend/components/sf-symbols';
import { PAModalType, PAModalButton, PAModalButtonType } from '@frontend/lib/types/modal';

/**
 * Context to pass modal type and custom header icon to sub-components
 */
const PAModalContext = createContext<{ type?: PAModalType; headerIcon?: ReactNode } | undefined>(undefined);

/**
 * Icon size constant for modal title icons
 */
const MODAL_ICON_SIZE = 42;

/**
 * Icon class name for consistent styling
 */
const MODAL_ICON_CLASS = 'inline-block mr-3 -mt-0.5';

/**
 * Returns the appropriate appearance for a button type
 */
function getButtonAppearance(type: PAModalButtonType): 'default' | 'primary' | 'subtle' {
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
function getButtonColor(type: PAModalButtonType): 'blue' | 'red' | undefined {
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
function getButtonClassName(type: PAModalButtonType): string {
    switch (type) {
        case PAModalButtonType.destructive:
            return 'hover:bg-[var(--rs-red-600)] hover:text-white focus:bg-[var(--rs-red-600)] focus:text-white';
        default:
            return '';
    }
}

/**
 * Returns the appropriate icon component for the given modal type
 */
function getModalIcon(type: PAModalType): ReactNode {
    switch (type) {
        case PAModalType.alert:
            return (
                <SFExclamationmarkBubbleFill
                    size={MODAL_ICON_SIZE}
                    className={`${MODAL_ICON_CLASS} text-[var(--rs-orange-600)]`}
                />
            );
        case PAModalType.confirmation:
            return (
                <SFCheckmarkBubbleFill
                    size={MODAL_ICON_SIZE}
                    className={`${MODAL_ICON_CLASS} text-[var(--rs-green-600)]`}
                />
            );
        case PAModalType.info:
            return (
                <SFInfoBubbleFill
                    size={MODAL_ICON_SIZE}
                    className={`${MODAL_ICON_CLASS} text-[var(--rs-blue-600)]`}
                />
            );
        case PAModalType.error:
            return (
                <SFExclamationmarkBubbleFill
                    size={MODAL_ICON_SIZE}
                    className={`${MODAL_ICON_CLASS} text-[var(--rs-red-600)]`}
                />
            );
        default:
            return null;
    }
}

/**
 * Returns default buttons for a modal type
 */
export function getDefaultModalButtons(type: PAModalType, onClose: () => void, translations: { common: { ok: string; cancel: string; confirm: string; close: string } }): PAModalButton[] {
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

interface PAModalProps extends ModalProps {
    children: ReactNode;
    controlSize?: any;
    /** Modal type determines the icon shown in the title */
    type?: PAModalType;
    /** Optional array of buttons to display in the footer */
    buttons?: PAModalButton[];
    /** Optional custom SF Symbol icon to display in the header instead of type-based icon */
    headerIcon?: ReactNode;
}

/**
 * PAModal - Enhanced RSuite Modal with type-based icons and consistent styling
 */
export function PAModal({
    children,
    className,
    style,
    type,
    buttons,
    headerIcon,
    onClose,
    open,
    ...props
}: PAModalProps) {
    // Apply slightly larger border radius and ensure overflow is hidden so content
    // cannot visually overlap rounded corners. We keep any incoming className/style.
    const mergedClassName = `${className ?? ''} rounded-lg overflow-hidden min-w-[400px] max-w-[560px]`.trim();
    const mergedStyle = { ...style } as React.CSSProperties;

    // ESC key handler to close modal
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape' && open && onClose) {
            event.preventDefault();
            event.stopPropagation();
            onClose();
        }
    }, [open, onClose]);

    // Add/remove ESC key listener when modal opens/closes
    useEffect(() => {
        if (open) {
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [open, handleKeyDown]);

    return (
        <PAModalContext.Provider value={{ type, headerIcon }}>
            {open && (
                <Modal
                    centered
                    closeButton={false}
                    className={mergedClassName}
                    style={mergedStyle}
                    open={open}
                    onClose={onClose}
                    {...props}
                >
                    {children}
                    {buttons && buttons.length > 0 && (
                        <PAModal.Footer>
                            {buttons.map((button, index) => (
                                <Button
                                    key={index}
                                    appearance={getButtonAppearance(button.type)}
                                    color={getButtonColor(button.type)}
                                    size="md"
                                    disabled={button.disabled}
                                    loading={button.loading}
                                    className={getButtonClassName(button.type)}
                                    onClick={button.onClick}
                                >
                                    {button.icon && <span className={`${button.label ? 'mr-2' : ''} inline-flex items-center justify-center`}>{button.icon}</span>}
                                    {button.label}
                                </Button>
                            ))}
                        </PAModal.Footer>
                    )}
                </Modal>
            )}
        </PAModalContext.Provider>
    );
}

/**
 * PAModal.Title - Modal title with optional type-based icon
 */
interface PAModalTitleProps {
    children: ReactNode;
    className?: string;
}

function PAModalTitle({ children, className, ...props }: PAModalTitleProps) {
    const modalContext = useContext(PAModalContext);
    const rawIcon = modalContext?.headerIcon || (modalContext?.type ? getModalIcon(modalContext.type) : null);

    // Ensure headerIcon has a default size of 48 if it's a React element without size
    const icon = React.isValidElement(rawIcon) && !(rawIcon.props as any)?.size
        ? React.cloneElement(rawIcon, { size: 48 } as any)
        : rawIcon;

    return (
        <Modal.Title className={className} {...props}>
            <div className="flex items-center gap-2">
                {icon}
                {children}
            </div>
        </Modal.Title>
    );
}

/**
 * PAModal.Body - Modal body with consistent text styling
 */
interface PAModalBodyProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

function PAModalBody({ children, className, style, ...props }: PAModalBodyProps) {
    const mergedClassName = `text-base text-[var(--rs-text-secondary)] ${className ?? ''}`.trim();

    return (
        <Modal.Body className={mergedClassName} style={{ maxHeight: 'none', overflow: 'visible', ...style }} {...props}>
            {children}
        </Modal.Body>
    );
}

/**
 * PAModal.Footer - Modal footer with consistent layout styling
 */
interface PAModalFooterProps {
    children: ReactNode;
    className?: string;
}

function PAModalFooter({ children, className, ...props }: PAModalFooterProps) {
    const baseClassName = 'px-1 py-1 flex gap-4 justify-end items-center';
    const mergedClassName = `${baseClassName} ${className ?? ''}`.trim();

    return (
        <Modal.Footer className={mergedClassName} {...props}>
            {children}
        </Modal.Footer>
    );
}

/**
 * PAModal.Header - Modal header without close button
 */
interface PAModalHeaderProps {
    children: ReactNode;
    className?: string;
    /** Ignored - close button is always hidden in PAModal */
    closeButton?: boolean;
}

function PAModalHeader({ children, className, ...props }: PAModalHeaderProps) {
    // Extract closeButton from props to prevent it being passed to Modal.Header
    const { closeButton: _closeButton, ...restProps } = props as PAModalHeaderProps & { closeButton?: boolean };
    void _closeButton; // Explicitly mark as intentionally unused
    return (
        <Modal.Header closeButton={false} className={className} {...restProps}>
            {children}
        </Modal.Header>
    );
}

// Sub-components
PAModal.Header = PAModalHeader;
PAModal.Title = PAModalTitle;
PAModal.Body = PAModalBody;
PAModal.Footer = PAModalFooter;
