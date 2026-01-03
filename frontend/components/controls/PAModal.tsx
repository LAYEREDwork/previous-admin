import { ReactNode } from 'react';
import { Modal, ModalProps } from 'rsuite';

/**
 * PAModal - Now using standard RSuite Modal.
 */

interface PAModalProps extends ModalProps {
    children: ReactNode;
    controlSize?: any;
}

export function PAModal({
    children,
    ...props
}: PAModalProps) {
    return (
        <Modal
            centered
            closeButton={false}
            {...props}
        >
            {children}
        </Modal>
    );
}

// Sub-components
PAModal.Header = Modal.Header;
PAModal.Title = Modal.Title;
PAModal.Body = Modal.Body;
PAModal.Footer = Modal.Footer;
