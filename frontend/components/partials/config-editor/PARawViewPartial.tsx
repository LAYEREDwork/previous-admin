import { BiCopy } from 'react-icons/bi';

import type { PreviousConfig } from '@shared/previous-config/types';

import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';
import { PAButton } from '../../controls/PAButton';
import { PACard } from '../../controls/PACard';

interface RawViewPartialProps {
    configData: PreviousConfig;
    convertToConfigFile: (config: PreviousConfig) => string;
    copyToClipboard: () => void;
    translation: Translations;
}

export function RawViewPartial({
    configData,
    convertToConfigFile,
    copyToClipboard,
    translation
}: RawViewPartialProps) {
    return (
        <PACard
            header={
                <div className="flex justify-between items-center w-full">
                    <h3 className="text-sm font-medium text-[var(--rs-text-secondary)] m-0 leading-none">
                        {translation.configEditor.content}
                    </h3>
                    <PAButton
                        onClick={copyToClipboard}
                        appearance="ghost"
                        size={PASize.sm}
                        className="flex items-center gap-2"
                    >
                        <BiCopy size={16} />
                        {translation.configEditor.copy}
                    </PAButton>
                </div>
            }
        >
            <pre className="font-mono text-sm text-[var(--rs-text-primary)] whitespace-pre-wrap overflow-x-auto">
                {convertToConfigFile(configData)}
            </pre>
        </PACard>
    );
}
