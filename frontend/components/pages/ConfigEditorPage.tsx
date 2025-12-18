import { BiSave, BiCopy, BiRefresh } from 'react-icons/bi';
import { Button, Input, SelectPicker, Toggle } from 'rsuite';
import { AnimatedSegmentedControl } from '../controls/AnimatedSegmentedControl';
import { useControlSize } from '../../hooks/useControlSize';
import { useConfigEditor } from '../../hooks/useConfigEditor';

export function ConfigEditor() {
  const {
    config,
    configData,
    loading,
    error,
    saving,
    viewMode,
    setViewMode,
    handleSave,
    updateConfigField,
    copyToClipboard,
    refreshConfig,
    convertToConfigFile,
    translation,
  } = useConfigEditor();

  const controlSize = useControlSize('md');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BiRefresh className="w-8 h-8 text-next-accent animate-spin mb-2" />
        <p className="text-gray-500 dark:text-gray-400">{translation.common.loading || 'Loading...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{translation.configEditor.errorLoading}</p>
          <Button
            onClick={refreshConfig}
            appearance="primary"
            className="flex items-center gap-2 mx-auto"
          >
            <BiRefresh size={16} />
            {translation.common.reload || 'Reload'}
          </Button>
        </div>
      </div>
    );
  }

  if (!config || !configData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BiRefresh className="w-8 h-8 text-next-accent animate-spin mb-2" />
        <p className="text-gray-500 dark:text-gray-400">{translation.common.loading || 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {translation.configEditor.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {translation.configEditor.description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
          <AnimatedSegmentedControl
            options={[
              { value: 'editor', label: translation.configEditor.viewModeEditor },
              { value: 'raw', label: translation.configEditor.viewModeRaw },
            ]}
            value={viewMode}
            onChange={setViewMode}
            size={controlSize}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              loading={saving}
              appearance="primary"
              className="flex items-center gap-2"
              size={controlSize}
            >
              <BiSave size={16} />
              {saving ? translation.configEditor.saving : translation.configEditor.save}
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'raw' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {translation.configEditor.content}
            </h3>
            <Button
              onClick={copyToClipboard}
              appearance="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <BiCopy size={16} />
              {translation.configEditor.copy}
            </Button>
          </div>
          <pre className="font-mono text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap overflow-x-auto">
            {convertToConfigFile(configData)}
          </pre>
        </div>
      ) : (
        <div className="grid gap-6">
          <Section title={translation.configEditor.sections.system}>
            <Field label={translation.configEditor.fields.cpuType}>
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
            </Field>

            <Field label={translation.configEditor.fields.cpuFrequency}>
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
            </Field>

            <Field label={translation.configEditor.fields.memorySize}>
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
            </Field>

            <Field label={translation.configEditor.fields.turboMode}>
              <Toggle
                checked={configData.system.turbo}
                onChange={(checked) => updateConfigField(['system', 'turbo'], checked)}
                size={controlSize}
              />
            </Field>

            <Field label={translation.configEditor.fields.fpuEnabled}>
              <Toggle
                checked={configData.system.fpu}
                onChange={(checked) => updateConfigField(['system', 'fpu'], checked)}
                size={controlSize}
              />
            </Field>
          </Section>

          <Section title={translation.configEditor.sections.display}>
            <Field label={translation.configEditor.fields.displayType}>
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
            </Field>

            <Field label={translation.configEditor.fields.width}>
              <Input
                type="number"
                value={configData.display.width.toString()}
                onChange={(value) => updateConfigField(['display', 'width'], parseInt(value) || 0)}
                step={16}
                size={controlSize}
              />
            </Field>

            <Field label={translation.configEditor.fields.height}>
              <Input
                type="number"
                value={configData.display.height.toString()}
                onChange={(value) => updateConfigField(['display', 'height'], parseInt(value) || 0)}
                step={16}
                size={controlSize}
              />
            </Field>

            <Field label={translation.configEditor.fields.colorDepth}>
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
            </Field>

            <Field label={translation.configEditor.fields.frameSkip}>
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
            </Field>
          </Section>

          <Section title={translation.configEditor.sections.scsi}>
            {['hd0', 'hd1', 'hd2', 'hd3', 'hd4', 'hd5', 'hd6'].map((hd) => (
              <Field key={hd} label={`${translation.configEditor.fields.scsiHd} ${hd.toUpperCase()}`}>
                <Input
                  value={configData.scsi[hd as keyof typeof configData.scsi]}
                  onChange={(value) => updateConfigField(['scsi', hd], value)}
                  placeholder={translation.configEditor.fields.pathToDiskImage}
                  size={controlSize}
                />
              </Field>
            ))}

            <Field label={translation.configEditor.fields.cdRom}>
              <Input
                value={configData.scsi.cd}
                onChange={(value) => updateConfigField(['scsi', 'cd'], value)}
                placeholder={translation.configEditor.fields.pathToCdImage}
                size={controlSize}
              />
            </Field>
          </Section>

          <Section title={translation.configEditor.sections.network}>
            <Field label={translation.configEditor.fields.networkEnabled}>
              <Toggle
                checked={configData.network.enabled}
                onChange={(checked) => updateConfigField(['network', 'enabled'], checked)}
                size={controlSize}
              />
            </Field>

            <Field label={translation.configEditor.fields.networkType}>
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
            </Field>
          </Section>

          <Section title={translation.configEditor.sections.sound}>
            <Field label={translation.configEditor.fields.soundEnabled}>
              <Toggle
                checked={configData.sound.enabled}
                onChange={(checked) => updateConfigField(['sound', 'enabled'], checked)}
                size={controlSize}
              />
            </Field>

            <Field label={translation.configEditor.fields.soundOutput}>
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
            </Field>
          </Section>

          <Section title={translation.configEditor.sections.boot}>
            <Field label={translation.configEditor.fields.romFile}>
              <Input
                value={configData.boot.rom_file}
                onChange={(value) => updateConfigField(['boot', 'rom_file'], value)}
                placeholder={translation.configEditor.fields.pathToRomFile}
                size={controlSize}
              />
            </Field>

            <Field label={translation.configEditor.fields.bootScsiId}>
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
            </Field>
          </Section>

          <Section title={translation.configEditor.sections.input}>
            <Field label={translation.configEditor.fields.keyboardType}>
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
            </Field>

            <Field label={translation.configEditor.fields.mouseEnabled}>
              <Toggle
                checked={configData.mouse.enabled}
                onChange={(checked) => updateConfigField(['mouse', 'enabled'], checked)}
                size={controlSize}
              />
            </Field>
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">{title}</h3>
      <div className="grid gap-3 sm:gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 items-start sm:items-center">
      <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}
