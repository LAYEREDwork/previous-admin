import { Dropdown, Input, Toggle, Button } from 'rsuite';

import type { PreviousConfig } from '@shared/previous-config/types';

import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types';
import { 
    SFCpu, 
    SFDisplay2, 
    SFHifispeaker2Fill, 
    SFKeyboardMacwindow, 
    SFRestartCircleFill, 
    SFServerRack, 
    SFWifi,
    SFChevronDown,
} from '../../sf-symbols';

import { EditorFieldPartial } from './PAEditorFieldPartial';
import { EditorSectionPartial } from './PAEditorSectionPartial';

interface EditorViewPartialProps {
    configData: PreviousConfig;
    updateConfigField: (path: string[], value: string | number | boolean) => void;
    expandedSections: Record<string, boolean>;
    setExpandedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    controlSize: PASize;
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
    const rsuiteSize = controlSize === PASize.xs ? PASize.sm : controlSize === PASize.xl ? PASize.lg : controlSize;

    return (
        <div className="grid gap-4">
            {/* System Section */}
            <EditorSectionPartial
                key="system"
                title={translation.configEditor.sections.system}
                expanded={expandedSections.system}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, system: expanded }))}
                icon={<SFCpu size={22} />}
            >
                <EditorFieldPartial label={translation.configEditor.fields.cpuType}>
                    <Dropdown
                        className="w-full"
                        title={configData.system.cpu_type}
                        onSelect={(value) => updateConfigField(['system', 'cpu_type'], value || '68030')}
                        renderToggle={(props, ref) => (
                            <Button
                                {...props}
                                ref={ref}
                                appearance="default"
                                block
                                style={{ justifyContent: 'space-between' }}
                            >
                                <span>{configData.system.cpu_type}</span>
                                <SFChevronDown size={16} />
                            </Button>
                        )}
                    >
                        <Dropdown.Item eventKey="68030" active={configData.system.cpu_type === '68030'}>68030</Dropdown.Item>
                        <Dropdown.Item eventKey="68040" active={configData.system.cpu_type === '68040'}>68040</Dropdown.Item>
                        <Dropdown.Item eventKey="68060" active={configData.system.cpu_type === '68060'}>68060</Dropdown.Item>
                    </Dropdown>
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
                        size={rsuiteSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.memorySize}>
                    <Dropdown
                        className="w-full"
                        title={configData.system.memory_size}
                        onSelect={(value) => updateConfigField(['system', 'memory_size'], value || 8)}
                        renderToggle={(props, ref) => (
                            <Button
                                {...props}
                                ref={ref}
                                appearance="default"
                                block
                                style={{ justifyContent: 'space-between' }}
                            >
                                <span>{configData.system.memory_size} MB</span>
                                <SFChevronDown size={16} />
                            </Button>
                        )}
                    >
                        <Dropdown.Item eventKey={8} active={configData.system.memory_size === 8}>8 MB</Dropdown.Item>
                        <Dropdown.Item eventKey={16} active={configData.system.memory_size === 16}>16 MB</Dropdown.Item>
                        <Dropdown.Item eventKey={32} active={configData.system.memory_size === 32}>32 MB</Dropdown.Item>
                        <Dropdown.Item eventKey={64} active={configData.system.memory_size === 64}>64 MB</Dropdown.Item>
                        <Dropdown.Item eventKey={128} active={configData.system.memory_size === 128}>128 MB</Dropdown.Item>
                        <Dropdown.Item eventKey={256} active={configData.system.memory_size === 256}>256 MB</Dropdown.Item>
                    </Dropdown>
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.turboMode}>
                    <Toggle
                        checked={configData.system.turbo}
                        onChange={(checked) => updateConfigField(['system', 'turbo'], checked)}
                        size={rsuiteSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.fpuEnabled}>
                    <Toggle
                        checked={configData.system.fpu}
                        onChange={(checked) => updateConfigField(['system', 'fpu'], checked)}
                        size={rsuiteSize}
                    />
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* Display Section */}
            <EditorSectionPartial
                key="display"
                title={translation.configEditor.sections.display}
                expanded={expandedSections.display}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, display: expanded }))}
                icon={<SFDisplay2 size={24} />}
            >
                <EditorFieldPartial label={translation.configEditor.fields.displayType}>
                    <Dropdown
                        className="w-full"
                        title={configData.display.type}
                        onSelect={(value) => updateConfigField(['display', 'type'], value || 'color')}
                        renderToggle={(props, ref) => (
                            <Button
                                {...props}
                                ref={ref}
                                appearance="default"
                                block
                                style={{ justifyContent: 'space-between' }}
                            >
                                <span>{configData.display.type === 'color' ? 'Color' : 'Monochrome'}</span>
                                <SFChevronDown size={16} />
                            </Button>
                        )}
                    >
                        <Dropdown.Item eventKey="color" active={configData.display.type === 'color'}>Color</Dropdown.Item>
                        <Dropdown.Item eventKey="monochrome" active={configData.display.type === 'monochrome'}>Monochrome</Dropdown.Item>
                    </Dropdown>
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.width}>
                    <Input
                        type="number"
                        value={configData.display.width.toString()}
                        onChange={(value) => updateConfigField(['display', 'width'], parseInt(value) || 0)}
                        step={16}
                        size={rsuiteSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.height}>
                    <Input
                        type="number"
                        value={configData.display.height.toString()}
                        onChange={(value) => updateConfigField(['display', 'height'], parseInt(value) || 0)}
                        step={16}
                        size={rsuiteSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.colorDepth}>
                    <Dropdown
                        className="w-full"
                        title={configData.display.color_depth}
                        onSelect={(value) => updateConfigField(['display', 'color_depth'], value || 2)}
                        renderToggle={(props, ref) => (
                            <Button
                                {...props}
                                ref={ref}
                                appearance="default"
                                block
                                style={{ justifyContent: 'space-between' }}
                            >
                                <span>{configData.display.color_depth}-bit</span>
                                <SFChevronDown size={16} />
                            </Button>
                        )}
                    >
                        <Dropdown.Item eventKey={2} active={configData.display.color_depth === 2}>2-bit</Dropdown.Item>
                        <Dropdown.Item eventKey={8} active={configData.display.color_depth === 8}>8-bit</Dropdown.Item>
                        <Dropdown.Item eventKey={16} active={configData.display.color_depth === 16}>16-bit</Dropdown.Item>
                        <Dropdown.Item eventKey={24} active={configData.display.color_depth === 24}>24-bit</Dropdown.Item>
                    </Dropdown>
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
                        size={rsuiteSize}
                    />
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* SCSI Section */}
            <EditorSectionPartial
                key="scsi"
                title={translation.configEditor.sections.scsi}
                expanded={expandedSections.scsi}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, scsi: expanded }))}
                icon={<SFServerRack size={22} />}
            >
                {['hd0', 'hd1', 'hd2', 'hd3', 'hd4', 'hd5', 'hd6'].map((hd) => (
                    <EditorFieldPartial key={hd} label={`${translation.configEditor.fields.scsiHd} ${hd.toUpperCase()}`}>
                        <Input
                            value={configData.scsi[hd as keyof typeof configData.scsi]}
                            onChange={(value) => updateConfigField(['scsi', hd], value)}
                            placeholder={translation.configEditor.fields.pathToDiskImage}
                            size={rsuiteSize}
                        />
                    </EditorFieldPartial>
                ))}

                <EditorFieldPartial label={translation.configEditor.fields.cdRom}>
                    <Input
                        value={configData.scsi.cd}
                        onChange={(value) => updateConfigField(['scsi', 'cd'], value)}
                        placeholder={translation.configEditor.fields.pathToCdImage}
                        size={rsuiteSize}
                    />
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* Network Section */}
            <EditorSectionPartial
                key="network"
                title={translation.configEditor.sections.network}
                expanded={expandedSections.network}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, network: expanded }))}
                icon={<SFWifi size={22} />}
            >
                <EditorFieldPartial label={translation.configEditor.fields.networkEnabled}>
                    <Toggle
                        checked={configData.network.enabled}
                        onChange={(checked) => updateConfigField(['network', 'enabled'], checked)}
                        size={rsuiteSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.networkType}>
                    <Dropdown
                        className="w-full"
                        title={configData.network.type}
                        onSelect={(value) => updateConfigField(['network', 'type'], value || 'ethernet')}
                        disabled={!configData.network.enabled}
                        renderToggle={(props, ref) => (
                            <Button
                                {...props}
                                ref={ref}
                                appearance="default"
                                block
                                style={{ justifyContent: 'space-between' }}
                            >
                                <span>{configData.network.type === 'ethernet' ? 'Ethernet' : 'SLIRP'}</span>
                                <SFChevronDown size={16} />
                            </Button>
                        )}
                    >
                        <Dropdown.Item eventKey="ethernet" active={configData.network.type === 'ethernet'}>Ethernet</Dropdown.Item>
                        <Dropdown.Item eventKey="slirp" active={configData.network.type === 'slirp'}>SLIRP</Dropdown.Item>
                    </Dropdown>
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* Sound Section */}
            <EditorSectionPartial
                key="sound"
                title={translation.configEditor.sections.sound}
                expanded={expandedSections.sound}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, sound: expanded }))}
                icon={<SFHifispeaker2Fill size={22} />}
            >
                <EditorFieldPartial label={translation.configEditor.fields.soundEnabled}>
                    <Toggle
                        checked={configData.sound.enabled}
                        onChange={(checked) => updateConfigField(['sound', 'enabled'], checked)}
                        size={rsuiteSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.soundOutput}>
                    <Dropdown
                        className="w-full"
                        title={configData.sound.output}
                        onSelect={(value) => updateConfigField(['sound', 'output'], value || 'sdl')}
                        disabled={!configData.sound.enabled}
                        renderToggle={(props, ref) => (
                            <Button
                                {...props}
                                ref={ref}
                                appearance="default"
                                block
                                style={{ justifyContent: 'space-between' }}
                            >
                                <span>{configData.sound.output.toUpperCase()}</span>
                                <SFChevronDown size={16} />
                            </Button>
                        )}
                    >
                        <Dropdown.Item eventKey="sdl" active={configData.sound.output === 'sdl'}>SDL</Dropdown.Item>
                        <Dropdown.Item eventKey="portaudio" active={configData.sound.output === 'portaudio'}>PortAudio</Dropdown.Item>
                        <Dropdown.Item eventKey="none" active={configData.sound.output === 'none'}>None</Dropdown.Item>
                    </Dropdown>
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* Boot Section */}
            <EditorSectionPartial
                key="boot"
                title={translation.configEditor.sections.boot}
                expanded={expandedSections.boot}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, boot: expanded }))}
                icon={<SFRestartCircleFill size={22} />}
            >
                <EditorFieldPartial label={translation.configEditor.fields.romFile}>
                    <Input
                        value={configData.boot.rom_file}
                        onChange={(value) => updateConfigField(['boot', 'rom_file'], value)}
                        placeholder={translation.configEditor.fields.pathToRomFile}
                        size={rsuiteSize}
                    />
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.bootScsiId}>
                    <Dropdown
                        className="w-full"
                        title={configData.boot.scsi_id}
                        onSelect={(value) => updateConfigField(['boot', 'scsi_id'], value || 0)}
                        renderToggle={(props, ref) => (
                            <Button
                                {...props}
                                ref={ref}
                                appearance="default"
                                block
                                style={{ justifyContent: 'space-between' }}
                            >
                                <span>SCSI ID {configData.boot.scsi_id}</span>
                                <SFChevronDown size={16} />
                            </Button>
                        )}
                    >
                        <Dropdown.Item eventKey={0} active={configData.boot.scsi_id === 0}>SCSI ID 0</Dropdown.Item>
                        <Dropdown.Item eventKey={1} active={configData.boot.scsi_id === 1}>SCSI ID 1</Dropdown.Item>
                        <Dropdown.Item eventKey={2} active={configData.boot.scsi_id === 2}>SCSI ID 2</Dropdown.Item>
                        <Dropdown.Item eventKey={3} active={configData.boot.scsi_id === 3}>SCSI ID 3</Dropdown.Item>
                        <Dropdown.Item eventKey={4} active={configData.boot.scsi_id === 4}>SCSI ID 4</Dropdown.Item>
                        <Dropdown.Item eventKey={5} active={configData.boot.scsi_id === 5}>SCSI ID 5</Dropdown.Item>
                        <Dropdown.Item eventKey={6} active={configData.boot.scsi_id === 6}>SCSI ID 6</Dropdown.Item>
                    </Dropdown>
                </EditorFieldPartial>
            </EditorSectionPartial>

            {/* Input Section */}
            <EditorSectionPartial
                key="input"
                title={translation.configEditor.sections.input}
                expanded={expandedSections.input}
                onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, input: expanded }))}
                icon={<SFKeyboardMacwindow size={22} />}
            >
                <EditorFieldPartial label={translation.configEditor.fields.keyboardType}>
                    <Dropdown
                        className="w-full"
                        title={configData.keyboard.type}
                        onSelect={(value) => updateConfigField(['keyboard', 'type'], value || 'us')}
                        renderToggle={(props, ref) => (
                            <Button
                                {...props}
                                ref={ref}
                                appearance="default"
                                block
                                style={{ justifyContent: 'space-between' }}
                            >
                                <span>{configData.keyboard.type.toUpperCase()}</span>
                                <SFChevronDown size={16} />
                            </Button>
                        )}
                    >
                        <Dropdown.Item eventKey="us" active={configData.keyboard.type === 'us'}>US</Dropdown.Item>
                        <Dropdown.Item eventKey="de" active={configData.keyboard.type === 'de'}>German</Dropdown.Item>
                        <Dropdown.Item eventKey="fr" active={configData.keyboard.type === 'fr'}>French</Dropdown.Item>
                        <Dropdown.Item eventKey="uk" active={configData.keyboard.type === 'uk'}>UK</Dropdown.Item>
                    </Dropdown>
                </EditorFieldPartial>

                <EditorFieldPartial label={translation.configEditor.fields.mouseEnabled}>
                    <Toggle
                        checked={configData.mouse.enabled}
                        onChange={(checked) => updateConfigField(['mouse', 'enabled'], checked)}
                        size={rsuiteSize}
                    />
                </EditorFieldPartial>
            </EditorSectionPartial>
        </div>
    );
}
