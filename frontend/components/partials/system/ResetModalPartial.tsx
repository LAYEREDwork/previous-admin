import { Button } from 'rsuite';
import { CenteredModal } from '../../controls/CenteredModal';
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
        <CenteredModal open={open} onClose={onClose} size="sm">
            <CenteredModal.Header>
                <CenteredModal.Title>{translation.system.resetTitle}</CenteredModal.Title>
            </CenteredModal.Header>
            <CenteredModal.Body>
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
            </CenteredModal.Body>
            <CenteredModal.Footer>
                <Button
                    onClick={onClose}
                    appearance="default"
                    disabled={isResetting}
                    size={controlSize}
                >
                    {translation.common.cancel}
                </Button>
                <Button
                    onClick={onConfirm}
                    appearance="primary"
                    color="red"
                    loading={isResetting}
                    disabled={isResetting}
                    size={controlSize}
                >
                    {isResetting ? translation.system.resetting : translation.system.resetConfirm}
                </Button>
            </CenteredModal.Footer>
        </CenteredModal>
    );
}
