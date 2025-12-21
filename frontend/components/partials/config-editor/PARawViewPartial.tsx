import { BiCopy } from 'react-icons/bi';
import { PAButton } from '../../controls/PAButton';
import { Translations } from '../../../lib/translations';
import { PreviousConfig } from '../../../lib/types';

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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {translation.configEditor.content}
                </h3>
                <PAButton
                    onClick={copyToClipboard}
                    appearance="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <BiCopy size={16} />
                    {translation.configEditor.copy}
                </PAButton>
            </div>
            <pre className="font-mono text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap overflow-x-auto">
                {convertToConfigFile(configData)}
            </pre>
        </div>
    );
}
