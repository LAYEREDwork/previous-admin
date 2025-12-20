import { FaCheck } from 'react-icons/fa';
import { Dropdown } from 'rsuite';
import { PAButton } from './PAButton';

// Hooks
import { useLanguage } from '../../contexts/LanguageContext';
import { useControlSize } from '../../hooks/useControlSize';

// Types/Utilities
import { Language } from '../../lib/translations';

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
 * PA prefix for Previous Admin
 *
 * Renders a dropdown menu that allows users to switch between available application languages.
 */
export function PALanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const controlSize = useControlSize('sm');

  const sortedLanguages = (Object.keys(languageNames) as Language[]).sort((a, b) =>
    languageNames[a].localeCompare(languageNames[b])
  );

  return (
    <Dropdown
      placement="bottomEnd"
      renderToggle={(props, ref) => (
        <PAButton
          {...props}
          ref={ref as any}
          appearance="default"
          size={controlSize}
          className={`${props.className || ''} min-w-[44px]`}
        >
          <span className="text-lg">{languageFlags[language]}</span>
        </PAButton>
      )}
    >
      {sortedLanguages.map((lang) => (
        <Dropdown.Item
          key={lang}
          onSelect={() => setLanguage(lang)}
          active={language === lang}
        >
          <div className="flex items-center justify-between gap-3 min-w-[140px]">
            <div className="flex items-center gap-2">
              <span className="text-lg">{languageFlags[lang]}</span>
              <span>{languageNames[lang]}</span>
            </div>
            {language === lang && (
              <FaCheck className="text-blue-500" size={12} />
            )}
          </div>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}
