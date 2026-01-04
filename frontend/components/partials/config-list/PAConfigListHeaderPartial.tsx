import { SFDocumentBadgePlusFill } from '@frontend/components/sf-symbols';

import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';
import { PAButton } from '../../controls/PAButton';

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
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--rs-text-primary)]">
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
