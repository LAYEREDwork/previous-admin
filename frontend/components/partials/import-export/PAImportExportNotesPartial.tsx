import { Translations } from '../../../lib/translations';
import { PACard } from '../../controls/PACard';

interface ImportExportNotesPartialProps {
    translation: Translations;
}

export function ImportExportNotesPartial({ translation }: ImportExportNotesPartialProps) {
    return (
        <PACard
            header={
                <h4 className="text-sm font-semibold text-[var(--rs-text-warning)]">
                    {translation.importExport.notesTitle}
                </h4>
            }
            bgColorScheme="warning"
        >
            <ul className="text-sm text-[var(--rs-text-warning)] space-y-1 list-disc list-inside">
                <li>{translation.importExport.note1}</li>
                <li>{translation.importExport.note2}</li>
                <li>{translation.importExport.note3}</li>
                <li>{translation.importExport.note4}</li>
            </ul>
        </PACard>
    );
}
