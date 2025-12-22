import { BiDownload, BiUpload, BiData } from 'react-icons/bi';
import { PAButton } from '../../controls/PAButton';
import { Translations } from '../../../lib/translations';

interface DatabaseImportExportPartialProps {
    databaseImporting: boolean;
    databaseExporting: boolean;
    importDatabaseDump: (e: React.ChangeEvent<HTMLInputElement>) => void;
    exportDatabaseDump: () => void;
    controlSize: 'sm' | 'md' | 'lg';
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
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {translation.importExport.databaseTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {translation.importExport.databaseDescription}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Import Database */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <BiData size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {translation.importExport.importDatabase}
                        </h3>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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

                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-xs text-red-800 dark:text-red-300 font-semibold">
                            {translation.importExport.warningReplaceAll}
                        </p>
                    </div>
                </div>

                {/* Export Database */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <BiData size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {translation.importExport.exportDatabase}
                        </h3>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {translation.importExport.exportDatabaseDescription}
                    </p>

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

                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-blue-800 dark:text-blue-300">
                            {translation.importExport.exportsAllData}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
