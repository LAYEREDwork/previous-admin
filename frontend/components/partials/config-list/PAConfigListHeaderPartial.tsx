import { PAButton } from '@frontend/components/controls/PAButton';
import { SFDocumentBadgePlusFill } from 'sf-symbols-lib';

import { Translations } from '@frontend/lib/translations';
import { PASize } from '@frontend/lib/types/sizes';

interface ConfigListHeaderPartialProps {
    onNewConfigClick: () => void;
    controlSize: PASize;
    translation: Translations;
}

export function PAConfigListHeaderPartial({
    onNewConfigClick,
    controlSize,
    translation
}: ConfigListHeaderPartialProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-sm sm:text-base font-semibold text-[var(--rs-text-primary)]">
                {translation.configList.title}
            </h2>
            <PAButton
                onClick={onNewConfigClick}
                icon={<SFDocumentBadgePlusFill size={22} />}
                size={controlSize}
                appearance="primary"
                className="self-end sm:self-auto"
            >
                {translation.configList.createNew}
            </PAButton>
        </div>
    );
}
