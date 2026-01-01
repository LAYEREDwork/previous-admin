// Hooks
import { useLanguage } from '../../contexts/PALanguageContext';
import { useAboutLogic } from '../../hooks/useAbout';

// Components
import { VersionInfoPartial } from '../partials/about/PAVersionInfoPartial';
import { PreviousResourcesPartial } from '../partials/about/PAPreviousResourcesPartial';
import { LayeredResourcesPartial } from '../partials/about/PALayeredResourcesPartial';
import { GeneralResourcesPartial } from '../partials/about/PAGeneralResourcesPartial';

export function PAAbout() {
   const { translation } = useLanguage();
   const { versionInfo, checking, updating, error, handleCheckForUpdates, handleUpdate } = useAboutLogic();

   return (
      <div className="space-y-6">
         <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
               {translation.about.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
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
