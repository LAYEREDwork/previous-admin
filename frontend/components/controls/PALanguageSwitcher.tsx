import { FaCheck } from 'react-icons/fa';
import { Dropdown, Button } from 'rsuite';

// Hooks
import { useLanguage } from '../../contexts/PALanguageContext';

// Types/Utilities
import { Language } from '../../lib/translations';
import { PASize } from '../../lib/types/sizes';

const languageNames: Record<Language, string> = {
  en: 'English',
  de: 'Deutsch',
  it: 'Italiano',
  es: 'Español',
  fr: 'Français',
};

const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  de: '🇩🇪',
  it: '🇮🇹',
  es: '🇪🇸',
  fr: '🇫🇷',
};

/**
 * Language Switcher Component
 * Now using RSuite Dropdown.
 */
export function PALanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const sortedLanguages = (Object.keys(languageNames) as Language[]).sort((a, b) =>
    languageNames[a].localeCompare(languageNames[b])
  );

  return (
    <Dropdown
      placement="bottomEnd"
      renderToggle={(props, ref) => (
        <Button
          {...props}
          ref={ref}
          appearance="default"
          size={PASize.sm}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{languageFlags[language]}</span>
            <span className="text-sm">{languageNames[language]}</span>
          </div>
        </Button>
      )}
    >
      {sortedLanguages.map((lang) => (
        <Dropdown.Item
          key={lang}
          onClick={() => setLanguage(lang)}
          active={language === lang}
        >
          <div className="flex items-center justify-between gap-3 min-w-[140px]">
            <div className="flex items-center gap-2">
              <span className="text-lg">{languageFlags[lang]}</span>
              <span>{languageNames[lang]}</span>
            </div>
            {language === lang && (
              <FaCheck size={12} />
            )}
          </div>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}
