// Hooks
import { PageWrapper } from '@frontend/components/controls/PAPageWrapper';
import { useAboutLogic } from '@frontend/hooks/useAbout';
import { usePageBase } from '@frontend/hooks/usePageBase';

// Components
import { GeneralResourcesPartial } from '../partials/about/PAGeneralResourcesPartial';
import { LayeredResourcesPartial } from '../partials/about/PALayeredResourcesPartial';
import { PreviousResourcesPartial } from '../partials/about/PAPreviousResourcesPartial';
import { VersionInfoPartial } from '../partials/about/PAVersionInfoPartial';

export function PAAbout() {
   const { translation } = usePageBase();
   const { versionInfo, checking, updating, error, handleCheckForUpdates, handleUpdate } = useAboutLogic();

   return (
      <PageWrapper>
         <div>
            <h2 className="text-sm font-semibold text-[var(--rs-text-primary)] mb-2">
               {translation.about.title}
            </h2>
            <p className="text-[var(--rs-text-secondary)]">
               {translation.about.subtitle}
            </p>
         </div>

         <div className="flex flex-col w-full gap-6">
            <VersionInfoPartial
               versionInfo={versionInfo}
               checking={checking}
               updating={updating}
               error={error}
               handleCheckForUpdates={handleCheckForUpdates}
               handleUpdate={handleUpdate}
            />
            <PreviousResourcesPartial />
            <LayeredResourcesPartial />
            <GeneralResourcesPartial />
         </div>
      </PageWrapper>
   );
}
