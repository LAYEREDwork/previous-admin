import { BiLinkExternal } from 'react-icons/bi';
import { useLanguage } from '../../../contexts/LanguageContext';

/**
 * Partial component for displaying LAYERED resources links.
 */
export function LayeredResourcesPartial() {
  const { translation } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
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
  );
}