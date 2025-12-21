import { PAButton } from '../../controls/PAButton';
import { PAModal } from '../../controls/PAModal';
import { Translations } from '../../../lib/translations';

interface ResetModalPartialProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isResetting: boolean;
    controlSize: 'sm' | 'md' | 'lg';
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
        <PAModal open={open} onClose={onClose} size="sm" controlSize={controlSize as any}>
            <PAModal.Header>
                <PAModal.Title>{translation.system.resetTitle}</PAModal.Title>
            </PAModal.Header>
            <PAModal.Body>
                <div className="space-y-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {translation.system.resetDescription}
                    </p>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                        <p className="text-sm text-red-800 dark:text-red-200 font-medium">
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
