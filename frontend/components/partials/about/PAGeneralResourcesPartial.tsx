import { PACard } from '@frontend/components/controls/PACard';
import { PAResourceLink } from '@frontend/components/controls/PAResourceLink';
import { useLanguage } from '@frontend/contexts/PALanguageContext';

/**
 * Partial component for displaying general resources links.
 */
export function GeneralResourcesPartial() {
  const { translation } = useLanguage();

  return (
    <PACard header={translation.about.generalResources}>
      <div className="space-y-3">
        <PAResourceLink
          href="https://en.wikipedia.org/wiki/NeXT_Computer"
          label={translation.about.nextWikipedia}
          domain="wikipedia.org"
        />
      </div>
    </PACard>
  );
}