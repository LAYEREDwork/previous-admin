import { Panel } from 'rsuite';

interface EditorSectionPartialProps {
    title: string;
    children: React.ReactNode;
    expanded: boolean;
    onToggle: (expanded: boolean) => void;
}

export function EditorSectionPartial({ title, children, expanded, onToggle }: EditorSectionPartialProps) {
    return (
        <Panel
            header={<div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 p-0.5 cursor-pointer">{title}</div>}
            collapsible
            expanded={expanded}
            onSelect={() => onToggle(!expanded)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors duration-200"
        >
            <div className="p-2 sm:p-3">
                <div className="grid gap-4 sm:gap-6">{children}</div>
            </div>
        </Panel>
    );
}
