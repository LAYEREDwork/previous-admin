// Hooks
import { useLanguage } from '../../contexts/PALanguageContext';
import { useAboutLogic } from '../../hooks/useAbout';

// Components
import { GeneralResourcesPartial } from '../partials/about/PAGeneralResourcesPartial';
import { LayeredResourcesPartial } from '../partials/about/PALayeredResourcesPartial';
import { PreviousResourcesPartial } from '../partials/about/PAPreviousResourcesPartial';
import { VersionInfoPartial } from '../partials/about/PAVersionInfoPartial';

export function PAAbout() {
   const { translation } = useLanguage();
   const { versionInfo, checking, updating, error, handleCheckForUpdates, handleUpdate } = useAboutLogic();

   return (
      <div className="space-y-6">
         <div>
            <h2 className="text-2xl font-bold text-[var(--rs-text-primary)] mb-2">
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
      </div>
   );
}
