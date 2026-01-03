import { ReactNode } from 'react';
import { PACard } from '../../controls/PACard';

interface EditorSectionPartialProps {
    title: string;
    children: React.ReactNode;
    expanded: boolean;
    onToggle: (expanded: boolean) => void;
    icon?: ReactNode;
}

export function EditorSectionPartial({ title, children, expanded, onToggle, icon }: EditorSectionPartialProps) {
    return (
        <PACard
            header={
                <div className="flex items-center gap-4">
                    {icon && <div className="flex-shrink-0 text-[var(--rs-text-primary)]">{icon}</div>}
                    <span className="text-base sm:text-lg font-semibold text-[var(--rs-text-primary)] leading-none">{title}</span>
                </div>
            }
            collapsible
            expanded={expanded}
            onToggle={onToggle}
            className="transition-colors duration-200"
        >
            <div className="p-4 sm:p-6">
                <div className="grid gap-2 sm:gap-3">{children}</div>
            </div>
        </PACard>
    );
}
