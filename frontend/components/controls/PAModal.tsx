import { Modal, ModalProps } from 'rsuite';
import { ReactNode } from 'react';

/**
 * PAModal - A luxury modal component with calculated corner radius.
 * PA prefix for Previous Admin.
 * 
 * The corner radius is calculated as: ButtonRadius + Padding.
 * Standard Button Radii (based on PAButton heights):
 * xs: 14px, sm: 17px, md: 20px, lg: 23px
 */

interface PAModalProps extends Omit<ModalProps, 'centered' | 'dialogStyle'> {
    children: ReactNode;
    /** The size of buttons used inside the modal to calculate corner radius */
    controlSize?: 'xs' | 'sm' | 'md' | 'lg';
    /** The distance from modal edge to content (padding) in pixels. Default is 8. */
    padding?: number;
}

export function PAModal({
    children,
    controlSize = 'md',
    padding = 6,
    ...props
}: PAModalProps) {

    const buttonRadii = {
        xs: 14,
        sm: 17,
        md: 20,
        lg: 23,
    };

    const buttonRadius = buttonRadii[controlSize];
    const modalRadius = buttonRadius + padding;

    return (
        <Modal
            centered
            dialogStyle={{
                borderRadius: `${modalRadius}px`,
                overflow: 'hidden',
                marginTop: '-10vh',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            overflow={false}
            {...props}
        >
            {children}
        </Modal>
    );
}

// Sub-components with custom styling to match the premium look
PAModal.Header = ({ children, ...props }: React.ComponentProps<typeof Modal.Header>) => (
    <Modal.Header closeButton={false} {...props} className="p-2 pb-1">
        {children}
    </Modal.Header>
);

PAModal.Title = ({ children, ...props }: any) => (
    <Modal.Title {...props} className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {children}
    </Modal.Title>
);

PAModal.Body = ({ children, ...props }: React.ComponentProps<typeof Modal.Body>) => (
    <Modal.Body {...props} className="p-2 py-1 text-gray-700 dark:text-gray-300">
        {children}
    </Modal.Body>
);

PAModal.Footer = ({ children, ...props }: React.ComponentProps<typeof Modal.Footer>) => (
    <Modal.Footer {...props} className="p-2 pt-1 pb-2">
        {children}
    </Modal.Footer>
);
