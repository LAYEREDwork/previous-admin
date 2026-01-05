import { Input } from 'rsuite';

import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';
import { PAButton } from '../../controls/PAButton';
import { PACard } from '../../controls/PACard';
import { SFLongTextPageAndPencilFill, SFSquareAndArrowDownFill } from '@frontend/components/sf-symbols';

interface ConfigDetailsPartialProps {
    localName: string;
    setLocalName: (name: string) => void;
    localDescription: string;
    setLocalDescription: (desc: string) => void;
    hasChanges: boolean;
    handleUpdateMetadata: () => void;
    controlSize: PASize;
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
    const rsuiteSize = controlSize === PASize.xs ? PASize.sm : controlSize;

    return (
        <PACard
            header={
                <h3 className="text-lg font-semibold text-[var(--rs-text-primary)] leading-none m-0 flex items-center gap-2">
                    <SFLongTextPageAndPencilFill size={26} />
                    {translation.configEditor.configurationDetailsTitle}
                </h3>
            }
        >
            <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-[var(--rs-text-secondary)] mb-2">
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
                        <label className="text-sm font-medium text-[var(--rs-text-secondary)] mb-2">
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
                        <SFSquareAndArrowDownFill size={18} />
                        {translation.configEditor.saveMetadata}
                    </PAButton>
                </div>
            </div>
        </PACard>
    );
}
