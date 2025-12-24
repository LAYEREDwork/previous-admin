import { BiRefresh } from 'react-icons/bi';
import type { Translations } from '../../../lib/translations';

interface SystemLoadingStateProps {
  translation: Translations;
}

/**
 * Loading state component for the system page
 */
export function SystemLoadingState({ translation }: SystemLoadingStateProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 text-next-accent">
        <BiRefresh size={16} className="animate-spin" />
        <span className="text-sm">{translation.system.loading}</span>
      </div>
    </div>
  );
}