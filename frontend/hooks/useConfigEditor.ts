import { useState, useEffect } from 'react';

// Hooks
import { useConfig } from '../contexts/ConfigContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';

// Types
import type { PreviousConfig } from '../lib/types';

// This function is now defined locally as it's not exported from configFileSync.ts anymore
function convertToConfigFile(config: PreviousConfig): string {
  const lines: string[] = [];

  lines.push('[System]');
  lines.push(`nCpuLevel = ${getCpuLevel(config.system.cpu_type)}`);
  lines.push(`nCpuFreq = ${config.system.cpu_frequency}`);
  lines.push(`nMemorySize = ${config.system.memory_size}`);
  lines.push(`bTurbo = ${config.system.turbo ? 'TRUE' : 'FALSE'}`);
  lines.push(`bFPU = ${config.system.fpu ? 'TRUE' : 'FALSE'}`);
  lines.push('');

  lines.push('[Screen]');
  lines.push(`bColor = ${config.display.type === 'color' ? 'TRUE' : 'FALSE'}`);
  lines.push(`nFrameSkips = ${config.display.frameskip}`);
  lines.push(`nMonitorType = ${config.display.color_depth}`);
  lines.push('');

  lines.push('[SCSI]');
  for (let i = 0; i < 7; i++) {
    const key = `hd${i}` as keyof typeof config.scsi;
    const path = config.scsi[key];
    if (path) {
      lines.push(`szHardDiskImage[${i}] = ${path}`);
    }
  }
  if (config.scsi.cd) {
    lines.push(`szCDRomImage = ${config.scsi.cd}`);
  }
  lines.push('');

  lines.push('[Ethernet]');
  lines.push(`bEthernetConnected = ${config.network.enabled ? 'TRUE' : 'FALSE'}`);
  lines.push(`nEthernetType = ${config.network.type === 'ethernet' ? '0' : '1'}`);
  lines.push('');

  lines.push('[Sound]');
  lines.push(`bEnableSound = ${config.sound.enabled ? 'TRUE' : 'FALSE'}`);
  lines.push('');

  lines.push('[ROM]');
  if (config.boot.rom_file) {
    lines.push(`szRomImagePath = ${config.boot.rom_file}`);
  }
  lines.push(`nBootDevice = ${config.boot.scsi_id}`);
  lines.push('');

  lines.push('[Keyboard]');
  lines.push(`nKeyboardLayout = ${getKeyboardLayout(config.keyboard.type)}`);
  lines.push('');

  lines.push('[Mouse]');
  lines.push(`bEnableMouse = ${config.mouse.enabled ? 'TRUE' : 'FALSE'}`);
  lines.push('');

  return lines.join('\n');
}

function getCpuLevel(cpuType: string): number {
  switch (cpuType) {
    case '68030':
      return 3;
    case '68040':
      return 4;
    case '68060':
      return 5;
    default:
      return 4;
  }
}

function getKeyboardLayout(type: string): number {
  switch (type) {
    case 'us':
      return 0;
    case 'de':
      return 1;
    case 'fr':
      return 2;
    case 'uk':
      return 3;
    default:
      return 0;
  }
}

export function useConfigEditor() {
  const { config, configName, configDescription, loading, error, updateConfig, refreshConfig, loadConfigById, updateConfigMetadata } = useConfig();
  const { translation } = useLanguage();
  const { showSuccess, showError } = useNotification();

  const [configData, setConfigData] = useState<PreviousConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'raw'>('editor');

  // Local state for metadata editing
  const [localName, setLocalName] = useState(configName || '');
  const [localDescription, setLocalDescription] = useState(configDescription || '');
  const [hasChanges, setHasChanges] = useState(false);

  // Expanded sections state with localStorage persistence
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('configEditorSectionsExpanded');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      system: true,
      display: false,
      scsi: false,
      network: false,
      sound: false,
      boot: false,
      input: false,
    };
  });

  // Persist expanded sections to localStorage
  useEffect(() => {
    localStorage.setItem('configEditorSectionsExpanded', JSON.stringify(expandedSections));
  }, [expandedSections]);

  // Sync local values with current config metadata
  useEffect(() => {
    setLocalName(configName || '');
    setLocalDescription(configDescription || '');
    setHasChanges(false);
  }, [configName, configDescription]);

  // Check for changes
  useEffect(() => {
    const nameChanged = localName !== (configName || '');
    const descChanged = localDescription !== (configDescription || '');
    setHasChanges(nameChanged || descChanged);
  }, [localName, localDescription, configName, configDescription]);

  // Sync config to local state
  useEffect(() => {
    if (config) {
      setConfigData(config);
    }
  }, [config]);

  async function handleSave() {
    if (!configData) return;

    setSaving(true);
    try {
      await updateConfig(configData);
      showSuccess(translation.common.success || 'Saved successfully');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error saving config');
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateMetadata() {
    if (!hasChanges) return;

    setSaving(true);
    try {
      await updateConfigMetadata(localName, localDescription);
      showSuccess(translation.configEditor.saveMetadata || 'Metadata saved');
      setHasChanges(false);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error saving metadata');
      console.error('Error saving metadata:', error);
    } finally {
      setSaving(false);
    }
  }

  function updateConfigField(path: string[], value: string | number | boolean) {
    setConfigData((prev) => {
      if (!prev) return prev;
      const newConfig = { ...prev };
      let current: Record<string, unknown> = newConfig;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]] as Record<string, unknown>;
      }

      current[path[path.length - 1]] = value;
      return newConfig;
    });
  }

  async function copyToClipboard() {
    if (!configData) return;

    try {
      const configText = convertToConfigFile(configData);

      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(configText);
          showSuccess(translation.configEditor.copiedToClipboard);
          return;
        } catch (clipboardError) {
          console.warn('Clipboard API failed, trying fallback:', clipboardError);
          // Fall through to fallback
        }
      }

      // Fallback for HTTP or when Clipboard API is not available
      const textarea = document.createElement('textarea');
      textarea.value = configText;
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        showSuccess(translation.configEditor.copiedToClipboard);
      } else {
        throw new Error('execCommand failed');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      showError(translation.configEditor.failedToCopy);
    }
  }

  function toggleAllSections() {
    const allExpanded = Object.values(expandedSections).every(expanded => expanded);
    const newState = allExpanded ? false : true;
    setExpandedSections({
      system: newState,
      display: newState,
      scsi: newState,
      network: newState,
      sound: newState,
      boot: newState,
      input: newState,
    });
  }

  return {
    // State
    config,
    configName,
    configDescription,
    configData,
    loading,
    error,
    saving,
    viewMode,
    localName,
    localDescription,
    hasChanges,
    expandedSections,

    // Actions
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
    loadConfigById,

    // Utilities
    convertToConfigFile,

    // Translations
    translation,
  };
}