import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';

/**
 * Supported language codes
 *
 * @type {('en' | 'de' | 'it' | 'es' | 'fr')}
 *   - 'en': English
 *   - 'de': Deutsch (German)
 *   - 'it': Italiano (Italian)
 *   - 'es': Español (Spanish)
 *   - 'fr': Français (French)
 */
export type Language = 'en' | 'de' | 'it' | 'es' | 'fr';

/**
 * Complete translation strings for all UI elements
 *
 * Maps all user-facing strings for a specific language.
 * Each section corresponds to a feature/screen area.
 * All strings must be present for a language to be usable.
 *
 * @interface Translations
 */
export interface Translations {
  footer: {
    copyright: string;
    madeIn: string;
    inBregenz: string;
    atLakeConstance: string;
    austria: string;
  };
  login: {
    title: string;
    subtitle: string;
    setupTitle: string;
    setupSubtitle: string;
    username: string;
    usernamePlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    signIn: string;
    signingIn: string;
    createAccount: string;
    creatingAccount: string;
    passwordMismatch: string;
    loginFailed: string;
    footer: string;
  };
  layout: {
    title: string;
    subtitle: string;
    signOut: string;
  };
  tabs: {
    savedConfigs: string;
    configEditor: string;
    importExport: string;
    system: string;
    about: string;
  };
  configList: {
    title: string;
    noConfigs: string;
    noConfigsDescription: string;
    emptyStateTitle: string;
    emptyStateDescription: string;
    search: string;
    edit: string;
    delete: string;
    confirmDelete: string;
    cancel: string;
    loading: string;
    newConfig: string;
    active: string;
  };
  configEditor: {
    title: string;
    configName: string;
    configNamePlaceholder: string;
    configPath: string;
    configPathPlaceholder: string;
    content: string;
    contentPlaceholder: string;
    save: string;
    saving: string;
    clear: string;
    successSaved: string;
    errorSaving: string;
    errorLoading: string;
    fillAllFields: string;
    viewModeEditor: string;
    viewModeRaw: string;
    copy: string;
    copiedToClipboard: string;
    failedToCopy: string;
    sections: {
      system: string;
      display: string;
      scsi: string;
      network: string;
      sound: string;
      boot: string;
      input: string;
    };
    fields: {
      cpuType: string;
      cpuFrequency: string;
      memorySize: string;
      turboMode: string;
      fpuEnabled: string;
      displayType: string;
      width: string;
      height: string;
      colorDepth: string;
      frameSkip: string;
      scsiHd: string;
      cdRom: string;
      networkEnabled: string;
      networkType: string;
      soundEnabled: string;
      soundOutput: string;
      romFile: string;
      bootScsiId: string;
      keyboardType: string;
      mouseEnabled: string;
      pathToDiskImage: string;
      pathToCdImage: string;
      pathToRomFile: string;
    };
  };
  importExport: {
    title: string;
    import: string;
    importDescription: string;
    selectConfigFile: string;
    importButton: string;
    importing: string;
    export: string;
    exportDescription: string;
    exportButton: string;
    exporting: string;
    successImport: string;
    successExport: string;
    successExportActiveConfig: string;
    errorImport: string;
    errorExport: string;
    syncTitle: string;
    syncPath: string;
    syncToEmulator: string;
    syncing: string;
    importFromEmulator: string;
    loading: string;
    syncSuccess: string;
    syncError: string;
    noActiveConfig: string;
    importSuccess: string;
    importError: string;
    syncHelpApply: string;
    syncHelpImport: string;
    notesTitle: string;
    note1: string;
    note2: string;
    note3: string;
    note4: string;
    noActiveConfigToExport: string;
    noConfigsToExport: string;
    exportedCount: string;
    importedCount: string;
    importedConfiguration: string;
    skippingInvalid: string;
    noValidConfigs: string;
    importedConfigName: string;
    invalidFormat: string;
    importFailed: string;
    databaseTitle: string;
    databaseDescription: string;
    importDatabase: string;
    importDatabaseDescription: string;
    selectDatabaseFile: string;
    importingDatabase: string;
    exportDatabase: string;
    exportDatabaseDescription: string;
    exportingDatabase: string;
    exportCompleteDatabase: string;
    warningReplaceAll: string;
    exportsAllData: string;
    databaseExportSuccess: string;
    databaseExportError: string;
    databaseImportSuccess: string;
    databaseImportError: string;
    invalidJson: string;
    invalidFileStructure: string;
    invalidDatabaseStructure: string;
    exportActiveConfig: string;
    exportAllConfigs: string;
  };
  system: {
    title: string;
    subtitle: string;
    appVersion: string;
    currentVersion: string;
    checkingForUpdates: string;
    updateAvailable: string;
    upToDate: string;
    updateNow: string;
    updating: string;
    updateError: string;
    checkForUpdates: string;
    hostInfo: string;
    hardwareInfo: string;
    loading: string;
    errorLoading: string;
    os: string;
    host: string;
    kernel: string;
    uptime: string;
    cpu: string;
    model: string;
    cores: string;
    gpu: string;
    memory: string;
    total: string;
    used: string;
    free: string;
    ipAddresses: string;
    display: string;
    resolution: string;
    source: string;
    networkTraffic: string;
    cpuLoadAverage: string;
    collectingData: string;
    disks: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    reset: string;
    resetTitle: string;
    resetDescription: string;
    resetConfirm: string;
    resetWarning: string;
    resetting: string;
  };
  about: {
    title: string;
    subtitle: string;
    layeredResources: string;
    previousResources: string;
    previousSite: string;
    previousSourceforge: string;
    generalResources: string;
    nextWikipedia: string;
    layeredOfficialWebsite: string;
    layeredMastodon: string;
    layeredCodeberg: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    confirm: string;
    save: string;
    cancel: string;
    reload: string;
  };
}

export const translations: Record<Language, Translations> = {
  en,
  de,
  it,
  es,
  fr,
};

/**
 * Detects the user's browser language and returns the best match from supported languages.
 *
 * @returns {Language} The detected language code ('en', 'de', 'it', 'es', 'fr'). Defaults to 'en'.
 */
export const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined' || !window.navigator) {
    return 'en';
  }

  const browserLanguages = window.navigator.languages || [window.navigator.language];

  for (const lang of browserLanguages) {
    const languageCode = lang.split('-')[0] as Language;
    if (['en', 'de', 'it', 'es', 'fr'].includes(languageCode)) {
      return languageCode;
    }
  }

  return 'en';
};
