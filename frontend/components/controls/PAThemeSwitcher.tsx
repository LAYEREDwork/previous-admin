import { useTheme, ThemeMode } from '../../contexts/PAThemeContext';
import { useLanguage } from '../../contexts/PALanguageContext';
import { PASegmentedControl } from './PASegmentedControl';
import { MdLightMode, MdDarkMode, MdSettings } from 'react-icons/md';
import { PASize } from '../../lib/types/sizes';

export function PAThemeSwitcher() {
  const { mode, setMode } = useTheme();
  const { translation } = useLanguage();

  const options = [
    {
      value: 'light',
      label: translation.theme.light,
      icon: <MdLightMode size={16} />,
    },
    {
      value: 'system',
      label: translation.theme.system,
      icon: <MdSettings size={16} />,
    },
    {
      value: 'dark',
      label: translation.theme.dark,
      icon: <MdDarkMode size={16} />,
    },
  ];

  return (
    <PASegmentedControl
      options={options}
      value={mode}
      onChange={(value) => setMode(value as ThemeMode)}
      size={PASize.sm}
      iconOnly
    />
  );
}