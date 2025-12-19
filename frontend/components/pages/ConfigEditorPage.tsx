import { BiSave, BiCopy, BiRefresh, BiChevronUp, BiChevronDown } from 'react-icons/bi';
import { IoDocumentText } from 'react-icons/io5';
import { Button, Input, SelectPicker, Toggle, Panel } from 'rsuite';
import { useEffect } from 'react';

// Components
import { AnimatedSegmentedControl } from '../controls/AnimatedSegmentedControl';
import EmptyView from '../controls/EmptyView';

// Hooks
import { useControlSize } from '../../hooks/useControlSize';
import { useConfigEditor } from '../../hooks/useConfigEditor';

export function ConfigEditor({ configId, onTabChange }: { configId?: string; onTabChange?: (tab: string) => void }) {
  const {
    config,
    configName,
    configData,
    loading,
    error,
    saving,
    viewMode,
    localName,
    localDescription,
    hasChanges,
    hasSavedConfigs,
    expandedSections,
    setViewMode,
    setLocalName,
    setLocalDescription,
    setExpandedSections,
    toggleAllSections,
    handleSave,
    handleUpdateMetadata,
    updateConfigField,
    copyToClipboard,
    refreshConfig,
    convertToConfigFile,
    translation,
  } = useConfigEditor(configId);

  const controlSize = useControlSize('md');

  // Show empty view if no saved configs exist
  if (hasSavedConfigs === false || hasSavedConfigs === null) {
    return (
      <EmptyView
        icon={IoDocumentText}
        title={translation.configEditor.noSavedConfigs}
        description={translation.configEditor.noSavedConfigsDescription}
        actionText={translation.configEditor.createFirstConfig}
        onAction={() => onTabChange?.('configs')}
      />
    );
  }

  // Show empty view if configs exist but no active config is selected
  if (hasSavedConfigs === true && configId === undefined && configName === null) {
    return (
      <EmptyView
        icon={IoDocumentText}
        title={translation.configEditor.noConfigSelected}
        description={translation.configEditor.noConfigSelectedDescription}
        actionText={translation.configEditor.goToSavedConfigs}
        onAction={() => onTabChange?.('configs')}
      />
    );
  }

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
    <div className="space-y-6 sm:space-y-8">
      {/* Configuration Metadata Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {translation.configEditor.configurationDetailsTitle}
        </h3>
        
        <div className="grid gap-6">
          {/* Config Name and Description in same row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translation.configEditor.configurationNameLabel}
              </label>
              <Input
                value={localName}
                onChange={setLocalName}
                size={controlSize}
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
                size={controlSize}
                placeholder={translation.configEditor.configurationDescriptionPlaceholder}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleUpdateMetadata}
              disabled={!hasChanges}
              appearance="primary"
              size={controlSize}
              className="flex items-center gap-2"
            >
              <BiSave size={16} />
              {translation.configEditor.saveMetadata}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Title - always full width on mobile/tablet portrait */}
        <div className="w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {translation.configEditor.title}
          </h2>
        </div>

        {/* Controls - always in one row: toggle button left, others right */}
        <div className="flex flex-row justify-between items-center gap-3 sm:gap-4">
          <Button
            onClick={toggleAllSections}
            size={controlSize}
            className="flex items-center gap-2 flex-shrink-0"
          >
            {Object.values(expandedSections).every(expanded => expanded) ? (
              <BiChevronUp size={16} />
            ) : (
              <BiChevronDown size={16} />
            )}
            {Object.values(expandedSections).every(expanded => expanded)
              ? translation.configEditor.sectionsCollapseAll
              : translation.configEditor.sectionsExpandAll}
          </Button>

          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <AnimatedSegmentedControl
              options={[
                { value: 'editor', label: translation.configEditor.viewModeEditor },
                { value: 'raw', label: translation.configEditor.viewModeRaw },
              ]}
              value={viewMode}
              onChange={setViewMode}
              size={controlSize}
              className="flex flex-nowrap"
            />
            <Button
              onClick={handleSave}
              disabled={saving}
              loading={saving}
              appearance="primary"
              className="flex items-center gap-2"
              size={controlSize}
              title={saving ? translation.configEditor.saving : translation.configEditor.save}
            >
              <BiSave size={16} />
              <span className="hidden sm:inline">
                {saving ? translation.configEditor.saving : translation.configEditor.save}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'raw' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
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
          <Section
            key="system"
            title={translation.configEditor.sections.system}
            expanded={expandedSections.system}
            onToggle={(expanded) => setExpandedSections(prev => ({ ...prev, system: expanded }))}
          >
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

          <Section
            key="display"
            title={translation.configEditor.sections.display}
            expanded={expandedSections.display}
            onToggle={(expanded) => setExpandedSections(prev => ({ ...prev, display: expanded }))}
          >
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

          <Section
            key="scsi"
            title={translation.configEditor.sections.scsi}
            expanded={expandedSections.scsi}
            onToggle={(expanded) => setExpandedSections(prev => ({ ...prev, scsi: expanded }))}
          >
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

          <Section
            key="network"
            title={translation.configEditor.sections.network}
            expanded={expandedSections.network}
            onToggle={(expanded) => setExpandedSections(prev => ({ ...prev, network: expanded }))}
          >
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

          <Section
            key="sound"
            title={translation.configEditor.sections.sound}
            expanded={expandedSections.sound}
            onToggle={(expanded) => setExpandedSections(prev => ({ ...prev, sound: expanded }))}
          >
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

          <Section
            key="boot"
            title={translation.configEditor.sections.boot}
            expanded={expandedSections.boot}
            onToggle={(expanded) => setExpandedSections(prev => ({ ...prev, boot: expanded }))}
          >
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

          <Section
            key="input"
            title={translation.configEditor.sections.input}
            expanded={expandedSections.input}
            onToggle={(expanded) => setExpandedSections(prev => ({ ...prev, input: expanded }))}
          >
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

function Section({ title, children, expanded, onToggle }: { title: string; children: React.ReactNode; expanded: boolean; onToggle: (expanded: boolean) => void }) {
  return (
    <Panel
      header={<div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white p-0.5 cursor-pointer">{title}</div>}
      collapsible
      expanded={expanded}
      onSelect={() => onToggle(!expanded)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors duration-200"
    >
      <div className="p-2 sm:p-3">
        <div className="grid gap-4 sm:gap-6">{children}</div>
      </div>
    </Panel>
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
