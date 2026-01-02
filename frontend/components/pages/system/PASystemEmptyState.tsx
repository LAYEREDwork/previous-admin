import { PACard } from '../../controls/PACard';

/**
 * Empty state component for the system page when no system information is available
 */
export function SystemEmptyState() {
  return (
    <PACard>
      <div className="flex items-center gap-2 text-[var(--rs-text-secondary)]">
        <span className="text-sm">Unable to load system information</span>
      </div>
    </PACard>
  );
}