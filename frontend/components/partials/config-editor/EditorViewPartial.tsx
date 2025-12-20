import { SelectPicker, Input, Toggle } from 'rsuite';
import { EditorSectionPartial } from './EditorSectionPartial';
import { EditorFieldPartial } from './EditorFieldPartial';
import { PreviousConfig } from '../../../lib/types';
import { Translations } from '../../../lib/translations';

interface EditorViewPartialProps {
    configData: PreviousConfig;
    updateConfigField: (path: string[], value: string | number | boolean) => void;
    expandedSections: Record<string, boolean>;
    setExpandedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    controlSize: 'sm' | 'md' | 'lg';
    translation: Translations;
}

export function EditorViewPartial({
    configData,
    updateConfigField,
    expandedSections,
    setExpandedSections,
    controlSize,
    translation
}: EditorViewPartialProps) {
    return (
        <div className="grid gap-6">
            {/* System Section */}
            <EditorSectionPartial
                key="system"
                title={translation.configEditor.sections.system}
                expanded={expandedSections.system}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, system: expanded }))}
            >
                <EditorFieldPartial label={translation.configEditor.fields.cpuType}>
                    <SelectPicker
                        data={[
                            { label: '68030', value: '68030' },
                            { label: '68040', value: '68040' },
                            { label: '68060', value: '68060' },
                        ]}
                        value={configData.system.cpu_type}
                        onChange={(value) => updateConfigField(['system', 'cpu_type'], value || '68030')}
                        block
                        searchable={false}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.cpuFrequency}>
                    <Input
                        type="number"
                        value={configData.system.cpu_frequency.toString()}
                        onChange={(value) =>
                            updateConfigField(['system', 'cpu_frequency'], parseInt(value) || 0)
                        }
                        min={1}
                        max={100}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.memorySize}>
                    <SelectPicker
                        data={[
                            { label: '8 MB', value: 8 },
                            { label: '16 MB', value: 16 },
                            { label: '32 MB', value: 32 },
                            { label: '64 MB', value: 64 },
                            { label: '128 MB', value: 128 },
                            { label: '256 MB', value: 256 },
                        ]}
                        value={configData.system.memory_size}
                        onChange={(value) =>
                            updateConfigField(['system', 'memory_size'], value || 8)
                        }
                        block
                        searchable={false}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.turboMode}>
                    <Toggle
                        checked={configData.system.turbo}
                        onChange={(checked) => updateConfigField(['system', 'turbo'], checked)}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.fpuEnabled}>
                    <Toggle
                        checked={configData.system.fpu}
                        onChange={(checked) => updateConfigField(['system', 'fpu'], checked)}
                        size={controlSize}
                    />
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* Display Section */}
            <EditorSectionPartial
                key="display"
                title={translation.configEditor.sections.display}
                expanded={expandedSections.display}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, display: expanded }))}
            >
                <EditorFieldPartial label={translation.configEditor.fields.displayType}>
                    <SelectPicker
                        data={[
                            { label: 'Color', value: 'color' },
                            { label: 'Monochrome', value: 'monochrome' },
                        ]}
                        value={configData.display.type}
                        onChange={(value) => updateConfigField(['display', 'type'], value || 'color')}
                        block
                        searchable={false}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.width}>
                    <Input
                        type="number"
                        value={configData.display.width.toString()}
                        onChange={(value) => updateConfigField(['display', 'width'], parseInt(value) || 0)}
                        step={16}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.height}>
                    <Input
                        type="number"
                        value={configData.display.height.toString()}
                        onChange={(value) => updateConfigField(['display', 'height'], parseInt(value) || 0)}
                        step={16}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.colorDepth}>
                    <SelectPicker
                        data={[
                            { label: '2-bit', value: 2 },
                            { label: '8-bit', value: 8 },
                            { label: '16-bit', value: 16 },
                            { label: '24-bit', value: 24 },
                        ]}
                        value={configData.display.color_depth}
                        onChange={(value) =>
                            updateConfigField(['display', 'color_depth'], value || 2)
                        }
                        block
                        searchable={false}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.frameSkip}>
                    <Input
                        type="number"
                        value={configData.display.frameskip.toString()}
                        onChange={(value) =>
                            updateConfigField(['display', 'frameskip'], parseInt(value) || 0)
                        }
                        min={0}
                        max={8}
                        size={controlSize}
                    />
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* SCSI Section */}
            <EditorSectionPartial
                key="scsi"
                title={translation.configEditor.sections.scsi}
                expanded={expandedSections.scsi}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, scsi: expanded }))}
            >
                {['hd0', 'hd1', 'hd2', 'hd3', 'hd4', 'hd5', 'hd6'].map((hd) => (
                    <EditorFieldPartial key={hd} label={`${translation.configEditor.fields.scsiHd} ${hd.toUpperCase()}`}>
                        <Input
                            value={configData.scsi[hd as keyof typeof configData.scsi]}
                            onChange={(value) => updateConfigField(['scsi', hd], value)}
                            placeholder={translation.configEditor.fields.pathToDiskImage}
                            size={controlSize}
                        />
                    </EditorFieldPartial>
                ))}

                <EditorFieldPartial label={translation.configEditor.fields.cdRom}>
                    <Input
                        value={configData.scsi.cd}
                        onChange={(value) => updateConfigField(['scsi', 'cd'], value)}
                        placeholder={translation.configEditor.fields.pathToCdImage}
                        size={controlSize}
                    />
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* Network Section */}
            <EditorSectionPartial
                key="network"
                title={translation.configEditor.sections.network}
                expanded={expandedSections.network}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, network: expanded }))}
            >
                <EditorFieldPartial label={translation.configEditor.fields.networkEnabled}>
                    <Toggle
                        checked={configData.network.enabled}
                        onChange={(checked) => updateConfigField(['network', 'enabled'], checked)}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.networkType}>
                    <SelectPicker
                        data={[
                            { label: 'Ethernet', value: 'ethernet' },
                            { label: 'SLIRP', value: 'slirp' },
                        ]}
                        value={configData.network.type}
                        onChange={(value) => updateConfigField(['network', 'type'], value || 'ethernet')}
                        disabled={!configData.network.enabled}
                        block
                        searchable={false}
                        size={controlSize}
                    />
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* Sound Section */}
            <EditorSectionPartial
                key="sound"
                title={translation.configEditor.sections.sound}
                expanded={expandedSections.sound}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, sound: expanded }))}
            >
                <EditorFieldPartial label={translation.configEditor.fields.soundEnabled}>
                    <Toggle
                        checked={configData.sound.enabled}
                        onChange={(checked) => updateConfigField(['sound', 'enabled'], checked)}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.soundOutput}>
                    <SelectPicker
                        data={[
                            { label: 'SDL', value: 'sdl' },
                            { label: 'PortAudio', value: 'portaudio' },
                            { label: 'None', value: 'none' },
                        ]}
                        value={configData.sound.output}
                        onChange={(value) => updateConfigField(['sound', 'output'], value || 'sdl')}
                        disabled={!configData.sound.enabled}
                        block
                        searchable={false}
                        size={controlSize}
                    />
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* Boot Section */}
            <EditorSectionPartial
                key="boot"
                title={translation.configEditor.sections.boot}
                expanded={expandedSections.boot}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, boot: expanded }))}
            >
                <EditorFieldPartial label={translation.configEditor.fields.romFile}>
                    <Input
                        value={configData.boot.rom_file}
                        onChange={(value) => updateConfigField(['boot', 'rom_file'], value)}
                        placeholder={translation.configEditor.fields.pathToRomFile}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.bootScsiId}>
                    <SelectPicker
                        data={[0, 1, 2, 3, 4, 5, 6].map((id) => ({
                            label: `SCSI ID ${id}`,
                            value: id,
                        }))}
                        value={configData.boot.scsi_id}
                        onChange={(value) => updateConfigField(['boot', 'scsi_id'], value || 0)}
                        block
                        searchable={false}
                        size={controlSize}
                    />
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* Input Section */}
            <EditorSectionPartial
                key="input"
                title={translation.configEditor.sections.input}
                expanded={expandedSections.input}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, input: expanded }))}
            >
                <EditorFieldPartial label={translation.configEditor.fields.keyboardType}>
                    <SelectPicker
                        data={[
                            { label: 'US', value: 'us' },
                            { label: 'German', value: 'de' },
                            { label: 'French', value: 'fr' },
                            { label: 'UK', value: 'uk' },
                        ]}
                        value={configData.keyboard.type}
                        onChange={(value) => updateConfigField(['keyboard', 'type'], value || 'us')}
                        block
                        searchable={false}
                        size={controlSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.mouseEnabled}>
                    <Toggle
                        checked={configData.mouse.enabled}
                        onChange={(checked) => updateConfigField(['mouse', 'enabled'], checked)}
                        size={controlSize}
                    />
                </EditorFieldPartial>
            </EditorSectionPartial>
        </div>
    );
}
