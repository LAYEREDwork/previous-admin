import { Modal, ModalProps } from 'rsuite';
import { ReactNode } from 'react';

/**
 * Custom Modal Component
 * 
 * Vorkonfiguriertes Modal mit:
 * - Vertikaler und horizontaler Zentrierung
 * - Abgerundeten Ecken (1rem)
 * - Deaktiviertem Close-Button
 */

interface CenteredModalProps extends Omit<ModalProps, 'centered' | 'dialogStyle'> {
  children: ReactNode;
}

export function CenteredModal({ children, ...props }: CenteredModalProps) {
  return (
    <Modal
      centered
      dialogStyle={{ borderRadius: '1rem', overflow: 'visible', marginTop: '-15vh' }}
      overflow={false}
      {...props}
    >
      {children}
    </Modal>
  );
}

// Exportiere die Unterkomponenten mit deaktiviertem Close-Button
CenteredModal.Header = ({ children, ...props }: React.ComponentProps<typeof Modal.Header>) => (
  <Modal.Header closeButton={false} {...props}>
    {children}
  </Modal.Header>
);

CenteredModal.Title = Modal.Title;
CenteredModal.Body = Modal.Body;
CenteredModal.Footer = Modal.Footer;
