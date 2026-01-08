import { PACard } from '@frontend/components/controls/PACard';
import { PAResourceLink } from '@frontend/components/controls/PAResourceLink';
import { useLanguage } from '@frontend/contexts/PALanguageContext';

/**
 * Partial component for displaying Previous resources links.
 */
export function PreviousResourcesPartial() {
  const { translation } = useLanguage();

  return (
    <PACard header={translation.about.previousResources}>
      <div className="space-y-3">
        <PAResourceLink
          href="http://previous.alternative-system.com"
          label={translation.about.previousSite}
          domain="previous.alternative-system.com"
        />
        <PAResourceLink
          href="https://sourceforge.net/projects/previous/"
          label={translation.about.previousSourceforge}
          domain="sourceforge.net"
        />
      </div>
    </PACard>
  );
}