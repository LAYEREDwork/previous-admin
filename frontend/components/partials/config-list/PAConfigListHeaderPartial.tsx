import { BiPlus } from 'react-icons/bi';
import { PASkeuomorphButton, PASkeuomorphButtonShape } from '../../controls/PASkeuomorphButton';
import { Translations } from '../../../lib/translations';

interface ConfigListHeaderPartialProps {
    onNewConfigClick: () => void;
    controlSize: 'xs' | 'sm' | 'md' | 'lg';
    translation: Translations;
}

export function PAConfigListHeaderPartial({
    onNewConfigClick,
    controlSize,
    translation
}: ConfigListHeaderPartialProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {translation.configList.title}
            </h2>
            <PASkeuomorphButton
                onClick={onNewConfigClick}
                icon={<BiPlus size={18} />}
                size={controlSize}
                className="self-end sm:self-auto"
                color='primary'
            >
                {translation.configList.newConfig}
            </PASkeuomorphButton>
        </div>
    );
}
