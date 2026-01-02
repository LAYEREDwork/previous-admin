import { useLanguage } from '../../../contexts/PALanguageContext';
import { PAResourceLink } from '../../controls/PAResourceLink';
import { PACard } from '../../controls/PACard';

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