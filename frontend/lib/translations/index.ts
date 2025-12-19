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
  about: {
    appVersion: string;
    generalResources: string;
    layeredCodeberg: string;
    layeredMastodon: string;
    layeredOfficialWebsite: string;
    layeredResources: string;
    nextWikipedia: string;
    previousResources: string;
    previousSite: string;
    previousSourceforge: string;
    subtitle: string;
    title: string;
  };
  common: {
    cancel: string;
    error: string;
    loading: string;
    reload: string;
    save: string;
    success: string;
  };
  configEditor: {
    configurationDescriptionPlaceholder: string;
    configurationDetailsTitle: string;
    configurationNameLabel: string;
    configurationNamePlaceholder: string;
    content: string;
    copiedToClipboard: string;
    copy: string;
    createFirstConfig: string;
    descriptionLabel: string;
    errorLoading: string;
    failedToCopy: string;
    fields: {
      bootScsiId: string;
      cdRom: string;
      colorDepth: string;
      cpuFrequency: string;
      cpuType: string;
      displayType: string;
      fpuEnabled: string;
      frameSkip: string;
      height: string;
      keyboardType: string;
      memorySize: string;
      mouseEnabled: string;
      networkEnabled: string;
      networkType: string;
      pathToCdImage: string;
      pathToDiskImage: string;
      pathToRomFile: string;
      romFile: string;
      scsiHd: string;
      soundEnabled: string;
      soundOutput: string;
      turboMode: string;
      width: string;
    };
    goToSavedConfigs: string;
    noConfigSelected: string;
    noConfigSelectedDescription: string;
    noSavedConfigs: string;
    noSavedConfigsDescription: string;
    save: string;
    saveMetadata: string;
    saving: string;
    sections: {
      boot: string;
      display: string;
      input: string;
      network: string;
      scsi: string;
      sound: string;
      system: string;
    };
    sectionsCollapseAll: string;
    sectionsExpandAll: string;
    title: string;
    viewModeEditor: string;
    viewModeRaw: string;
  };
  configList: {
    active: string;
    configurationDuplicatedSuccessfully: string;
    configurationExportedSuccessfully: string;
    confirmDelete: string;
    copySuffix: string;
    delete: string;
    description: string;
    duplicate: string;
    edit: string;
    emptyStateDescription: string;
    emptyStateTitle: string;
    errorCreatingConfiguration: string;
    errorDeletingConfiguration: string;
    errorDuplicatingConfiguration: string;
    errorExportingConfiguration: string;
    errorLoadingConfigurations: string;
    errorSettingActiveConfiguration: string;
    errorUpdatingOrder: string;
    loading: string;
    newConfig: string;
    title: string;
  };
  footer: {
    atLakeConstance: string;
    austria: string;
    copyright: string;
    inBregenz: string;
    madeIn: string;
  };
  importExport: {
    databaseDescription: string;
    databaseExportError: string;
    databaseExportSuccess: string;
    databaseImportError: string;
    databaseImportSuccess: string;
    databaseTitle: string;
    description: string;
    errorExport: string;
    export: string;
    exportActiveConfig: string;
    exportAllConfigs: string;
    exportCompleteDatabase: string;
    exportDatabase: string;
    exportDatabaseDescription: string;
    exportDescription: string;
    exportedCount: string;
    exporting: string;
    exportingDatabase: string;
    exportsAllData: string;
    import: string;
    importDatabase: string;
    importDatabaseDescription: string;
    importDescription: string;
    importError: string;
    importFailed: string;
    importFromEmulator: string;
    importedConfigName: string;
    importedConfiguration: string;
    importedCount: string;
    importing: string;
    importingDatabase: string;
    invalidDatabaseStructure: string;
    invalidFileStructure: string;
    invalidFormat: string;
    invalidJson: string;
    loading: string;
    noActiveConfig: string;
    noConfigsToExport: string;
    noValidConfigs: string;
    note1: string;
    note2: string;
    note3: string;
    note4: string;
    notesTitle: string;
    selectConfigFile: string;
    selectDatabaseFile: string;
    successExportActiveConfig: string;
    syncHelpApply: string;
    syncHelpImport: string;
    syncTitle: string;
    syncToEmulator: string;
    syncing: string;
    title: string;
    warningReplaceAll: string;
  };
  layout: {
    signOut: string;
    subtitle: string;
    title: string;
  };
  login: {
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    createAccount: string;
    creatingAccount: string;
    databaseImportFailed: string;
    databaseImportSuccess: string;
    loginFailed: string;
    password: string;
    passwordMismatch: string;
    passwordPlaceholder: string;
    setupTitle: string;
    signIn: string;
    signingIn: string;
    title: string;
    username: string;
    usernamePlaceholder: string;
  };
  system: {
    checkForUpdates: string;
    checkingForUpdates: string;
    collectingData: string;
    cores: string;
    cpu: string;
    cpuLoadAverage: string;
    currentVersion: string;
    days: string;
    disks: string;
    display: string;
    errorLoading: string;
    gpu: string;
    host: string;
    hostInfo: string;
    hours: string;
    ipAddresses: string;
    kernel: string;
    loading: string;
    memory: string;
    minutes: string;
    model: string;
    networkTraffic: string;
    os: string;
    reset: string;
    resetConfirm: string;
    resetDescription: string;
    resetTitle: string;
    resetWarning: string;
    resetting: string;
    resolution: string;
    seconds: string;
    source: string;
    subtitle: string;
    title: string;
    updateAvailable: string;
    updateError: string;
    updateNow: string;
    updating: string;
    uptime: string;
  };
  tabs: {
    about: string;
    configEditor: string;
    importExport: string;
    savedConfigs: string;
    system: string;
  };
}

export const translations: Record<Language, Translations> = {
  de,
  en,
  es,
  fr,
  it,
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
