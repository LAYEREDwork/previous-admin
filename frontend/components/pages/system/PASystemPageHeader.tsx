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
      <h2 className="text-2xl font-bold text-[var(--rs-text-primary)] mb-2">
        {translation.system.title}
      </h2>
      <p className="text-[var(--rs-text-secondary)]">
        {translation.system.subtitle}
      </p>
    </div>
  );
}