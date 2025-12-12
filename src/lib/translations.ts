import { APP_NAME } from './constants';

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
  en: {
    footer: {
      copyright: '© LAYERED.work',
      madeIn: 'made with ❤️ and',
      inBregenz: 'in Bregenz',
      atLakeConstance: 'at Lake Constance',
      austria: 'Austria',
    },
    login: {
      title: APP_NAME,
      subtitle: 'Sign in to your account',
      username: 'Username',
      usernamePlaceholder: 'Choose a username (min. 3 characters)',
      password: 'Password',
      passwordPlaceholder: 'Choose a password (min. 6 characters)',
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      setupTitle: `Welcome to ${APP_NAME}`,
      setupSubtitle: 'Create your administrator account',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Enter password again',
      createAccount: 'Create Account',
      creatingAccount: 'Creating account...',
      passwordMismatch: 'Passwords do not match',
      loginFailed: 'Login failed',
      footer: 'Manage your NeXT Computer configurations.',
      madeBy: 'Made with ❤️ by',
    },
    layout: {
      title: APP_NAME,
      subtitle: 'Previous Emulator Configuration Manager',
      signOut: 'Sign Out',
    },
    tabs: {
      savedConfigs: 'Saved Configs',
      configEditor: 'Config Editor',
      importExport: 'Import/Export',
      system: 'System',
      about: 'About',
    },
    configList: {
      title: 'Saved Configurations',
      description: 'Description',
      noConfigs: 'No saved configurations',
      noConfigsDescription: 'Create your first configuration to get started',
      emptyStateTitle: 'No Saved Configs Available',
      emptyStateDescription: 'Create a new Previous configuration',
      search: 'Search configurations',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Delete this configuration?',
      cancel: 'Cancel',
      loading: 'Loading configurations...',
      newConfig: 'New Configuration',
      active: 'Active',
    },
    configEditor: {
      title: 'Configuration Editor',
      description: 'Create and edit configuration files for your NeXT Computer',
      configName: 'Configuration Name',
      configNamePlaceholder: 'e.g., Network Settings',
      configPath: 'File Path',
      configPathPlaceholder: 'e.g., /etc/network/interfaces',
      content: 'Configuration Content',
      contentPlaceholder: 'Enter your configuration here...',
      save: 'Save Configuration',
      saving: 'Saving...',
      clear: 'Clear',
      successSaved: 'Configuration saved successfully!',
      errorSaving: 'Error saving configuration',
      errorLoading: 'Error loading configurations',
      fillAllFields: 'Please fill in all fields',
      viewModeEditor: 'Editor',
      viewModeRaw: 'Raw',
      copy: 'Copy',
      copiedToClipboard: 'Copied to clipboard',
      failedToCopy: 'Failed to copy to clipboard',
      sections: {
        system: 'System Configuration',
        display: 'Display Configuration',
        scsi: 'SCSI Devices',
        network: 'Network Configuration',
        sound: 'Sound Configuration',
        boot: 'Boot Configuration',
        input: 'Input Devices',
      },
      fields: {
        cpuType: 'CPU Type',
        cpuFrequency: 'CPU Frequency (MHz)',
        memorySize: 'Memory Size (MB)',
        turboMode: 'Turbo Mode',
        fpuEnabled: 'FPU Enabled',
        displayType: 'Display Type',
        width: 'Width (pixels)',
        height: 'Height (pixels)',
        colorDepth: 'Color Depth (bits)',
        frameSkip: 'Frame Skip',
        scsiHd: 'SCSI HD',
        cdRom: 'CD-ROM',
        networkEnabled: 'Network Enabled',
        networkType: 'Network Type',
        soundEnabled: 'Sound Enabled',
        soundOutput: 'Sound Output',
        romFile: 'ROM File',
        bootScsiId: 'Boot SCSI ID',
        keyboardType: 'Keyboard Type',
        mouseEnabled: 'Mouse Enabled',
        pathToDiskImage: 'Path to disk image',
        pathToCdImage: 'Path to CD image',
        pathToRomFile: 'Path to ROM file',
      },
    },
    importExport: {
      title: 'Import/Export',
      description: 'Backup and restore your configurations',
      import: 'Import Configurations',
      importDescription: 'Select a JSON file to import configurations',
      selectConfigFile: 'Select Exported Config File',
      importButton: 'Import',
      importing: 'Importing...',
      export: 'Export Configurations',
      exportDescription: 'Download all configurations as a JSON file',
      exportButton: 'Export All Configurations',
      exporting: 'Exporting...',
      successImport: 'Configurations imported successfully!',
      successExport: 'Configurations exported successfully!',
      successExportActiveConfig: 'Successfully exported active configuration.',
      errorImport: 'Error importing configurations',
      errorExport: 'Error exporting configurations',
      syncTitle: 'Sync with Previous Emulator',
      syncPath: '/home/next/.config/previous/previous.cfg',
      syncToEmulator: 'Apply Active Config to Emulator',
      syncing: 'Syncing...',
      importFromEmulator: 'Import from Emulator Config',
      loading: 'Loading...',
      syncSuccess: 'Configuration synced to Previous emulator successfully',
      syncError: 'Failed to sync configuration file',
      noActiveConfig: 'No active configuration found',
      importSuccess: 'Configuration imported from Previous emulator',
      importError: 'Error importing configuration',
      syncHelpApply: 'Apply to Emulator: Writes the active configuration to the Previous emulator config file',
      syncHelpImport: 'Import from Emulator: Reads the current emulator config and creates a new configuration in the database',
      notesTitle: 'Important Notes',
      note1: 'Always backup your configurations before making major changes',
      note2: 'Imported configurations are not automatically activated',
      note3: 'File paths in configurations may need adjustment for your system',
      note4: 'ROM and disk image files must exist at the specified paths',
      noActiveConfigToExport: 'No active configuration found to export',
      noConfigsToExport: 'No configurations found to export',
      exportedCount: 'Successfully exported {count} configuration(s)',
      importedCount: 'Successfully imported {count} configuration(s)',
      importedConfiguration: 'Configuration imported successfully',
      skippingInvalid: 'Skipping invalid configuration entry',
      noValidConfigs: 'No valid configurations found in file',
      importedConfigName: 'Imported Configuration',
      invalidFormat: 'Invalid file format. Expected "config" or "configurations" field.',
      importFailed: 'Import failed: {error}',
      databaseTitle: 'Database Backup & Restore',
      databaseDescription: 'Export or import the entire database including all configurations',
      importDatabase: 'Import Database',
      importDatabaseDescription: 'Restore complete database from a backup file',
      selectDatabaseFile: 'Select Database File',
      importingDatabase: 'Importing...',
      exportDatabase: 'Export Database',
      exportDatabaseDescription: 'Create a complete backup of all data',
      exportingDatabase: 'Exporting...',
      exportCompleteDatabase: 'Export Complete Database',
      warningReplaceAll: 'Warning: This will replace all existing configurations!',
      exportsAllData: 'Exports all configurations and user data as a JSON file',
      databaseExportSuccess: 'Database exported successfully',
      databaseExportError: 'Error exporting database',
      databaseImportSuccess: 'Database imported successfully: {count} configurations',
      databaseImportError: 'Database import failed: {error}',
      invalidJson: 'Invalid JSON file format',
      invalidFileStructure: 'Invalid file structure',
      invalidDatabaseStructure: 'Invalid database dump structure',
      exportActiveConfig: 'Export Active Configuration',
      exportAllConfigs: 'Export All Configurations',
    },
    system: {
      title: 'System Information',
      subtitle: 'Version and system details',
      appVersion: 'Application Version',
      currentVersion: 'Current Version',
      checkingForUpdates: 'Checking for updates...',
      updateAvailable: 'Update available',
      upToDate: 'Up to date',
      updateNow: 'Update Now',
      updating: 'Updating...',
      updateError: 'Error checking for updates',
      checkForUpdates: 'Check for Updates',
      hostInfo: 'Host Information',
      hardwareInfo: 'Hardware',
      loading: 'Loading...',
      errorLoading: 'Error loading system information',
      os: 'Operating System',
      host: 'Hostname',
      kernel: 'Kernel',
      uptime: 'Uptime',
      cpu: 'CPU',
      model: 'Model',
      cores: 'cores',
      gpu: 'GPU',
      memory: 'Memory',
      total: 'Total',
      used: 'Used',
      free: 'Free',
      ipAddresses: 'IP Addresses',
      disks: 'Disks',
      days: 'd',
      hours: 'h',
      minutes: 'm',
      seconds: 's',
      reset: 'Reset System',
      resetTitle: 'Reset System',
      resetDescription: 'Delete all data, including the admin user, and return to initial setup. The admin user must be recreated after reset.',
      resetConfirm: 'Reset',
      resetWarning: 'Warning: This will delete all configurations and reset the system to initial setup. This action cannot be undone!',
      resetting: 'Resetting...',
    },
    about: {
      title: `About ${APP_NAME}`,
      subtitle: 'Previous Emulator Configuration Manager',
      description: `${APP_NAME} is a modern web-based configuration management tool designed specifically for NeXT Computer systems. It provides an intuitive interface for managing system configuration files with security and ease of use in mind.`,
      features: 'Key Features',
      featureAuth: 'Secure Authentication',
      featureAuthDesc: 'PAM-based authentication using your Linux system credentials',
      featureConfig: 'Configuration Management',
      featureConfigDesc: 'Create, edit, and manage configuration files with a user-friendly interface',
      featureImportExport: 'Import/Export',
      featureImportExportDesc: 'Backup and restore your configurations easily',
      featureTheme: 'Theme Support',
      featureThemeDesc: 'Light and Dark themes with NeXT-inspired design',
      technology: 'Built with modern web technologies: React, TypeScript, and Vite',
      madeBy: 'Made with ❤️ by',
      layeredResources: 'LAYERED Resources',
      previousResources: 'Previous Resources',
      previousSite: 'Previous Emulator Official Site',
      previousSourceforge: 'Previous on SourceForge',
      generalResources: 'General Resources',
      nextWikipedia: 'About NeXT Computer',
      version: 'Version',
      currentVersion: 'Current Version',
      checkingForUpdates: 'Checking for updates...',
      updateAvailable: 'Update available',
      upToDate: 'Up to date',
      updateNow: 'Update Now',
      updating: 'Updating...',
      updateError: 'Error checking for updates',
      checkForUpdates: 'Check for Updates',
      layeredOfficialWebsite: 'LAYERED Official Site',
      layeredMastodon: 'LAYERED on Mastodon',
      layeredCodeberg: 'phranck aka LAYERED on Codeberg',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      save: 'Save',
      cancel: 'Cancel',
      reload: 'Reload',
    },
  },
  de: {
    footer: {
      copyright: '© LAYERED.work',
      madeIn: 'erstellt mit ❤️ und',
      inBregenz: 'in Bregenz',
      atLakeConstance: 'am Bodensee',
      austria: 'Österreich',
    },
    login: {
      title: APP_NAME,
      subtitle: 'Melden Sie sich bei Ihrem Konto an',
      username: 'Benutzername',
      usernamePlaceholder: 'Wählen Sie einen Benutzernamen (mind. 3 Zeichen)',
      password: 'Passwort',
      passwordPlaceholder: 'Wählen Sie ein Passwort (mind. 6 Zeichen)',
      signIn: 'Anmelden',
      signingIn: 'Anmeldung läuft...',
      setupTitle: `Willkommen bei ${APP_NAME}`,
      setupSubtitle: 'Erstellen Sie Ihr Administrator-Konto',
      confirmPassword: 'Passwort bestätigen',
      confirmPasswordPlaceholder: 'Passwort erneut eingeben',
      createAccount: 'Konto erstellen',
      creatingAccount: 'Konto wird erstellt...',
      passwordMismatch: 'Passwörter stimmen nicht überein',
      loginFailed: 'Anmeldung fehlgeschlagen',
      footer: 'Verwalten Sie Ihre NeXT Computer Konfigurationen.',
      madeBy: 'Erstellt mit ❤️ von',
    },
    layout: {
      title: APP_NAME,
      subtitle: 'Previous Emulator Konfigurationsverwaltung',
      signOut: 'Abmelden',
    },
    tabs: {
      savedConfigs: 'Gespeicherte Konfigurationen',
      configEditor: 'Konfigurations-Editor',
      importExport: 'Import/Export',
      system: 'System',
      about: 'Über',
    },
    configList: {
      title: 'Gespeicherte Konfigurationen',
      description: 'Beschreibung',
      noConfigs: 'Keine gespeicherten Konfigurationen',
      noConfigsDescription: 'Erstelle deine erste Konfiguration, um loszulegen',
      emptyStateTitle: 'Keine gespeicherten Konfigurationen verfügbar',
      emptyStateDescription: 'Erstelle eine neue Previous-Konfiguration',
      search: 'Konfigurationen durchsuchen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      confirmDelete: 'Diese Konfiguration löschen?',
      cancel: 'Abbrechen',
      loading: 'Lade Konfigurationen...',
      newConfig: 'Neue Konfiguration',
      active: 'Aktiv',
    },
    configEditor: {
      title: 'Konfigurations-Editor',
      description: 'Erstellen und bearbeiten Sie Konfigurationsdateien für Ihren NeXT Computer',
      configName: 'Konfigurationsname',
      configNamePlaceholder: 'z.B. Netzwerkeinstellungen',
      configPath: 'Dateipfad',
      configPathPlaceholder: 'z.B. /etc/network/interfaces',
      content: 'Konfigurationsinhalt',
      contentPlaceholder: 'Geben Sie hier Ihre Konfiguration ein...',
      save: 'Konfiguration speichern',
      saving: 'Speichern...',
      clear: 'Löschen',
      successSaved: 'Konfiguration erfolgreich gespeichert!',
      errorSaving: 'Fehler beim Speichern der Konfiguration',
      errorLoading: 'Fehler beim Laden der Konfigurationen',
      fillAllFields: 'Bitte füllen Sie alle Felder aus',
      viewModeEditor: 'Editor',
      viewModeRaw: 'Roh',
      copy: 'Kopieren',
      copiedToClipboard: 'In Zwischenablage kopiert',
      failedToCopy: 'Fehler beim Kopieren',
      sections: {
        system: 'Systemkonfiguration',
        display: 'Bildschirmkonfiguration',
        scsi: 'SCSI-Geräte',
        network: 'Netzwerkkonfiguration',
        sound: 'Soundkonfiguration',
        boot: 'Boot-Konfiguration',
        input: 'Eingabegeräte',
      },
      fields: {
        cpuType: 'CPU-Typ',
        cpuFrequency: 'CPU-Frequenz (MHz)',
        memorySize: 'Speichergröße (MB)',
        turboMode: 'Turbo-Modus',
        fpuEnabled: 'FPU aktiviert',
        displayType: 'Bildschirmtyp',
        width: 'Breite (Pixel)',
        height: 'Höhe (Pixel)',
        colorDepth: 'Farbtiefe (Bit)',
        frameSkip: 'Frame-Skip',
        scsiHd: 'SCSI-Festplatte',
        cdRom: 'CD-ROM',
        networkEnabled: 'Netzwerk aktiviert',
        networkType: 'Netzwerktyp',
        soundEnabled: 'Sound aktiviert',
        soundOutput: 'Sound-Ausgabe',
        romFile: 'ROM-Datei',
        bootScsiId: 'Boot-SCSI-ID',
        keyboardType: 'Tastaturlayout',
        mouseEnabled: 'Maus aktiviert',
        pathToDiskImage: 'Pfad zum Disk-Image',
        pathToCdImage: 'Pfad zum CD-Image',
        pathToRomFile: 'Pfad zur ROM-Datei',
      },
    },
    importExport: {
      title: 'Import/Export',
      description: 'Sichern und Wiederherstellen Ihrer Konfigurationen',
      import: 'Konfigurationen importieren',
      importDescription: 'Wählen Sie eine JSON-Datei zum Importieren',
      selectConfigFile: 'Exportierte Config Datei auswählen',
      importButton: 'Importieren',
      importing: 'Importieren...',
      export: 'Konfigurationen exportieren',
      exportDescription: 'Laden Sie alle Konfigurationen als JSON-Datei herunter',
      exportButton: 'Alle Konfigurationen exportieren',
      exporting: 'Exportieren...',
      successImport: 'Konfigurationen erfolgreich importiert!',
      successExport: 'Konfigurationen erfolgreich exportiert!',
      successExportActiveConfig: 'Aktive Konfiguration erfolgreich exportiert.',
      errorImport: 'Fehler beim Importieren der Konfigurationen',
      errorExport: 'Fehler beim Exportieren der Konfigurationen',
      syncTitle: 'Mit Previous Emulator synchronisieren',
      syncPath: '/home/next/.config/previous/previous.cfg',
      syncToEmulator: 'Aktive Konfiguration auf Emulator anwenden',
      syncing: 'Synchronisiere...',
      importFromEmulator: 'Von Emulator-Konfiguration importieren',
      loading: 'Laden...',
      syncSuccess: 'Konfiguration erfolgreich mit Previous Emulator synchronisiert',
      syncError: 'Fehler beim Synchronisieren der Konfigurationsdatei',
      noActiveConfig: 'Keine aktive Konfiguration gefunden',
      importSuccess: 'Konfiguration von Previous Emulator importiert',
      importError: 'Fehler beim Importieren der Konfiguration',
      syncHelpApply: 'Auf Emulator anwenden: Schreibt die aktive Konfiguration in die Previous Emulator-Konfigurationsdatei',
      syncHelpImport: 'Von Emulator importieren: Liest die aktuelle Emulator-Konfiguration und erstellt eine neue Konfiguration in der Datenbank',
      notesTitle: 'Wichtige Hinweise',
      note1: 'Sichern Sie immer Ihre Konfigurationen vor größeren Änderungen',
      note2: 'Importierte Konfigurationen werden nicht automatisch aktiviert',
      note3: 'Dateipfade in Konfigurationen müssen möglicherweise für Ihr System angepasst werden',
      note4: 'ROM- und Disk-Image-Dateien müssen unter den angegebenen Pfaden vorhanden sein',
      noActiveConfigToExport: 'Keine aktive Konfiguration zum Exportieren gefunden',
      noConfigsToExport: 'Keine Konfigurationen zum Exportieren gefunden',
      exportedCount: '{count} Konfiguration(en) erfolgreich exportiert',
      importedCount: '{count} Konfiguration(en) erfolgreich importiert',
      importedConfiguration: 'Konfiguration erfolgreich importiert',
      skippingInvalid: 'Überspringe ungültigen Konfigurationseintrag',
      noValidConfigs: 'Keine gültigen Konfigurationen in der Datei gefunden',
      importedConfigName: 'Importierte Konfiguration',
      invalidFormat: 'Ungültiges Dateiformat. Erwarte "config" oder "configurations" Feld.',
      importFailed: 'Import fehlgeschlagen: {error}',
      databaseTitle: 'Datenbank-Backup & Wiederherstellung',
      databaseDescription: 'Exportieren oder importieren Sie die gesamte Datenbank einschließlich aller Konfigurationen',
      importDatabase: 'Datenbank importieren',
      importDatabaseDescription: 'Vollständige Datenbank aus Backup-Datei wiederherstellen',
      selectDatabaseFile: 'Datenbankdatei auswählen',
      importingDatabase: 'Importieren...',
      exportDatabase: 'Datenbank exportieren',
      exportDatabaseDescription: 'Vollständiges Backup aller Daten erstellen',
      exportingDatabase: 'Exportieren...',
      exportCompleteDatabase: 'Vollständige Datenbank exportieren',
      warningReplaceAll: 'Warnung: Dies ersetzt alle vorhandenen Konfigurationen!',
      exportsAllData: 'Exportiert alle Konfigurationen und Benutzerdaten als JSON-Datei',
      databaseExportSuccess: 'Datenbank erfolgreich exportiert',
      databaseExportError: 'Fehler beim Exportieren der Datenbank',
      databaseImportSuccess: 'Datenbank erfolgreich importiert: {count} Konfigurationen',
      databaseImportError: 'Datenbank-Import fehlgeschlagen: {error}',
      invalidJson: 'Ungültiges JSON-Dateiformat',
      invalidFileStructure: 'Ungültige Dateistruktur',
      invalidDatabaseStructure: 'Ungültige Datenbank-Dump-Struktur',
      exportActiveConfig: 'Aktive Konfiguration exportieren',
      exportAllConfigs: 'Alle Konfigurationen exportieren',
    },
    system: {
      title: 'Systeminformationen',
      subtitle: 'Version und Systemdetails',
      appVersion: 'Anwendungsversion',
      currentVersion: 'Aktuelle Version',
      checkingForUpdates: 'Suche nach Updates...',
      updateAvailable: 'Update verfügbar',
      upToDate: 'Auf dem neuesten Stand',
      updateNow: 'Jetzt aktualisieren',
      updating: 'Aktualisiere...',
      updateError: 'Fehler beim Prüfen auf Updates',
      checkForUpdates: 'Nach Updates suchen',
      hostInfo: 'Host-Informationen',
      hardwareInfo: 'Hardware',
      loading: 'Laden...',
      errorLoading: 'Fehler beim Laden der Systeminformationen',
      os: 'Betriebssystem',
      host: 'Hostname',
      kernel: 'Kernel',
      uptime: 'Betriebszeit',
      cpu: 'CPU',
      model: 'Modell',
      cores: 'Kerne',
      gpu: 'GPU',
      memory: 'Arbeitsspeicher',
      total: 'Gesamt',
      used: 'Verwendet',
      free: 'Frei',
      ipAddresses: 'IP-Adressen',
      disks: 'Festplatten',
      days: 'T',
      hours: 'Std',
      minutes: 'Min',
      seconds: 'Sek',
      reset: 'System Zurücksetzen',
      resetTitle: 'System Zurücksetzen',
      resetDescription: 'Löscht alle Daten, einschließlich des Admin-Benutzers, und setzt das System auf die Standardkonfiguration zurück. Der Admin-Benutzer muss nach dem Reset neu angelegt werden.',
      resetConfirm: 'Zurücksetzen',
      resetWarning: 'Warnung: Dies löscht alle Konfigurationen und setzt das System auf die Standardkonfiguration zurück. Diese Aktion kann nicht rückgängig gemacht werden!',
      resetting: 'Wird zurückgesetzt...',
    },
    about: {
      title: `Über ${APP_NAME}`,
      subtitle: 'NeXT Computer Konfigurationsverwaltung',
      description: `${APP_NAME} ist ein modernes webbasiertes Konfigurationsverwaltungstool, das speziell für NeXT Computer-Systeme entwickelt wurde. Es bietet eine intuitive Oberfläche für die Verwaltung von Systemkonfigurationsdateien mit Fokus auf Sicherheit und Benutzerfreundlichkeit.`,
      features: 'Hauptfunktionen',
      featureAuth: 'Sichere Authentifizierung',
      featureAuthDesc: 'PAM-basierte Authentifizierung mit Ihren Linux-Systemanmeldedaten',
      featureConfig: 'Konfigurationsverwaltung',
      featureConfigDesc: 'Erstellen, bearbeiten und verwalten Sie Konfigurationsdateien mit einer benutzerfreundlichen Oberfläche',
      featureImportExport: 'Import/Export',
      featureImportExportDesc: 'Sichern und wiederherstellen Sie Ihre Konfigurationen einfach',
      featureTheme: 'Theme-Unterstützung',
      featureThemeDesc: 'Helle und dunkle Themes mit NeXT-inspiriertem Design',
      technology: 'Erstellt mit modernen Web-Technologien: React, TypeScript und Vite',
      madeBy: 'Erstellt mit ❤️ von',
      layeredResources: 'LAYERED Ressourcen',
      previousResources: 'Previous Ressourcen',
      previousSite: 'Previous Emulator Offizielle Website',
      previousSourceforge: 'Previous auf SourceForge',
      generalResources: 'Allgemeine Ressourcen',
      nextWikipedia: 'Über NeXT Computer',
      version: 'Version',
      currentVersion: 'Aktuelle Version',
      checkingForUpdates: 'Suche nach Updates...',
      updateAvailable: 'Update verfügbar',
      upToDate: 'Auf dem neuesten Stand',
      updateNow: 'Jetzt aktualisieren',
      updating: 'Aktualisiere...',
      updateError: 'Fehler beim Prüfen auf Updates',
      checkForUpdates: 'Nach Updates suchen',
      layeredOfficialWebsite: 'LAYERED Offizielle Website',
      layeredMastodon: 'LAYERED auf Mastodon',
      layeredCodeberg: 'phranck aka LAYERED auf Codeberg',
    },
    common: {
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      confirm: 'Bestätigen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      reload: 'Neuladen',
    },
  },
  it: {
    footer: {
      copyright: '© LAYERED.work',
      madeIn: 'fatto con ❤️ e',
      inBregenz: 'a Bregenz',
      atLakeConstance: 'sul Lago di Costanza',
      austria: 'Austria',
    },
    login: {
      title: APP_NAME,
      subtitle: 'Accedi al tuo account',
      username: 'Nome utente',
      usernamePlaceholder: 'Scegli un nome utente (min. 3 caratteri)',
      password: 'Password',
      passwordPlaceholder: 'Scegli una password (min. 6 caratteri)',
      signIn: 'Accedi',
      signingIn: 'Accesso in corso...',
      setupTitle: `Benvenuto in ${APP_NAME}`,
      setupSubtitle: 'Crea il tuo account amministratore',
      confirmPassword: 'Conferma password',
      confirmPasswordPlaceholder: 'Inserisci nuovamente la password',
      createAccount: 'Crea account',
      creatingAccount: 'Creazione account...',
      passwordMismatch: 'Le password non corrispondono',
      loginFailed: 'Accesso fallito',
      footer: 'Gestisci le tue configurazioni NeXT Computer.',
      madeBy: 'Realizzato con ❤️ da',
    },
    layout: {
      title: APP_NAME,
      subtitle: 'Gestore di configurazione NeXT Computer',
      signOut: 'Esci',
    },
    tabs: {
      savedConfigs: 'Configurazioni salvate',
      configEditor: 'Editor di configurazione',
      importExport: 'Importa/Esporta',
      system: 'Sistema',
      about: 'Informazioni',
    },
    configList: {
      title: 'Configurazioni Salvate',
      description: 'Descrizione',
      noConfigs: 'Nessuna configurazione salvata',
      noConfigsDescription: 'Crea la tua prima configurazione per iniziare',
      emptyStateTitle: 'Nessuna configurazione salvata disponibile',
      emptyStateDescription: 'Crea una nuova configurazione Previous',
      search: 'Cerca configurazioni',
      edit: 'Modifica',
      delete: 'Elimina',
      confirmDelete: 'Eliminare questa configurazione?',
      cancel: 'Annulla',
      loading: 'Caricamento configurazioni...',
      newConfig: 'Nuova Configurazione',
      active: 'Attivo',
    },
    configEditor: {
      title: 'Editor di configurazione',
      description: 'Crea e modifica file di configurazione per il tuo NeXT Computer',
      configName: 'Nome configurazione',
      configNamePlaceholder: 'es. Impostazioni di rete',
      configPath: 'Percorso file',
      configPathPlaceholder: 'es. /etc/network/interfaces',
      content: 'Contenuto configurazione',
      contentPlaceholder: 'Inserisci qui la tua configurazione...',
      save: 'Salva configurazione',
      saving: 'Salvataggio...',
      clear: 'Cancella',
      successSaved: 'Configurazione salvata con successo!',
      errorSaving: 'Errore nel salvataggio della configurazione',
      errorLoading: 'Errore nel caricamento delle configurazioni',
      fillAllFields: 'Compila tutti i campi',
      viewModeEditor: 'Editor',
      viewModeRaw: 'Raw',
      copy: 'Copia',
      copiedToClipboard: 'Copiato negli appunti',
      failedToCopy: 'Errore durante la copia',
      sections: {
        system: 'Configurazione Sistema',
        display: 'Configurazione Display',
        scsi: 'Dispositivi SCSI',
        network: 'Configurazione Rete',
        sound: 'Configurazione Audio',
        boot: 'Configurazione Avvio',
        input: 'Dispositivi di Input',
      },
      fields: {
        cpuType: 'Tipo CPU',
        cpuFrequency: 'Frequenza CPU (MHz)',
        memorySize: 'Dimensione Memoria (MB)',
        turboMode: 'Modalità Turbo',
        fpuEnabled: 'FPU Abilitato',
        displayType: 'Tipo Display',
        width: 'Larghezza (pixel)',
        height: 'Altezza (pixel)',
        colorDepth: 'Profondità Colore (bit)',
        frameSkip: 'Frame Skip',
        scsiHd: 'SCSI HD',
        cdRom: 'CD-ROM',
        networkEnabled: 'Rete Abilitata',
        networkType: 'Tipo Rete',
        soundEnabled: 'Audio Abilitato',
        soundOutput: 'Uscita Audio',
        romFile: 'File ROM',
        bootScsiId: 'ID SCSI di Boot',
        keyboardType: 'Tipo Tastiera',
        mouseEnabled: 'Mouse Abilitato',
        pathToDiskImage: 'Percorso immagine disco',
        pathToCdImage: 'Percorso immagine CD',
        pathToRomFile: 'Percorso file ROM',
      },
    },
    importExport: {
      title: 'Importa/Esporta',
      description: 'Backup e ripristino delle tue configurazioni',
      import: 'Importa configurazioni',
      importDescription: 'Seleziona un file JSON per importare le configurazioni',
      selectConfigFile: 'Seleziona file di configurazione esportato',
      importButton: 'Importa',
      importing: 'Importazione...',
      export: 'Esporta configurazioni',
      exportDescription: 'Scarica tutte le configurazioni come file JSON',
      exportButton: 'Esporta tutte le configurazioni',
      exporting: 'Esportazione...',
      successImport: 'Configurazioni importate con successo!',
      successExport: 'Configurazioni esportate con successo!',
      successExportActiveConfig: 'Configurazione attiva esportata con successo.',
      errorImport: 'Errore nell\'importazione delle configurazioni',
      errorExport: 'Errore nell\'esportazione delle configurazioni',
      syncTitle: 'Sincronizza con Previous Emulator',
      syncPath: '/home/next/.config/previous/previous.cfg',
      syncToEmulator: 'Applica configurazione attiva all\'emulatore',
      syncing: 'Sincronizzazione...',
      importFromEmulator: 'Importa dalla configurazione dell\'emulatore',
      loading: 'Caricamento...',
      syncSuccess: 'Configurazione sincronizzata con Previous emulator con successo',
      syncError: 'Errore nella sincronizzazione del file di configurazione',
      noActiveConfig: 'Nessuna configurazione attiva trovata',
      importSuccess: 'Configurazione importata da Previous emulator',
      importError: 'Errore nell\'importazione della configurazione',
      syncHelpApply: 'Applica all\'emulatore: Scrive la configurazione attiva nel file di configurazione dell\'emulatore Previous',
      syncHelpImport: 'Importa dall\'emulatore: Legge la configurazione attuale dell\'emulatore e crea una nuova configurazione nel database',
      notesTitle: 'Note importanti',
      note1: 'Fai sempre un backup delle tue configurazioni prima di apportare modifiche importanti',
      note2: 'Le configurazioni importate non vengono attivate automaticamente',
      note3: 'I percorsi dei file nelle configurazioni potrebbero richiedere modifiche per il tuo sistema',
      note4: 'I file ROM e immagine disco devono esistere nei percorsi specificati',
      noActiveConfigToExport: 'Nessuna configurazione attiva trovata da esportare',
      noConfigsToExport: 'Nessuna configurazione trovata da esportare',
      exportedCount: '{count} configurazione/i esportata/e con successo',
      importedCount: '{count} configurazione/i importata/e con successo',
      importedConfiguration: 'Configurazione importata con successo',
      skippingInvalid: 'Salto voce di configurazione non valida',
      noValidConfigs: 'Nessuna configurazione valida trovata nel file',
      importedConfigName: 'Configurazione Importata',
      invalidFormat: 'Formato file non valido. Atteso campo "config" o "configurations".',
      importFailed: 'Importazione fallita: {error}',
      databaseTitle: 'Backup e Ripristino Database',
      databaseDescription: 'Esporta o importa l\'intero database incluse tutte le configurazioni',
      importDatabase: 'Importa Database',
      importDatabaseDescription: 'Ripristina il database completo da un file di backup',
      selectDatabaseFile: 'Seleziona File Database',
      importingDatabase: 'Importazione...',
      exportDatabase: 'Esporta Database',
      exportDatabaseDescription: 'Crea un backup completo di tutti i dati',
      exportingDatabase: 'Esportazione...',
      exportCompleteDatabase: 'Esporta Database Completo',
      warningReplaceAll: 'Attenzione: Questo sostituirà tutte le configurazioni esistenti!',
      exportsAllData: 'Esporta tutte le configurazioni e i dati utente come file JSON',
      databaseExportSuccess: 'Database esportato con successo',
      databaseExportError: 'Errore nell\'esportazione del database',
      databaseImportSuccess: 'Database importato con successo: {count} configurazioni',
      databaseImportError: 'Importazione database fallita: {error}',
      invalidJson: 'Formato file JSON non valido',
      invalidFileStructure: 'Struttura file non valida',
      invalidDatabaseStructure: 'Struttura dump database non valida',
      exportActiveConfig: 'Esporta Configurazione Attiva',
      exportAllConfigs: 'Esporta Tutte le Configurazioni',
    },
    system: {
      title: 'Informazioni di sistema',
      subtitle: 'Versione e dettagli del sistema',
      appVersion: 'Versione applicazione',
      currentVersion: 'Versione corrente',
      checkingForUpdates: 'Controllo aggiornamenti...',
      updateAvailable: 'Aggiornamento disponibile',
      upToDate: 'Aggiornato',
      updateNow: 'Aggiorna ora',
      updating: 'Aggiornamento...',
      updateError: 'Errore nel controllo aggiornamenti',
      checkForUpdates: 'Controlla aggiornamenti',
      hostInfo: 'Informazioni host',
      hardwareInfo: 'Hardware',
      loading: 'Caricamento...',
      errorLoading: 'Errore nel caricamento delle informazioni di sistema',
      os: 'Sistema operativo',
      host: 'Nome host',
      kernel: 'Kernel',
      uptime: 'Tempo di attività',
      cpu: 'CPU',
      model: 'Modello',
      cores: 'core',
      gpu: 'GPU',
      memory: 'Memoria',
      total: 'Totale',
      used: 'Usato',
      free: 'Libero',
      ipAddresses: 'Indirizzi IP',
      disks: 'Dischi',
      days: 'g',
      hours: 'h',
      minutes: 'm',
      seconds: 's',
      reset: 'Ripristina Sistema',
      resetTitle: 'Ripristina Sistema',
      resetDescription: 'Elimina tutti i dati, incluso l\'utente amministratore, e ripristina la configurazione iniziale. L\'utente amministratore deve essere ricreato dopo il ripristino.',
      resetConfirm: 'Ripristina',
      resetWarning: 'Avvertenza: Questo eliminerà tutte le configurazioni e ripristinerà il sistema alla configurazione iniziale. Questa azione non può essere annullata!',
      resetting: 'Ripristino in corso...',
    },
    about: {
      title: `Informazioni su ${APP_NAME}`,
      subtitle: 'Gestore di configurazione NeXT Computer',
      description: `${APP_NAME} è uno strumento moderno di gestione della configurazione basato sul web progettato specificamente per i sistemi NeXT Computer. Fornisce un'interfaccia intuitiva per gestire i file di configurazione del sistema con attenzione alla sicurezza e alla facilità d'uso.`,
      features: 'Caratteristiche principali',
      featureAuth: 'Autenticazione sicura',
      featureAuthDesc: 'Autenticazione basata su PAM utilizzando le credenziali del sistema Linux',
      featureConfig: 'Gestione configurazione',
      featureConfigDesc: 'Crea, modifica e gestisci file di configurazione con un\'interfaccia user-friendly',
      featureImportExport: 'Importa/Esporta',
      featureImportExportDesc: 'Backup e ripristino delle tue configurazioni facilmente',
      featureTheme: 'Supporto temi',
      featureThemeDesc: 'Temi chiari e scuri con design ispirato a NeXT',
      technology: 'Realizzato con tecnologie web moderne: React, TypeScript e Vite',
      madeBy: 'Realizzato con ❤️ da',
      layeredResources: 'Risorse LAYERED',
      previousResources: 'Risorse Previous',
      previousSite: 'Sito ufficiale Previous Emulator',
      previousSourceforge: 'Previous su SourceForge',
      generalResources: 'Risorse Generali',
      nextWikipedia: 'Informazioni su NeXT Computer',
      version: 'Versione',
      currentVersion: 'Versione corrente',
      checkingForUpdates: 'Controllo aggiornamenti...',
      updateAvailable: 'Aggiornamento disponibile',
      upToDate: 'Aggiornato',
      updateNow: 'Aggiorna ora',
      updating: 'Aggiornamento...',
      updateError: 'Errore nel controllo aggiornamenti',
      checkForUpdates: 'Controlla aggiornamenti',
      layeredOfficialWebsite: 'Sito Ufficiale LAYERED',
      layeredMastodon: 'LAYERED su Mastodon',
      layeredCodeberg: 'phranck aka LAYERED su Codeberg',
    },
    common: {
      loading: 'Caricamento...',
      error: 'Errore',
      success: 'Successo',
      confirm: 'Conferma',
      save: 'Salva',
      cancel: 'Annulla',
      reload: 'Ricarica',
    },
  },
  es: {
    footer: {
      copyright: '© LAYERED.work',
      madeIn: 'hecho con ❤️ y',
      inBregenz: 'en Bregenz',
      atLakeConstance: 'en el Lago de Constanza',
      austria: 'Austria',
    },
    login: {
      title: APP_NAME,
      subtitle: 'Inicia sesión en tu cuenta',
      username: 'Nombre de usuario',
      usernamePlaceholder: 'Elige un nombre de usuario (mín. 3 caracteres)',
      password: 'Contraseña',
      passwordPlaceholder: 'Elige una contraseña (mín. 6 caracteres)',
      signIn: 'Iniciar sesión',
      signingIn: 'Iniciando sesión...',
      setupTitle: `Bienvenido a ${APP_NAME}`,
      setupSubtitle: 'Crea tu cuenta de administrador',
      confirmPassword: 'Confirmar contraseña',
      confirmPasswordPlaceholder: 'Ingresa la contraseña nuevamente',
      createAccount: 'Crear cuenta',
      creatingAccount: 'Creando cuenta...',
      passwordMismatch: 'Las contraseñas no coinciden',
      loginFailed: 'Inicio de sesión fallido',
      footer: 'Administra tus configuraciones NeXT Computer.',
      madeBy: 'Hecho con ❤️ por',
    },
    layout: {
      title: APP_NAME,
      subtitle: 'Gestor de configuración NeXT Computer',
      signOut: 'Cerrar sesión',
    },
    tabs: {
      savedConfigs: 'Configuraciones guardadas',
      configEditor: 'Editor de configuración',
      importExport: 'Importar/Exportar',
      system: 'Sistema',
      about: 'Acerca de',
    },
    configList: {
      title: 'Configuraciones Guardadas',
      description: 'Descripción',
      noConfigs: 'No hay configuraciones guardadas',
      noConfigsDescription: 'Crea tu primera configuración para comenzar',
      emptyStateTitle: 'No hay configuraciones guardadas disponibles',
      emptyStateDescription: 'Crea una nueva configuración de Previous',
      search: 'Buscar configuraciones',
      edit: 'Editar',
      delete: 'Eliminar',
      confirmDelete: '¿Eliminar esta configuración?',
      cancel: 'Cancelar',
      loading: 'Cargando configuraciones...',
      newConfig: 'Nueva Configuración',
      active: 'Activo',
    },
    configEditor: {
      title: 'Editor de configuración',
      description: 'Crea y edita archivos de configuración para tu NeXT Computer',
      configName: 'Nombre de configuración',
      configNamePlaceholder: 'ej. Configuración de red',
      configPath: 'Ruta del archivo',
      configPathPlaceholder: 'ej. /etc/network/interfaces',
      content: 'Contenido de configuración',
      contentPlaceholder: 'Ingresa tu configuración aquí...',
      save: 'Guardar configuración',
      saving: 'Guardando...',
      clear: 'Limpiar',
      successSaved: '¡Configuración guardada con éxito!',
      errorSaving: 'Error al guardar la configuración',
      errorLoading: 'Error al cargar las configuraciones',
      fillAllFields: 'Por favor completa todos los campos',
      viewModeEditor: 'Editor',
      viey: 'Copiar',
      copwModeRaw: 'Raw',
      copiedToClipboard: 'Copiado al portapapeles',
      failedToCopy: 'Error al copiar',
      sections: {
        system: 'Configuración del Sistema',
        display: 'Configuración de Pantalla',
        scsi: 'Dispositivos SCSI',
        network: 'Configuración de Red',
        sound: 'Configuración de Sonido',
        boot: 'Configuración de Arranque',
        input: 'Dispositivos de Entrada',
      },
      fields: {
        cpuType: 'Tipo de CPU',
        cpuFrequency: 'Frecuencia CPU (MHz)',
        memorySize: 'Tamaño de Memoria (MB)',
        turboMode: 'Modo Turbo',
        fpuEnabled: 'FPU Activado',
        displayType: 'Tipo de Pantalla',
        width: 'Ancho (píxeles)',
        height: 'Alto (píxeles)',
        colorDepth: 'Profundidad de Color (bits)',
        frameSkip: 'Salto de Cuadros',
        scsiHd: 'Disco Duro SCSI',
        cdRom: 'CD-ROM',
        networkEnabled: 'Red Activada',
        networkType: 'Tipo de Red',
        soundEnabled: 'Sonido Activado',
        soundOutput: 'Salida de Sonido',
        romFile: 'Archivo ROM',
        bootScsiId: 'ID SCSI de Arranque',
        keyboardType: 'Tipo de Teclado',
        mouseEnabled: 'Ratón Activado',
        pathToDiskImage: 'Ruta a imagen de disco',
        pathToCdImage: 'Ruta a imagen de CD',
        pathToRomFile: 'Ruta a archivo ROM',
      },
    },
    importExport: {
      title: 'Importar/Exportar',
      description: 'Respalda y restaura tus configuraciones',
      import: 'Importar configuraciones',
      importDescription: 'Selecciona un archivo JSON para importar configuraciones',
      selectConfigFile: 'Seleccionar archivo de configuración exportado',
      importButton: 'Importar',
      importing: 'Importando...',
      export: 'Exportar configuraciones',
      exportDescription: 'Descarga todas las configuraciones como archivo JSON',
      exportButton: 'Exportar todas las configuraciones',
      exporting: 'Exportando...',
      successImport: '¡Configuraciones importadas con éxito!',
      successExport: '¡Configuraciones exportadas con éxito!',
      successExportActiveConfig: 'Configuración activa exportada correctamente.',
      errorImport: 'Error al importar las configuraciones',
      errorExport: 'Error al exportar las configuraciones',
      syncTitle: 'Sincronizar con Previous Emulator',
      syncPath: '/home/next/.config/previous/previous.cfg',
      syncToEmulator: 'Aplicar configuración activa al emulador',
      syncing: 'Sincronizando...',
      importFromEmulator: 'Importar desde configuración del emulador',
      loading: 'Cargando...',
      syncSuccess: 'Configuración sincronizada con Previous emulator con éxito',
      syncError: 'Error al sincronizar el archivo de configuración',
      noActiveConfig: 'No se encontró configuración activa',
      importSuccess: 'Configuración importada desde Previous emulator',
      importError: 'Error al importar la configuración',
      syncHelpApply: 'Aplicar al emulador: Escribe la configuración activa en el archivo de configuración del emulador Previous',
      syncHelpImport: 'Importar desde emulador: Lee la configuración actual del emulador y crea una nueva configuración en la base de datos',
      notesTitle: 'Notas importantes',
      note1: 'Siempre respalda tus configuraciones antes de hacer cambios importantes',
      note2: 'Las configuraciones importadas no se activan automáticamente',
      note3: 'Las rutas de archivo en las configuraciones pueden necesitar ajustes para tu sistema',
      note4: 'Los archivos ROM e imágenes de disco deben existir en las rutas especificadas',
      noActiveConfigToExport: 'No se encontró configuración activa para exportar',
      noConfigsToExport: 'No se encontraron configuraciones para exportar',
      exportedCount: '{count} configuración/es exportada/s con éxito',
      importedCount: '{count} configuración/es importada/s con éxito',
      importedConfiguration: 'Configuración importada con éxito',
      skippingInvalid: 'Omitiendo entrada de configuración no válida',
      noValidConfigs: 'No se encontraron configuraciones válidas en el archivo',
      importedConfigName: 'Configuración Importada',
      invalidFormat: 'Formato de archivo no válido. Se esperaba el campo "config" o "configurations".',
      importFailed: 'Importación fallida: {error}',
      databaseTitle: 'Copia de Seguridad y Restauración de Base de Datos',
      databaseDescription: 'Exporta o importa la base de datos completa incluyendo todas las configuraciones',
      importDatabase: 'Importar Base de Datos',
      importDatabaseDescription: 'Restaurar base de datos completa desde un archivo de respaldo',
      selectDatabaseFile: 'Seleccionar Archivo de Base de Datos',
      importingDatabase: 'Importando...',
      exportDatabase: 'Exportar Base de Datos',
      exportDatabaseDescription: 'Crear una copia de seguridad completa de todos los datos',
      exportingDatabase: 'Exportando...',
      exportCompleteDatabase: 'Exportar Base de Datos Completa',
      warningReplaceAll: 'Advertencia: ¡Esto reemplazará todas las configuraciones existentes!',
      exportsAllData: 'Exporta todas las configuraciones y datos de usuario como archivo JSON',
      databaseExportSuccess: 'Base de datos exportada con éxito',
      databaseExportError: 'Error al exportar la base de datos',
      databaseImportSuccess: 'Base de datos importada con éxito: {count} configuraciones',
      databaseImportError: 'Importación de base de datos fallida: {error}',
      invalidJson: 'Formato de archivo JSON no válido',
      invalidFileStructure: 'Estructura de archivo no válida',
      invalidDatabaseStructure: 'Estructura de volcado de base de datos no válida',
      exportActiveConfig: 'Exportar Configuración Activa',
      exportAllConfigs: 'Exportar Todas las Configuraciones',
    },
    system: {
      title: 'Información del sistema',
      subtitle: 'Versión y detalles del sistema',
      appVersion: 'Versión de la aplicación',
      currentVersion: 'Versión actual',
      checkingForUpdates: 'Comprobando actualizaciones...',
      updateAvailable: 'Actualización disponible',
      upToDate: 'Actualizado',
      updateNow: 'Actualizar ahora',
      updating: 'Actualizando...',
      updateError: 'Error al comprobar actualizaciones',
      checkForUpdates: 'Comprobar actualizaciones',
      hostInfo: 'Información del host',
      hardwareInfo: 'Hardware',
      loading: 'Cargando...',
      errorLoading: 'Error al cargar la información del sistema',
      os: 'Sistema operativo',
      host: 'Nombre del host',
      kernel: 'Kernel',
      uptime: 'Tiempo de actividad',
      cpu: 'CPU',
      model: 'Modelo',
      cores: 'núcleos',
      gpu: 'GPU',
      memory: 'Memoria',
      total: 'Total',
      used: 'Usado',
      free: 'Libre',
      ipAddresses: 'Direcciones IP',
      disks: 'Discos',
      days: 'd',
      hours: 'h',
      minutes: 'm',
      seconds: 's',
      reset: 'Restablecer Sistema',
      resetTitle: 'Restablecer Sistema',
      resetDescription: 'Elimina todos los datos, incluido el usuario administrador, y vuelve a la configuración inicial. El usuario administrador debe recrearse después del reinicio.',
      resetConfirm: 'Restablecer',
      resetWarning: '¡Advertencia: Esto eliminará todas las configuraciones y restablecerá el sistema a la configuración inicial. ¡Esta acción no se puede deshacer!',
      resetting: 'Restableciendo...',
    },
    about: {
      title: `Acerca de ${APP_NAME}`,
      subtitle: 'Gestor de configuración NeXT Computer',
      description: `${APP_NAME} es una herramienta moderna de gestión de configuración basada en web diseñada específicamente para sistemas NeXT Computer. Proporciona una interfaz intuitiva para administrar archivos de configuración del sistema teniendo en cuenta la seguridad y la facilidad de uso.`,
      features: 'Características principales',
      featureAuth: 'Autenticación segura',
      featureAuthDesc: 'Autenticación basada en PAM usando tus credenciales del sistema Linux',
      featureConfig: 'Gestión de configuración',
      featureConfigDesc: 'Crea, edita y gestiona archivos de configuración con una interfaz amigable',
      featureImportExport: 'Importar/Exportar',
      featureImportExportDesc: 'Respalda y restaura tus configuraciones fácilmente',
      featureTheme: 'Soporte de temas',
      featureThemeDesc: 'Temas claro y oscuro con diseño inspirado en NeXT',
      technology: 'Construido con tecnologías web modernas: React, TypeScript y Vite',
      madeBy: 'Hecho con ❤️ por',
      layeredResources: 'Recursos de LAYERED',
      previousResources: 'Recursos de Previous',
      previousSite: 'Sitio oficial de Previous Emulator',
      previousSourceforge: 'Previous en SourceForge',
      generalResources: 'Recursos Generales',
      nextWikipedia: 'Acerca de NeXT Computer',
      version: 'Versión',
      currentVersion: 'Versión actual',
      checkingForUpdates: 'Comprobando actualizaciones...',
      updateAvailable: 'Actualización disponible',
      upToDate: 'Actualizado',
      updateNow: 'Actualizar ahora',
      updating: 'Actualizando...',
      updateError: 'Error al comprobar actualizaciones',
      checkForUpdates: 'Comprobar actualizaciones',
      layeredOfficialWebsite: 'Sitio Oficial de LAYERED',
      layeredMastodon: 'LAYERED en Mastodon',
      layeredCodeberg: 'phranck aka LAYERED en Codeberg',
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      confirm: 'Confirmar',
      save: 'Guardar',
      reload: 'Recargar',
      cancel: 'Cancelar',
    },
  },
  fr: {
    footer: {
      copyright: '© LAYERED.work',
      madeIn: 'fait avec ❤️ à Bregenz',
      atLakeConstance: 'au lac de Constance',
      austria: 'Autriche',
    },
    login: {
      title: APP_NAME,
      subtitle: 'Connectez-vous à votre compte',
      username: 'Nom d\'utilisateur',
      usernamePlaceholder: 'Choisissez un nom d\'utilisateur (min. 3 caractères)',
      password: 'Mot de passe',
      passwordPlaceholder: 'Choisissez un mot de passe (min. 6 caractères)',
      signIn: 'Se connecter',
      signingIn: 'Connexion en cours...',
      setupTitle: `Bienvenue sur ${APP_NAME}`,
      setupSubtitle: 'Créez votre compte administrateur',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Entrez à nouveau le mot de passe',
      createAccount: 'Créer un compte',
      creatingAccount: 'Création du compte...',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      loginFailed: 'Échec de la connexion',
      footer: 'Gérez vos configurations NeXT Computer.',
      madeBy: 'Créé avec ❤️ par',
    },
    layout: {
      title: APP_NAME,
      subtitle: 'Gestionnaire de configuration NeXT Computer',
      signOut: 'Se déconnecter',
    },
    tabs: {
      savedConfigs: 'Configurations enregistrées',
      configEditor: 'Éditeur de configuration',
      importExport: 'Importer/Exporter',
      system: 'Système',
      about: 'À propos',
    },
    configList: {
      title: 'Configurations Enregistrées',
      description: 'Description',
      noConfigs: 'Aucune configuration enregistrée',
      noConfigsDescription: 'Créez votre première configuration pour commencer',
      emptyStateTitle: 'Aucune configuration enregistrée disponible',
      emptyStateDescription: 'Créer une nouvelle configuration Previous',
      search: 'Rechercher des configurations',
      edit: 'Modifier',
      delete: 'Supprimer',
      confirmDelete: 'Supprimer cette configuration ?',
      cancel: 'Annuler',
      loading: 'Chargement des configurations...',
      newConfig: 'Nouvelle Configuration',
      active: 'Actif',
    },
    configEditor: {
      title: 'Éditeur de configuration',
      description: 'Créez et modifiez des fichiers de configuration pour votre NeXT Computer',
      configName: 'Nom de la configuration',
      configNamePlaceholder: 'ex. Paramètres réseau',
      configPath: 'Chemin du fichier',
      configPathPlaceholder: 'ex. /etc/network/interfaces',
      content: 'Contenu de la configuration',
      contentPlaceholder: 'Entrez votre configuration ici...',
      save: 'Enregistrer la configuration',
      saving: 'Enregistrement...',
      clear: 'Effacer',
      successSaved: 'Configuration enregistrée avec succès !',
      errorSaving: 'Erreur lors de l\'enregistrement de la configuration',
      errorLoading: 'Erreur lors du chargement des configurations',
      fillAllFields: 'Veuillez remplir tous les champs',
      viewModeEditor: 'Éditeur',
      viey: 'Copier',
      copwModeRaw: 'Brut',
      copiedToClipboard: 'Copié dans le presse-papiers',
      failedToCopy: 'Échec de la copie',
      sections: {
        system: 'Configuration Système',
        display: 'Configuration Affichage',
        scsi: 'Périphériques SCSI',
        network: 'Configuration Réseau',
        sound: 'Configuration Audio',
        boot: 'Configuration Démarrage',
        input: 'Périphériques d\'Entrée',
      },
      fields: {
        cpuType: 'Type de CPU',
        cpuFrequency: 'Fréquence CPU (MHz)',
        memorySize: 'Taille Mémoire (MB)',
        turboMode: 'Mode Turbo',
        fpuEnabled: 'FPU Activé',
        displayType: 'Type d\'Affichage',
        width: 'Largeur (pixels)',
        height: 'Hauteur (pixels)',
        colorDepth: 'Profondeur Couleur (bits)',
        frameSkip: 'Saut d\'Image',
        scsiHd: 'Disque Dur SCSI',
        cdRom: 'CD-ROM',
        networkEnabled: 'Réseau Activé',
        networkType: 'Type de Réseau',
        soundEnabled: 'Audio Activé',
        soundOutput: 'Sortie Audio',
        romFile: 'Fichier ROM',
        bootScsiId: 'ID SCSI de Démarrage',
        keyboardType: 'Type de Clavier',
        mouseEnabled: 'Souris Activée',
        pathToDiskImage: 'Chemin vers image disque',
        pathToCdImage: 'Chemin vers image CD',
        pathToRomFile: 'Chemin vers fichier ROM',
      },
    },
    importExport: {
      title: 'Importer/Exporter',
      description: 'Sauvegardez et restaurez vos configurations',
      import: 'Importer des configurations',
      importDescription: 'Sélectionnez un fichier JSON pour importer des configurations',
      selectConfigFile: 'Sélectionner un fichier de configuration exporté',
      importButton: 'Importer',
      importing: 'Importation...',
      export: 'Exporter des configurations',
      exportDescription: 'Téléchargez toutes les configurations sous forme de fichier JSON',
      exportButton: 'Exporter toutes les configurations',
      exporting: 'Exportation...',
      successImport: 'Configurations importées avec succès !',
      successExport: 'Configurations exportées avec succès !',
      successExportActiveConfig: 'Configuration active exportée avec succès.',
      errorImport: 'Erreur lors de l\'importation des configurations',
      errorExport: 'Erreur lors de l\'exportation des configurations',
      syncTitle: 'Synchroniser avec Previous Emulator',
      syncPath: '/home/next/.config/previous/previous.cfg',
      syncToEmulator: 'Appliquer la configuration active à l\'émulateur',
      syncing: 'Synchronisation...',
      importFromEmulator: 'Importer depuis la configuration de l\'émulateur',
      loading: 'Chargement...',
      syncSuccess: 'Configuration synchronisée avec Previous emulator avec succès',
      syncError: 'Échec de la synchronisation du fichier de configuration',
      noActiveConfig: 'Aucune configuration active trouvée',
      importSuccess: 'Configuration importée depuis Previous emulator',
      importError: 'Erreur lors de l\'importation de la configuration',
      syncHelpApply: 'Appliquer à l\'émulateur : Écrit la configuration active dans le fichier de configuration de l\'émulateur Previous',
      syncHelpImport: 'Importer depuis l\'émulateur : Lit la configuration actuelle de l\'émulateur et crée une nouvelle configuration dans la base de données',
      notesTitle: 'Notes importantes',
      note1: 'Sauvegardez toujours vos configurations avant d\'apporter des modifications importantes',
      note2: 'Les configurations importées ne sont pas activées automatiquement',
      note3: 'Les chemins de fichiers dans les configurations peuvent nécessiter des ajustements pour votre système',
      note4: 'Les fichiers ROM et images disque doivent exister aux chemins spécifiés',
      noActiveConfigToExport: 'Aucune configuration active trouvée à exporter',
      noConfigsToExport: 'Aucune configuration trouvée à exporter',
      exportedCount: '{count} configuration(s) exportée(s) avec succès',
      importedCount: '{count} configuration(s) importée(s) avec succès',
      importedConfiguration: 'Configuration importée avec succès',
      skippingInvalid: 'Ignorer l\'entrée de configuration invalide',
      noValidConfigs: 'Aucune configuration valide trouvée dans le fichier',
      importedConfigName: 'Configuration Importée',
      invalidFormat: 'Format de fichier invalide. Champ "config" ou "configurations" attendu.',
      importFailed: 'Échec de l\'importation : {error}',
      databaseTitle: 'Sauvegarde et Restauration de la Base de Données',
      databaseDescription: 'Exporter ou importer la base de données complète incluant toutes les configurations',
      importDatabase: 'Importer la Base de Données',
      importDatabaseDescription: 'Restaurer la base de données complète à partir d\'un fichier de sauvegarde',
      selectDatabaseFile: 'Sélectionner le Fichier de Base de Données',
      importingDatabase: 'Importation...',
      exportDatabase: 'Exporter la Base de Données',
      exportDatabaseDescription: 'Créer une sauvegarde complète de toutes les données',
      exportingDatabase: 'Exportation...',
      exportCompleteDatabase: 'Exporter la Base de Données Complète',
      warningReplaceAll: 'Attention : Cela remplacera toutes les configurations existantes !',
      exportsAllData: 'Exporte toutes les configurations et données utilisateur sous forme de fichier JSON',
      databaseExportSuccess: 'Base de données exportée avec succès',
      databaseExportError: 'Erreur lors de l\'exportation de la base de données',
      databaseImportSuccess: 'Base de données importée avec succès : {count} configurations',
      databaseImportError: 'Échec de l\'importation de la base de données : {error}',
      invalidJson: 'Format de fichier JSON invalide',
      invalidFileStructure: 'Structure de fichier invalide',
      invalidDatabaseStructure: 'Structure de dump de base de données invalide',
      exportActiveConfig: 'Exporter la Configuration Active',
      exportAllConfigs: 'Exporter Toutes les Configurations',
    },
    system: {
      title: 'Informations système',
      subtitle: 'Version et détails du système',
      appVersion: 'Version de l\'application',
      currentVersion: 'Version actuelle',
      checkingForUpdates: 'Vérification des mises à jour...',
      updateAvailable: 'Mise à jour disponible',
      upToDate: 'À jour',
      updateNow: 'Mettre à jour maintenant',
      updating: 'Mise à jour...',
      updateError: 'Erreur lors de la vérification des mises à jour',
      checkForUpdates: 'Vérifier les mises à jour',
      hostInfo: 'Informations sur l\'hôte',
      hardwareInfo: 'Matériel',
      loading: 'Chargement...',
      errorLoading: 'Erreur lors du chargement des informations système',
      os: 'Système d\'exploitation',
      host: 'Nom d\'hôte',
      kernel: 'Noyau',
      uptime: 'Temps de fonctionnement',
      cpu: 'CPU',
      model: 'Modèle',
      cores: 'cœurs',
      gpu: 'GPU',
      memory: 'Mémoire',
      total: 'Total',
      used: 'Utilisé',
      free: 'Libre',
      ipAddresses: 'Adresses IP',
      disks: 'Disques',
      days: 'j',
      hours: 'h',
      minutes: 'm',
      seconds: 's',
      reset: 'Réinitialiser le Système',
      resetTitle: 'Réinitialiser le Système',
      resetDescription: 'Supprime toutes les données, y compris l\'utilisateur administrateur, et revenir à la configuration initiale. L\'utilisateur administrateur doit être recréé après la réinitialisation.',
      resetConfirm: 'Réinitialiser',
      resetWarning: 'Attention: Ceci supprimera toutes les configurations et réinitialisera le système à la configuration initiale. Cette action ne peut pas être annulée!',
      resetting: 'Réinitialisation...',
    },
    about: {
      title: `À propos de ${APP_NAME}`,
      subtitle: 'Gestionnaire de configuration NeXT Computer',
      description: `${APP_NAME} est un outil moderne de gestion de configuration basé sur le web conçu spécifiquement pour les systèmes NeXT Computer. Il fournit une interface intuitive pour gérer les fichiers de configuration du système avec la sécurité et la facilité d'utilisation à l'esprit.`,
      features: 'Fonctionnalités principales',
      featureAuth: 'Authentification sécurisée',
      featureAuthDesc: 'Authentification basée sur PAM utilisant vos identifiants système Linux',
      featureConfig: 'Gestion de la configuration',
      featureConfigDesc: 'Créez, modifiez et gérez des fichiers de configuration avec une interface conviviale',
      featureImportExport: 'Importer/Exporter',
      featureImportExportDesc: 'Sauvegardez et restaurez vos configurations facilement',
      featureTheme: 'Support des thèmes',
      featureThemeDesc: 'Thèmes clair et sombre avec un design inspiré de NeXT',
      technology: 'Construit avec des technologies web modernes : React, TypeScript et Vite',
      madeBy: 'Créé avec ❤️ par',
      layeredResources: 'Ressources LAYERED',
      previousResources: 'Ressources Previous',
      previousSite: 'Site officiel de Previous Emulator',
      previousSourceforge: 'Previous sur SourceForge',
      generalResources: 'Ressources Générales',
      nextWikipedia: 'À propos de NeXT Computer',
      version: 'Version',
      currentVersion: 'Version actuelle',
      checkingForUpdates: 'Vérification des mises à jour...',
      updateAvailable: 'Mise à jour disponible',
      upToDate: 'À jour',
      updateNow: 'Mettre à jour maintenant',
      updating: 'Mise à jour...',
      updateError: 'Erreur lors de la vérification des mises à jour',
      checkForUpdates: 'Vérifier les mises à jour',
      layeredOfficialWebsite: 'Site Officiel LAYERED',
      layeredMastodon: 'LAYERED sur Mastodon',
      layeredCodeberg: 'phranck aka LAYERED sur Codeberg',
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      reload: 'Recharger',
      cancel: 'Annuler',
    },
  },
};

export function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('it')) return 'it';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';

  return 'en';
}
