// Components
import { useEffect } from 'react';

import { PageWrapper } from '@frontend/components/controls/PAPageWrapper';
import { useImportExport } from '@frontend/hooks/useImportExport';
import { usePageBase } from '@frontend/hooks/usePageBase';
import { PASize } from '@frontend/lib/types/sizes';

import { ConfigFileSyncPartial } from '../partials/import-export/PAConfigFileSyncPartial';

// Partials
import { ConfigImportExportPartial } from '../partials/import-export/PAConfigImportExportPartial';
import { DatabaseImportExportPartial } from '../partials/import-export/PADatabaseImportExportPartial';
import { ImportExportNotesPartial } from '../partials/import-export/PAImportExportNotesPartial';

// Hooks

/**
 * Import/Export page component
 */
export function PAImportExport() {
  const { translation, controlSize } = usePageBase(PASize.lg);
  const {
    importing,
    exporting,
    databaseExporting,
    databaseImporting,
    configs,
    exportConfig,
    exportAllConfigs,
    importConfig,
    importConfigFromObject,
    exportDatabaseDump,
    importDatabaseDump,
  } = useImportExport();

  // Handle config import from emulator
  useEffect(() => {
    const handleConfigImported = (event: CustomEvent) => {
      const { config } = event.detail;
      // Import as new config with default name
      importConfigFromObject(config, 'Imported from Emulator');
    };

    window.addEventListener('configImported', handleConfigImported as EventListener);

    return () => {
      window.removeEventListener('configImported', handleConfigImported as EventListener);
    };
  }, [importConfigFromObject]);

  return (
    <PageWrapper>
      <div>
        <h2 className="text-sm font-semibold text-[var(--rs-text-primary)] mb-2">
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

      {/* Database Import/Export */}
      <DatabaseImportExportPartial
        databaseImporting={databaseImporting}
        databaseExporting={databaseExporting}
        importDatabaseDump={importDatabaseDump}
        exportDatabaseDump={exportDatabaseDump}
        controlSize={controlSize}
        translation={translation}
      />

      {/* Notes Section */}
      <ImportExportNotesPartial translation={translation} />
    </PageWrapper>
  );
}
