import { BiPlus } from 'react-icons/bi';
import { PANeomorphButton } from '../../controls/PANeomorphButton';
import { PANeomorphControlShape } from '../../../lib/utils/styling';
import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';

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
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {translation.configList.title}
            </h2>
            <PANeomorphButton
                onClick={onNewConfigClick}
                icon={<BiPlus size={18} />}
                size={controlSize}
                className="self-end sm:self-auto"
                color='primary'
                shape={PANeomorphControlShape.rect}
            >
                {translation.configList.createNew}
            </PANeomorphButton>
        </div>
    );
}
