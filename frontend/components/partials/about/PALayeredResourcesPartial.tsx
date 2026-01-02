import { useLanguage } from '../../../contexts/PALanguageContext';
import { PAResourceLink } from '../../controls/PAResourceLink';
import { PACard } from '../../controls/PACard';

/**
 * Partial component for displaying LAYERED resources links.
 */
export function LayeredResourcesPartial() {
  const { translation } = useLanguage();

  return (
    <PACard header={translation.about.layeredResources}>
      <div className="space-y-3">
        <PAResourceLink
          href="https://layered.work"
          label={translation.about.layeredOfficialWebsite}
          domain="layered.work"
        />
        <PAResourceLink
          href="https://oldbytes.space/@LAYERED"
          label={translation.about.layeredMastodon}
          domain="oldbytes.space"
        />
        <PAResourceLink
          href="https://github.com/LAYEREDwork/previous-admin"
          label={translation.about.layeredGitRepo}
          domain="github.com"
        />
      </div>
    </PACard>
  );
}