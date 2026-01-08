import { PAButton } from '@frontend/components/controls/PAButton';
import { PAModal } from '@frontend/components/controls/PAModal';
import { Translations } from '@frontend/lib/translations';
import { PAModalType } from '@frontend/lib/types/modal';
import { PASize } from '@frontend/lib/types/sizes';

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
        <PAModal
            open={open}
            onClose={onClose}
            size={PASize.sm}
            controlSize={controlSize as any}
            type={PAModalType.alert}
            className="pa-reset-modal"
        >
            <PAModal.Header><PAModal.Title>{translation.system.resetTitle}</PAModal.Title>
            </PAModal.Header>
            <PAModal.Body>
                <div className="space-y-4">
                    <p>
                        {translation.system.resetDescription}
                    </p>
                    <div className="border border-[var(--rs-message-error-border)] rounded p-3" style={{ backgroundColor: 'color-mix(in srgb, var(--rs-bg-card), var(--rs-red-500) 15%)' }}>
                        <p className="text-base font-medium break-words" style={{ color: 'color-mix(in srgb, var(--rs-red-500), white 25%)' }}>
                            {translation.system.resetWarning}
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
