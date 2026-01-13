import { Dropdown, Button } from 'rsuite';

import { SFCheckmarkCircle } from 'sf-symbols-lib';
import { useLanguage } from '@frontend/contexts/PALanguageContext';
import { Language } from '@frontend/lib/translations';
import { PASize, PASizeConfig } from '@frontend/lib/types/sizes';

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
 * Now using RSuite Dropdown with configurable sizing.
 * 
 * @param size The size of the language switcher (xs, sm, md, lg, xl)
 */
export function PALanguageSwitcher({ size = PASize.sm }: { size?: typeof PASize[keyof typeof PASize] } = {}) {
  const { language, setLanguage } = useLanguage();
  const config = PASizeConfig[size as keyof typeof PASizeConfig];

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
          size={config.buttonSize}
          title="Language switcher"
        >
          <span style={{ fontSize: `${config.iconSize}px` }}>{languageFlags[language]}</span>
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
              <span style={{ fontSize: `${config.iconSize}px` }}>{languageFlags[lang]}</span>
              <span>{languageNames[lang]}</span>
            </div>
            {language === lang && (
              <SFCheckmarkCircle size={config.iconSize} color="currentColor" className="flex-shrink-0" />
            )}
          </div>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}
