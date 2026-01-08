import { createContext, ReactNode, useContext } from 'react';
import { Modal, ModalProps } from 'rsuite';

import {
    SFCheckmarkBubbleFill,
    SFExclamationmarkBubbleFill,
    SFInfoBubbleFill
} from '@frontend/components/sf-symbols';
import { PAModalType } from '@frontend/lib/types/modal';

/**
 * Context to pass modal type to sub-components
 */
const PAModalContext = createContext<PAModalType | undefined>(undefined);

/**
 * Icon size constant for modal title icons
 */
const MODAL_ICON_SIZE = 42;

/**
 * Icon class name for consistent styling
 */
const MODAL_ICON_CLASS = 'inline-block mr-3 -mt-0.5';

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

interface PAModalProps extends ModalProps {
    children: ReactNode;
    controlSize?: any;
    /** Modal type determines the icon shown in the title */
    type?: PAModalType;
}

/**
 * PAModal - Enhanced RSuite Modal with type-based icons and consistent styling
 */
export function PAModal({
    children,
    className,
    style,
    type,
    ...props
}: PAModalProps) {
    // Apply slightly larger border radius and ensure overflow is hidden so content
    // cannot visually overlap rounded corners. We keep any incoming className/style.
    const mergedClassName = `${className ?? ''} rounded-lg overflow-hidden`.trim();
    const mergedStyle = { ...style } as React.CSSProperties;

    return (
        <PAModalContext.Provider value={type}>
            <Modal
                centered
                closeButton={false}
                className={mergedClassName}
                style={mergedStyle}
                {...props}
            >
                {children}
            </Modal>
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
    const modalType = useContext(PAModalContext);
    const icon = modalType ? getModalIcon(modalType) : null;

    return (
        <Modal.Title className={className} {...props}>
            {icon}
            {children}
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
