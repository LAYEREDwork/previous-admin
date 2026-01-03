import { useLanguage } from '../../../contexts/PALanguageContext';
import { PACard } from '../../controls/PACard';
import { PAResourceLink } from '../../controls/PAResourceLink';

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