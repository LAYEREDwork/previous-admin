import { BiError } from 'react-icons/bi';
import type { Translations } from '../../../lib/translations';

interface SystemErrorStateProps {
  translation: Translations;
}

/**
 * Error state component for the system page
 */
export function SystemErrorState({ translation }: SystemErrorStateProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <BiError size={16} />
        <span className="text-sm">{translation.system.errorLoading}</span>
      </div>
    </div>
  );
}