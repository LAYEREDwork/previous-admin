import { PAButton } from '../../controls/PAButton';
import { PAModal } from '../../controls/PAModal';
import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';

interface ResetModalPartialProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isResetting: boolean;
    controlSize: PASize;
    translation: Translations;
}

export function ResetModalPartial({
    open,
    onClose,
    onConfirm,
    isResetting,
    controlSize,
    translation
}: ResetModalPartialProps) {
    return (
        <PAModal open={open} onClose={onClose} size={PASize.sm} controlSize={controlSize as any}>
            <PAModal.Header>
                <PAModal.Title>{translation.system.resetTitle}</PAModal.Title>
            </PAModal.Header>
            <PAModal.Body>
                <div className="space-y-4">
                    <p className="text-sm text-[var(--rs-text-secondary)]">
                        {translation.system.resetDescription}
                    </p>
                    <div className="border border-[var(--rs-border-error)] rounded p-3" style={{ backgroundColor: 'color-mix(in srgb, var(--rs-border-error), transparent 92%)' }}>
                        <p className="text-sm text-[var(--rs-text-error)] font-medium">
                            ⚠️ {translation.system.resetWarning}
                        </p>
                    </div>
                </div>
            </PAModal.Body>
            <PAModal.Footer>
                <PAButton
                    onClick={onClose}
                    appearance="default"
                    disabled={isResetting}
                    size={controlSize}
                >
                    {translation.common.cancel}
                </PAButton>
                <PAButton
                    onClick={onConfirm}
                    appearance="primary"
                    color="red"
                    loading={isResetting}
                    disabled={isResetting}
                    size={controlSize}
                >
                    {isResetting ? translation.system.resetting : translation.system.resetConfirm}
                </PAButton>
            </PAModal.Footer>
        </PAModal>
    );
}
