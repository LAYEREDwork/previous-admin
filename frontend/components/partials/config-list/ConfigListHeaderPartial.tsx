import { BiPlus } from 'react-icons/bi';
import { PAButton } from '../../controls/PAButton';
import { Translations } from '../../../lib/translations';

interface ConfigListHeaderPartialProps {
    onNewConfigClick: () => void;
    controlSize: 'sm' | 'md' | 'lg';
    translation: Translations;
}

export function ConfigListHeaderPartial({
    onNewConfigClick,
    controlSize,
    translation
}: ConfigListHeaderPartialProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {translation.configList.title}
            </h2>
            <PAButton
                onClick={onNewConfigClick}
                appearance="primary"
                className="flex items-center gap-2"
                size={controlSize}
            >
                <BiPlus size={18} />
                {translation.configList.newConfig}
            </PAButton>
        </div>
    );
}
