import { SFDesktopcomputer, SFMoonStars, SFSunMax } from '@frontend/components/sf-symbols';

import { useLanguage } from '../../contexts/PALanguageContext';
import { useTheme, ThemeMode } from '../../contexts/PAThemeContext';
import { PASize } from '../../lib/types/sizes';

import { PASegmentedControl } from './PASegmentedControl';

export function PAThemeSwitcher() {
  const { mode, setMode } = useTheme();
  const { translation } = useLanguage();

  const options = [
    {
      value: 'light',
      label: translation.theme.light,
      icon: <SFSunMax size={16} />,
    },
    {
      value: 'system',
      label: translation.theme.system,
      icon: <SFDesktopcomputer size={16} />,
    },
    {
      value: 'dark',
      label: translation.theme.dark,
      icon: <SFMoonStars size={16} />,
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