import { SFDocumentBadgePlusFill } from '../../sf-symbols/SFDocumentBadgePlusFill';
import { useEffect } from 'react';
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

export function PANewConfigModalPartial({
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
    // Focus on name input when modal opens
    useEffect(() => {
        if (open && nameRef.current) {
            // Use setTimeout to ensure the focus happens after modal is rendered
            setTimeout(() => {
                nameRef.current?.focus();
            }, 100);
        }
    }, [open, nameRef]);
    return (
        <PAModal
            open={open}
            onClose={onClose}
            size={PASize.sm}
            controlSize={controlSize as any}
            style={{ minHeight: '400px' }}
        >
            <PAModal.Header closeButton={false}>
                <PAModal.Title>
                    <SFDocumentBadgePlusFill size={32} className="inline-block mr-2 -mt-0.5" />
                    {translation.configList.createNew}
                </PAModal.Title>
            </PAModal.Header>
            <PAModal.Body>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--rs-text-secondary)] mb-2">
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
                        <label className="block text-sm font-medium text-[var(--rs-text-secondary)] mb-2">
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
