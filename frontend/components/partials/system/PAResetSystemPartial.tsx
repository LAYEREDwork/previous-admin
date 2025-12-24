import { PAButton } from '../../controls/PAButton';
import { Translations } from '../../../lib/translations';

interface ResetSystemPartialProps {
    onResetClick: () => void;
    isResetting: boolean;
    controlSize: 'xs' | 'sm' | 'md' | 'lg';
    translation: Translations;
}

export function ResetSystemPartial({
    onResetClick,
    isResetting,
    controlSize,
    translation
}: ResetSystemPartialProps) {
    return (
        <div className="mt-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                    {translation.system.resetTitle}
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                    {translation.system.resetDescription}
                </p>
                <div className="flex justify-end">
                    <PAButton
                        onClick={onResetClick}
                        appearance="primary"
                        color="red"
                        disabled={isResetting}
                        loading={isResetting}
                        size={controlSize}
                    >
                        {translation.system.reset}
                    </PAButton>
                </div>
            </div>
        </div>
    );
}
