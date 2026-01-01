import { IoDocumentText } from 'react-icons/io5';
import { Input } from 'rsuite';
import { PAButton } from '../../controls/PAButton';
import { PAModal } from '../../controls/PAModal';
import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';

interface NewConfigModalPartialProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    name: string;
    setName: (name: string) => void;
    description: string;
    setDescription: (desc: string) => void;
    nameRef: React.RefObject<HTMLInputElement>;
    controlSize: PASize;
    translation: Translations;
}

export function NewConfigModalPartial({
    open,
    onClose,
    onSave,
    name,
    setName,
    description,
    setDescription,
    nameRef,
    controlSize,
    translation
}: NewConfigModalPartialProps) {
    return (
        <PAModal
            open={open}
            onClose={onClose}
            size="sm"
            controlSize={controlSize as any}
            style={{ minHeight: '400px' }}
        >
            <PAModal.Header closeButton={false}>
                <PAModal.Title>
                    <IoDocumentText size={32} className="inline-block mr-2 -mt-0.5" />
                    {translation.configList.createNew}
                </PAModal.Title>
            </PAModal.Header>
            <PAModal.Body>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {translation.configEditor.configurationNameLabel}
                        </label>
                        <Input
                            inputRef={nameRef}
                            value={name}
                            onChange={setName}
                            placeholder={translation.configEditor.configurationNamePlaceholder}
                            size={controlSize}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {translation.configList.description}
                        </label>
                        <Input
                            as="textarea"
                            value={description}
                            onChange={setDescription}
                            rows={3}
                            placeholder={translation.configList.description}
                            size={controlSize}
                        />
                    </div>
                </div>
            </PAModal.Body>
            <PAModal.Footer>
                <PAButton
                    onClick={onClose}
                    size={controlSize}
                >
                    {translation.common.cancel}
                </PAButton>
                <PAButton
                    onClick={onSave}
                    disabled={!name.trim()}
                    size={controlSize}
                    appearance={name.trim() ? "primary" : "default"}
                >
                    {translation.common.save}
                </PAButton>
            </PAModal.Footer>
        </PAModal>
    );
}
