import type { Translations } from '../../../lib/translations';

interface SystemPageHeaderProps {
  translation: Translations;
}

/**
 * Header section for the system page containing title and subtitle
 */
export function SystemPageHeader({ translation }: SystemPageHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {translation.system.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        {translation.system.subtitle}
      </p>
    </div>
  );
}