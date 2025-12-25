import { FaCheck } from 'react-icons/fa';
import { PANeomorphDropdown } from './PANeomorphDropdown';
import { PANeomorphButton } from './PANeomorphButton';

// Hooks
import { useLanguage } from '../../contexts/PALanguageContext';
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

const RecessedFlag = ({ flag }: { flag: string }) => (
  <div
    className="flex items-center justify-center w-6 h-6 rounded-full bg-black/20"
    style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.5)' }}
  >
    <span className="text-lg">{flag}</span>
  </div>
);


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
    <PANeomorphDropdown
      placement="bottomEnd"
      renderToggle={(props, ref) => (
        <PANeomorphButton
          {...props}
          ref={ref as React.Ref<HTMLButtonElement>}
          size={controlSize}
          className={`${props.className || ''} min-w-[44px]`}
        >
          <span className="text-lg">{languageFlags[language]}</span>
        </PANeomorphButton>
      )}
    >
      {sortedLanguages.map((lang) => (
        <PANeomorphDropdown.Item
          key={lang}
          onClick={() => setLanguage(lang)}
        >
          <div className="flex items-center justify-between gap-3 min-w-[140px]">
            <div className="flex items-center gap-2">
              <RecessedFlag flag={languageFlags[lang]} />
              <span>{languageNames[lang]}</span>
            </div>
            {language === lang && (
              <FaCheck className="text-blue-500" size={12} />
            )}
          </div>
        </PANeomorphDropdown.Item>
      ))}
    </PANeomorphDropdown>
  );
}
