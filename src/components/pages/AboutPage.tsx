import { BiLinkExternal, BiInfoCircle, BiRefresh, BiCheck, BiError, BiFile } from 'react-icons/bi';
import { Link } from 'rsuite';
import { useLanguage } from '../../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { checkForUpdates, updateApplication, type VersionInfo } from '../../lib/versionManager';

export function About() {
   const { translation } = useLanguage();
   const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
   const [checking, setChecking] = useState(true);
   const [updating, setUpdating] = useState(false);
   const [error, setError] = useState(false);

   useEffect(() => {
      handleCheckForUpdates();
   }, []);

   const handleCheckForUpdates = async () => {
      setChecking(true);
      setError(false);
      try {
         const info = await checkForUpdates();
         setVersionInfo(info);
      } catch (err) {
         setError(true);
         console.error('Error checking for updates:', err);
      } finally {
         setChecking(false);
      }
   };

   const handleUpdate = async () => {
      setUpdating(true);
      setError(false);
      try {
         await updateApplication();
      } catch (err) {
         console.error('Error updating application:', err);
         setError(true);
         setUpdating(false);
      }
   };

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

         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
               <BiInfoCircle size={20} />
               {translation.system.appVersion}
            </h3>
            <div className="space-y-4">
               {checking ? (
                  <div className="flex items-center gap-2 text-next-accent">
                     <BiRefresh size={16} className="animate-spin" />
                     <span className="text-sm">{translation.system.checkingForUpdates}</span>
                  </div>
               ) : (
                  <>
                     <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{translation.system.currentVersion}:</span>
                        <span className="font-mono font-semibold text-gray-900 dark:text-white">
                           v{versionInfo?.currentVersion || '1.0.0'}
                        </span>
                     </div>

                     {versionInfo?.currentReleaseNotes && (
                        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                           <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                              <BiFile size={14} />
                              <span className="text-xs font-semibold">Current Release Notes</span>
                           </div>
                           <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                              {versionInfo.currentReleaseNotes}
                           </p>
                        </div>
                     )}

                     {error && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                           <BiError size={16} />
                           <span className="text-sm">{translation.system.updateError}</span>
                        </div>
                     )}

                     {versionInfo && !error && (
                        <div className="space-y-3">
                           {versionInfo.updateAvailable ? (
                              <>
                                 <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                    <BiError size={16} />
                                    <span className="text-sm font-semibold">
                                       {translation.system.updateAvailable}: v{versionInfo.latestVersion}
                                    </span>
                                 </div>

                                 {versionInfo.releaseNotes && (
                                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                                       <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
                                          <BiFile size={14} />
                                          <span className="text-xs font-semibold">New Release Notes</span>
                                       </div>
                                       <p className="text-xs text-amber-600 dark:text-amber-400 whitespace-pre-wrap">
                                          {versionInfo.releaseNotes}
                                       </p>
                                    </div>
                                 )}

                                 <button
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                 >
                                    {updating ? (
                                       <>
                                          <BiRefresh size={16} className="animate-spin" />
                                          {translation.system.updating}
                                       </>
                                    ) : (
                                       <>
                                          <BiRefresh size={16} />
                                          {translation.system.updateNow}
                                       </>
                                    )}
                                 </button>
                              </>
                           ) : (
                              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                 <BiCheck size={16} />
                                 <span className="text-sm">{translation.system.upToDate}</span>
                              </div>
                           )}
                        </div>
                     )}

                     <button
                        onClick={handleCheckForUpdates}
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                     >
                        <BiRefresh size={16} />
                        {translation.system.checkForUpdates}
                     </button>
                  </>
               )}
            </div>
         </div>

         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{translation.about.previousResources}</h3>
            <div className="space-y-3">
               <a
                  href="http://previous.alternative-system.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
               >
                  <span className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                     <img
                        src="https://www.google.com/s2/favicons?sz=32&domain=previous.alternative-system.com"
                        alt=""
                        className="w-4 h-4"
                     />
                     {translation.about.previousSite}
                  </span>
                  <BiLinkExternal
                     size={18}
                     className="text-gray-400 group-hover:text-next-accent"
                  />
               </a>
               <a
                  href="https://sourceforge.net/projects/previous/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
               >
                  <span className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                     <img
                        src="https://www.google.com/s2/favicons?sz=32&domain=sourceforge.net"
                        alt=""
                        className="w-4 h-4"
                     />
                     {translation.about.previousSourceforge}
                  </span>
                  <BiLinkExternal
                     size={18}
                     className="text-gray-400 group-hover:text-next-accent"
                  />
               </a>
            </div>
         </div>

         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{translation.about.layeredResources}</h3>
            <div className="space-y-3">
               <a
                  href="https://layered.work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
               >
                  <span className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                     <img
                        src="https://www.google.com/s2/favicons?sz=32&domain=layered.work"
                        alt=""
                        className="w-4 h-4"
                     />
                     {translation.about.layeredOfficialWebsite}
                  </span>
                  <BiLinkExternal
                     size={18}
                     className="text-gray-400 group-hover:text-next-accent"
                  />
               </a>
               <a
                  href="https://oldbytes.space/@LAYERED"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
               >
                  <span className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                     <img
                        src="https://www.google.com/s2/favicons?sz=32&domain=oldbytes.space"
                        alt=""
                        className="w-4 h-4"
                     />
                     {translation.about.layeredMastodon}
                  </span>
                  <BiLinkExternal
                     size={18}
                     className="text-gray-400 group-hover:text-next-accent"
                  />
               </a>
               <a
                  href="https://codeberg.org/phranck"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
               >
                  <span className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                     <img
                        src="https://www.google.com/s2/favicons?sz=32&domain=codeberg.org"
                        alt=""
                        className="w-4 h-4"
                     />
                     {translation.about.layeredCodeberg}
                  </span>
                  <BiLinkExternal
                     size={18}
                     className="text-gray-400 group-hover:text-next-accent"
                  />
               </a>
            </div>
         </div>

         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{translation.about.generalResources}</h3>
            <div className="space-y-3">
               <a
                  href="https://en.wikipedia.org/wiki/NeXT_Computer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
               >
                  <span className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                     <img
                        src="https://www.google.com/s2/favicons?sz=32&domain=wikipedia.org"
                        alt=""
                        className="w-4 h-4"
                     />
                     {translation.about.nextWikipedia}
                  </span>
                  <BiLinkExternal
                     size={18}
                     className="text-gray-400 group-hover:text-next-accent"
                  />
               </a>
            </div>
         </div>

         {/* Footer removed and moved to Layout.tsx */}
      </div>
   );
}
