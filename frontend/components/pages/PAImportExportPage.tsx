// Components
import { ConfigFileSyncPartial } from '../partials/PAConfigFileSyncPartial';

// Partials
import { ConfigImportExportPartial } from '../partials/import-export/PAConfigImportExportPartial';
import { DatabaseImportExportPartial } from '../partials/import-export/PADatabaseImportExportPartial';
import { ImportExportNotesPartial } from '../partials/import-export/PAImportExportNotesPartial';

// Hooks
import { useLanguage } from '../../contexts/PALanguageContext';
import { useResponsiveControlSize } from '../../hooks/useResponsiveControlSize';
import { useImportExport } from '../../hooks/useImportExport';
import { PASize } from '../../lib/types/sizes';

/**
 * Import/Export page component
 */
export function PAImportExport() {
  const { translation } = useLanguage();
  const {
    importing,
    exporting,
    databaseExporting,
    databaseImporting,
    configs,
    exportConfig,
    exportAllConfigs,
    importConfig,
    exportDatabaseDump,
    importDatabaseDump,
  } = useImportExport();

  const controlSize = useResponsiveControlSize(PASize.lg);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--rs-text-primary)] mb-2">
          {translation.importExport.title}
        </h2>
        <p className="text-[var(--rs-text-secondary)]">
          {translation.importExport.description}
        </p>
      </div>

      {/* Sync Section */}
      <ConfigFileSyncPartial />

      {/* Config Import/Export */}
      <ConfigImportExportPartial
        importing={importing}
        exporting={exporting}
        configs={configs}
        importConfig={importConfig}
        exportConfig={exportConfig}
        exportAllConfigs={exportAllConfigs}
        controlSize={controlSize}
        translation={translation}
      />

      {/* Notes Section */}
      <ImportExportNotesPartial translation={translation} />

      {/* Database Import/Export */}
      <DatabaseImportExportPartial
        databaseImporting={databaseImporting}
        databaseExporting={databaseExporting}
        importDatabaseDump={importDatabaseDump}
        exportDatabaseDump={exportDatabaseDump}
        controlSize={controlSize}
        translation={translation}
      />
    </div>
  );
}
