import { BiDownload, BiUpload, BiData } from 'react-icons/bi';
import { PAButton } from '../../controls/PAButton';
import { PACard } from '../../controls/PACard';
import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';

interface DatabaseImportExportPartialProps {
    databaseImporting: boolean;
    databaseExporting: boolean;
    importDatabaseDump: (e: React.ChangeEvent<HTMLInputElement>) => void;
    exportDatabaseDump: () => void;
    controlSize: PASize;
    translation: Translations;
}

export function DatabaseImportExportPartial({
    databaseImporting,
    databaseExporting,
    importDatabaseDump,
    exportDatabaseDump,
    controlSize,
    translation
}: DatabaseImportExportPartialProps) {
    return (
        <div className="border-t border-[var(--rs-border-primary)] pt-6">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-[var(--rs-text-primary)] mb-2">
                    {translation.importExport.databaseTitle}
                </h2>
                <p className="text-[var(--rs-text-secondary)]">
                    {translation.importExport.databaseDescription}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Import Database */}
                <PACard
                    header={
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--rs-bg-info)] rounded-lg flex items-center justify-center">
                                <BiData size={20} className="text-[var(--rs-text-info)]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--rs-text-primary)]">
                                {translation.importExport.importDatabase}
                            </h3>
                        </div>
                    }
                >
                    <div className="space-y-4">

                    <p className="text-sm text-[var(--rs-text-secondary)] mb-4">
                        {translation.importExport.importDatabaseDescription}
                    </p>

                    <label className="block">
                        <input
                            type="file"
                            accept=".json"
                            onChange={importDatabaseDump}
                            disabled={databaseImporting}
                            className="hidden"
                            id="import-database"
                        />
                        <PAButton
                            as="span"
                            appearance="primary"
                            loading={databaseImporting}
                            block
                            className="flex items-center justify-center gap-2 cursor-pointer"
                            size={controlSize}
                        >
                            <BiDownload size={18} />
                            {databaseImporting ? translation.importExport.importingDatabase : translation.importExport.selectDatabaseFile}
                        </PAButton>
                    </label>

                    <div className="mt-4 p-3 bg-[var(--rs-bg-error)] rounded-lg">
                        <p className="text-xs text-[var(--rs-text-error)] font-semibold">
                            {translation.importExport.warningReplaceAll}
                        </p>
                    </div>
                    </div>
                </PACard>

                {/* Export Database */}
                <PACard
                    header={
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--rs-bg-info)] rounded-lg flex items-center justify-center">
                                <BiData size={20} className="text-[var(--rs-text-info)]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--rs-text-primary)]">
                                {translation.importExport.exportDatabase}
                            </h3>
                        </div>
                    }
                >
                    <div className="space-y-4">

                    <PAButton
                        onClick={exportDatabaseDump}
                        disabled={databaseExporting}
                        loading={databaseExporting}
                        appearance="primary"
                        color="blue"
                        block
                        className="flex items-center justify-center gap-2"
                        size={controlSize}
                    >
                        <BiUpload size={18} />
                        {databaseExporting ? translation.importExport.exportingDatabase : translation.importExport.exportCompleteDatabase}
                    </PAButton>

                    <div className="mt-4 p-3 bg-[var(--rs-bg-info)] rounded-lg">
                        <p className="text-xs text-[var(--rs-text-info)]">
                            {translation.importExport.exportsAllData}
                        </p>
                    </div>
                    </div>
                </PACard>
            </div>
        </div>
    );
}
