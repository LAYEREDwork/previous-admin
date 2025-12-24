import { BiDownload, BiUpload, BiFile } from 'react-icons/bi';
import { PAButton } from '../../controls/PAButton';
import { Translations } from '../../../lib/translations';
import { Configuration } from '../../../lib/database';

interface ConfigImportExportPartialProps {
    importing: boolean;
    exporting: boolean;
    configs: Configuration[];
    importConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
    exportConfig: () => void;
    exportAllConfigs: () => void;
    controlSize: 'xs' | 'sm' | 'md' | 'lg';
    translation: Translations;
}

export function ConfigImportExportPartial({
    importing,
    exporting,
    configs,
    importConfig,
    exportConfig,
    exportAllConfigs,
    controlSize,
    translation
}: ConfigImportExportPartialProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Import Config */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center">
                        <BiDownload size={20} className="text-next-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {translation.importExport.import}
                    </h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {translation.importExport.importDescription}
                </p>

                <label className="block">
                    <input
                        type="file"
                        accept=".json"
                        multiple
                        onChange={importConfig}
                        disabled={importing}
                        className="hidden"
                        id="import-file"
                    />
                    <PAButton
                        as="span"
                        appearance="primary"
                        loading={importing}
                        block
                        className="flex items-center justify-center gap-2 cursor-pointer"
                        size={controlSize}
                    >
                        <BiFile size={18} />
                        {importing ? translation.importExport.importing : translation.importExport.selectConfigFile}
                    </PAButton>
                </label>

                <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                    <p className="text-xs text-cyan-800 dark:text-cyan-300">
                        {translation.importExport.importDescription}
                    </p>
                </div>
            </div>

            {/* Export Config */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <BiUpload size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {translation.importExport.export}
                    </h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {translation.importExport.exportDescription}
                </p>

                <div className="space-y-3">
                    <PAButton
                        onClick={exportConfig}
                        disabled={exporting || !configs.find(config => config.is_active)}
                        loading={exporting}
                        appearance="primary"
                        color="green"
                        block
                        className="flex items-center justify-center gap-2"
                        size={controlSize}
                    >
                        <BiUpload size={18} />
                        {exporting ? translation.importExport.exporting : translation.importExport.exportActiveConfig}
                    </PAButton>

                    <PAButton
                        onClick={exportAllConfigs}
                        disabled={exporting || configs.length === 0}
                        loading={exporting}
                        appearance="default"
                        block
                        className="flex items-center justify-center gap-2"
                        size={controlSize}
                    >
                        <BiUpload size={18} />
                        {exporting ? translation.importExport.exporting : translation.importExport.exportAllConfigs}
                    </PAButton>
                </div>

                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-green-800 dark:text-green-300">
                        {translation.importExport.exportDescription}
                    </p>
                </div>
            </div>
        </div>
    );
}
