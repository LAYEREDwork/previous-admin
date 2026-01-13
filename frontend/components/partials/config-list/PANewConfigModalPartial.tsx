import { useEffect } from 'react';
import { Input } from 'rsuite';

import { PAModal } from '@frontend/components/controls/PAModal';
import { SFDocumentBadgePlusFill } from 'sf-symbols-lib';
import { Translations } from '@frontend/lib/translations';
import { PAModalButton, PAModalButtonType } from '@frontend/lib/types/modal';
import { PASize } from '@frontend/lib/types/sizes';

interface NewConfigModalPartialProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    name: string;
    setName: (name: string) => void;
    description: string;
    setDescription: (desc: string) => void;
    nameRef: React.RefObject<HTMLInputElement | null>;
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

    const cancelButton: PAModalButton = {
        label: translation.common.cancel,
        onClick: onClose,
        type: PAModalButtonType.cancel,
    };

    const saveButton: PAModalButton = {
        label: translation.common.save,
        onClick: onSave,
        type: PAModalButtonType.default,
        disabled: !name.trim(),
    };

    const buttons: PAModalButton[] = [cancelButton, saveButton];

    return (
        <PAModal
            open={open}
            onClose={onClose}
            size={PASize.sm}
            controlSize={controlSize as any}
            headerIcon={<SFDocumentBadgePlusFill />}
            buttons={buttons}
        >
            <PAModal.Header closeButton={false}>
                <PAModal.Title>
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
        </PAModal>
    );
}
