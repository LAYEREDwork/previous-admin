import { BiError } from 'react-icons/bi';

import type { Translations } from '../../../lib/translations';
import { PACard } from '../../controls/PACard';

interface SystemErrorStateProps {
  translation: Translations;
}

/**
 * Error state component for the system page
 */
export function SystemErrorState({ translation }: SystemErrorStateProps) {
  return (
    <PACard>
      <div className="flex items-center gap-2 text-[var(--rs-text-error)]">
        <BiError size={16} />
        <span className="text-sm">{translation.system.errorLoading}</span>
      </div>
    </PACard>
  );
}