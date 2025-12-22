import { BiSave } from 'react-icons/bi';
import { Input } from 'rsuite';
import { PAButton } from '../../controls/PAButton';
import { Translations } from '../../../lib/translations';

interface ConfigDetailsPartialProps {
    localName: string;
    setLocalName: (name: string) => void;
    localDescription: string;
    setLocalDescription: (desc: string) => void;
    hasChanges: boolean;
    handleUpdateMetadata: () => void;
    controlSize: 'xs' | 'sm' | 'md' | 'lg';
    translation: Translations;
}

export function ConfigDetailsPartial({
    localName,
    setLocalName,
    localDescription,
    setLocalDescription,
    hasChanges,
    handleUpdateMetadata,
    controlSize,
    translation
}: ConfigDetailsPartialProps) {
    const rsuiteSize = controlSize === 'xs' ? 'sm' : controlSize;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {translation.configEditor.configurationDetailsTitle}
            </h3>

            <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {translation.configEditor.configurationNameLabel}
                        </label>
                        <Input
                            value={localName}
                            onChange={setLocalName}
                            size={rsuiteSize}
                            placeholder={translation.configEditor.configurationNamePlaceholder}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {translation.configEditor.descriptionLabel}
                        </label>
                        <Input
                            value={localDescription}
                            onChange={setLocalDescription}
                            size={rsuiteSize}
                            placeholder={translation.configEditor.configurationDescriptionPlaceholder}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <PAButton
                        onClick={handleUpdateMetadata}
                        disabled={!hasChanges}
                        appearance="primary"
                        size={controlSize}
                        className="flex items-center gap-2"
                    >
                        <BiSave size={16} />
                        {translation.configEditor.saveMetadata}
                    </PAButton>
                </div>
            </div>
        </div>
    );
}
