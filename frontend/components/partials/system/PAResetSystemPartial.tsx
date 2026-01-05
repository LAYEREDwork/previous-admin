import { Translations } from '@frontend/lib/translations';
import { PASize } from '@frontend/lib/types/sizes';
import { PAButton } from '@frontend/components/controls/PAButton';
import { PACard } from '@frontend/components/controls/PACard';
import { SFRestartCircle } from '@frontend/components/sf-symbols';

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
                    <div className="flex items-center gap-2 m-0 leading-none">
                        <SFRestartCircle size="lg" className="text-[var(--rs-text-error)]" />
                        <h3 className="text-lg font-semibold text-[var(--rs-text-error)] m-0">
                            {translation.system.resetTitle}
                        </h3>
                    </div>
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
