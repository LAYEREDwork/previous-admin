import { BiDownload, BiUpload, BiFile } from 'react-icons/bi';
import { PAButton } from '../../controls/PAButton';
import { PACard } from '../../controls/PACard';
import { Translations } from '../../../lib/translations';
import { Configuration } from '../../../lib/database';
import { PASize } from '../../../lib/types/sizes';

interface ConfigImportExportPartialProps {
    importing: boolean;
    exporting: boolean;
    configs: Configuration[];
    importConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
    exportConfig: () => void;
    exportAllConfigs: () => void;
    controlSize: PASize;
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
            <PACard
                header={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--rs-bg-info)] rounded-lg flex items-center justify-center">
                            <BiDownload size={20} className="text-[var(--rs-primary-500)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--rs-text-primary)]">
                            {translation.importExport.import}
                        </h3>
                    </div>
                }
            >
                <div className="space-y-4">

                <p className="text-sm text-[var(--rs-text-secondary)] mb-4">
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

                <div className="mt-4 p-3 bg-[var(--rs-bg-info)] rounded-lg">
                    <p className="text-xs text-[var(--rs-text-info)]">
                        {translation.importExport.importDescription}
                    </p>
                </div>
                </div>
            </PACard>

            {/* Export Config */}
            <PACard
                header={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--rs-bg-success)] rounded-lg flex items-center justify-center">
                            <BiUpload size={20} className="text-[var(--rs-text-success)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--rs-text-primary)]">
                            {translation.importExport.export}
                        </h3>
                    </div>
                }
            >
                <div className="space-y-4">
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

                    <div className="mt-4 p-3 bg-[var(--rs-bg-success)] rounded-lg">
                        <p className="text-xs text-[var(--rs-text-success)]">
                            {translation.importExport.exportDescription}
                        </p>
                    </div>
                </div>
            </PACard>
        </div>
    );
}
