import { IoDocumentText } from 'react-icons/io5';
import { Input } from 'rsuite';
import { PANeomorphButton } from '../../controls/PANeomorphButton';
import { PAModal } from '../../controls/PAModal';
import { Translations } from '../../../lib/translations';

interface NewConfigModalPartialProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    name: string;
    setName: (name: string) => void;
    description: string;
    setDescription: (desc: string) => void;
    nameRef: React.RefObject<HTMLInputElement>;
    controlSize: 'xs' |'sm' | 'md' | 'lg';
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
        >
            <PAModal.Header>
                <PAModal.Title>
                    <IoDocumentText size={32} className="inline-block mr-2 -mt-0.5" />
                    {translation.configList.newConfig}
                </PAModal.Title>
            </PAModal.Header>
            <PAModal.Body>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {translation.configEditor.configName}
                        </label>
                        <Input
                            inputRef={nameRef}
                            value={name}
                            onChange={setName}
                            placeholder={translation.configEditor.configNamePlaceholder}
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
                <PANeomorphButton
                    onClick={onClose}
                    containerBg="dark"
                    size={controlSize}
                >
                    {translation.common.cancel}
                </PANeomorphButton>
                <PANeomorphButton
                    onClick={onSave}
                    disabled={!name.trim()}
                    active={!!name.trim()}
                    containerBg="dark"
                    size={controlSize}
                >
                    {translation.common.save}
                </PANeomorphButton>
            </PAModal.Footer>
        </PAModal>
    );
}
