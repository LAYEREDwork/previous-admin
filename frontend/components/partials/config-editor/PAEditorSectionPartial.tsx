import { PACard } from '../../controls/PACard';

interface EditorSectionPartialProps {
    title: string;
    children: React.ReactNode;
    expanded: boolean;
    onToggle: (expanded: boolean) => void;
}

export function EditorSectionPartial({ title, children, expanded, onToggle }: EditorSectionPartialProps) {
    return (
        <PACard
            header={<div className="text-base sm:text-lg font-semibold text-[var(--rs-text-primary)] p-0.5">{title}</div>}
            collapsible
            defaultExpanded={expanded}
            onToggle={onToggle}
            className="transition-colors duration-200"
        >
            <div className="p-2 sm:p-3">
                <div className="grid gap-4 sm:gap-6">{children}</div>
            </div>
        </PACard>
    );
}
