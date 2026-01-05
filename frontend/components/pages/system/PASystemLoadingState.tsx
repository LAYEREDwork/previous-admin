import { Loader } from 'rsuite';

import type { Translations } from '../../../lib/translations';
import { PACard } from '../../controls/PACard';

interface SystemLoadingStateProps {
  translation: Translations;
}

/**
 * Loading state component for the system page
 * Displays a vertical RSuite Loader with slow spinning animation
 */
export function SystemLoadingState({ translation }: SystemLoadingStateProps) {
  return (
    <PACard>
      <div className="flex items-center justify-center py-8">
        <Loader size="md" speed="slow" vertical content={translation.system.loading} />
      </div>
    </PACard>
  );
}