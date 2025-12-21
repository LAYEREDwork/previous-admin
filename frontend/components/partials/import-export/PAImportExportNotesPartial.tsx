import { Translations } from '../../../lib/translations';

interface ImportExportNotesPartialProps {
    translation: Translations;
}

export function ImportExportNotesPartial({ translation }: ImportExportNotesPartialProps) {
    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                {translation.importExport.notesTitle}
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1 list-disc list-inside">
                <li>{translation.importExport.note1}</li>
                <li>{translation.importExport.note2}</li>
                <li>{translation.importExport.note3}</li>
                <li>{translation.importExport.note4}</li>
            </ul>
        </div>
    );
}
