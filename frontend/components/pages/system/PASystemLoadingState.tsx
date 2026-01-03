import type { Translations } from '../../../lib/translations';
import { PACard } from '../../controls/PACard';
import { SFArrowTrianglehead2ClockwiseRotate90CircleFill } from '../../sf-symbols';

interface SystemLoadingStateProps {
  translation: Translations;
}

/**
 * Loading state component for the system page
 */
export function SystemLoadingState({ translation }: SystemLoadingStateProps) {
  return (
    <PACard>
      <div className="flex items-center gap-2 text-[var(--rs-primary-500)]">
        <SFArrowTrianglehead2ClockwiseRotate90CircleFill size={16} className="animate-spin" />
        <span className="text-sm">{translation.system.loading}</span>
      </div>
    </PACard>
  );
}