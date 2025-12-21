import { BiLinkExternal } from 'react-icons/bi';
import { useLanguage } from '../../../contexts/PALanguageContext';

/**
 * Partial component for displaying Previous resources links.
 */
export function PreviousResourcesPartial() {
  const { translation } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
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
  );
}