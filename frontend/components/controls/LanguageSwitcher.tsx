import { useLanguage } from '../../contexts/LanguageContext';
import { Language } from '../../lib/translations';
import { Dropdown, Button } from 'rsuite';
import { FaCheck } from 'react-icons/fa';
import { useControlSize } from '../../hooks/useControlSize';

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
 *
 * Renders a dropdown menu that allows users to switch between available application languages.
 * The component displays the current language as a flag emoji with the language name,
 * and provides a sorted list of all available languages in the dropdown menu.
 *
 * @component
 *
 * @description
 * This component integrates with the LanguageContext to manage the application's current language.
 * It provides a user-friendly interface for language selection with visual indicators:
 * - Flag emoji for quick visual identification
 * - Full language name (hidden on small screens)
 * - Check mark indicator for the currently selected language
 * - Alphabetically sorted language list
 *
 * @features
 * - **Multi-language Support**: Supports 8 languages (Dutch, English, French, German, Italian, Portuguese, Spanish, Turkish)
 * - **Responsive Design**: Language name is hidden on small screens, showing only the flag
 * - **Visual Feedback**: Current language is marked with a check icon
 * - **Alphabetical Sorting**: Languages are sorted by their display names for easy navigation
 * - **Accessibility**: Uses semantic HTML and proper ARIA attributes via RSuite components
 *
 * @returns {JSX.Element} A dropdown button component with language selection menu
 *
 * @example
 * ```tsx
 * import { LanguageSwitcher } from './components/LanguageSwitcher';
 *
 * function Header() {
 *   return (
 *     <div className="header">
 *       <LanguageSwitcher />
 *     </div>
 *   );
 * }
 * ```
 *
 * @requires LanguageContext - Must be wrapped in a LanguageProvider
 * @requires RSuite - Uses Dropdown and Button components from RSuite UI library
 *
 * @see {@link ../contexts/LanguageContext} for language context implementation
 * @see {@link ../lib/translations} for available language codes
 */

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const controlSize = useControlSize('sm');

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
          size={controlSize}
        >
          <span className="text-lg">{languageFlags[language]}</span>

        </Button>
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
