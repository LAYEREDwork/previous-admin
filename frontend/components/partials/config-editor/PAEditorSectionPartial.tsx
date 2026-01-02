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
            header={<span className="text-base sm:text-lg font-semibold text-[var(--rs-text-primary)] leading-none">{title}</span>}
            collapsible
            expanded={expanded}
            onToggle={onToggle}
            className="transition-colors duration-200"
        >
            <div className="p-2 sm:p-3">
                <div className="grid gap-4 sm:gap-6">{children}</div>
            </div>
        </PACard>
    );
}
