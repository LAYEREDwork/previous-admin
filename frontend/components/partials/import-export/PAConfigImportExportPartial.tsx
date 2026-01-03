import { PAButton } from '../../controls/PAButton';
import { PACard } from '../../controls/PACard';
import { Translations } from '../../../lib/translations';
import { Configuration } from '../../../lib/database';
import { PASize } from '../../../lib/types/sizes';
import { SFTrayAndArrowDownFill, SFTrayAndArrowUpFill } from '../../sf-symbols';

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
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--rs-border-info), transparent 85%)' }}>
                            <SFTrayAndArrowDownFill size={20} className="text-[var(--rs-text-info)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--rs-text-primary)] m-0 leading-none">
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
                        <SFTrayAndArrowDownFill size={18} />
                        {importing ? translation.importExport.importing : translation.importExport.selectConfigFile}
                    </PAButton>
                </label>

                <PACard bgColorScheme="info" className="mt-4">
                    <p className="text-xs text-[var(--rs-text-info)]">
                        {translation.importExport.importDescription}
                    </p>
                </PACard>
                </div>
            </PACard>

            {/* Export Config */}
            <PACard
                header={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--rs-border-success), transparent 85%)' }}>
                            <SFTrayAndArrowUpFill size={20} className="text-[var(--rs-text-info)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--rs-text-primary)] m-0 leading-none">
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
                        <SFTrayAndArrowUpFill size={18} />
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
                        <SFTrayAndArrowUpFill size={18} />
                        {exporting ? translation.importExport.exporting : translation.importExport.exportAllConfigs}
                    </PAButton>

                    <PACard bgColorScheme="info" className="mt-4">
                        <p className="text-xs text-[var(--rs-text-info)]">
                            {translation.importExport.exportDescription}
                        </p>
                    </PACard>
                </div>
            </PACard>
        </div>
    );
}
