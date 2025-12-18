import { useLanguage } from '../../contexts/LanguageContext';
import { useAboutLogic } from '../../hooks/useAbout';
import { VersionInfoPartial } from '../partials/about/VersionInfoPartial';
import { PreviousResourcesPartial } from '../partials/about/PreviousResourcesPartial';
import { LayeredResourcesPartial } from '../partials/about/LayeredResourcesPartial';
import { GeneralResourcesPartial } from '../partials/about/GeneralResourcesPartial';

export function About() {
   const { translation } = useLanguage();
   const { versionInfo, checking, updating, error, handleCheckForUpdates, handleUpdate } = useAboutLogic();

   return (
      <div className="space-y-6">
         <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
               {translation.about.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
               {translation.about.subtitle}
            </p>
         </div>

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
   );
}
