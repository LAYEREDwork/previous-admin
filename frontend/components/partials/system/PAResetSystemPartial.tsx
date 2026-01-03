import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';
import { PAButton } from '../../controls/PAButton';
import { PACard } from '../../controls/PACard';

interface ResetSystemPartialProps {
    onResetClick: () => void;
    isResetting: boolean;
    controlSize: PASize;
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
            <PACard
                header={
                    <h3 className="text-lg font-semibold text-[var(--rs-text-error)] m-0 leading-none">
                        {translation.system.resetTitle}
                    </h3>
                }
                bgColorScheme="danger"
            >
                <div className="space-y-4">
                    <p className="text-sm text-[var(--rs-text-error)]">
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
            </PACard>
        </div>
    );
}
